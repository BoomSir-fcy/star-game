import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MysteryBoxCom,
  mysteryBoxQualities,
  MysteryBoxQualities,
} from 'components/MysteryBoxComNew';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { BackButton, Box, Button, Dots, Flex, Skeleton, Text } from 'uikit';
import { getWEtherAddress } from 'utils/addressHelpers';
import { TokenImage } from 'components/TokenImage';
import { mysteryConfig } from 'components/MysteryBoxComNew/config';
import { QualityColor } from 'uikit/theme/colors';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { useFetchBoxView } from 'state/mysteryBox/hooks';
import { storeAction, useStore } from 'state';
import { getBalanceNumber } from 'utils/formatBalance';
import BigNumber from 'bignumber.js';
import {
  fetchUserKeysAsync,
  fetchBoxViewAsync,
} from 'state/mysteryBox/reducer';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from 'contexts/ToastsContext';
import eventBus from 'utils/eventBus';
import { useGuide } from 'hooks/useGuide';
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';
import styled, { createGlobalStyle } from 'styled-components';
import { useBuyMysteryBox, useOpenMysteryBox } from './hooks';
import { queryMintEvent } from './event';

const GlobalStyle = createGlobalStyle<{
  interactive?: boolean;
}>`
  ${({ interactive }) => {
    return interactive
      ? `
    *{
      pointer-events: none;
    }
    .introjs-showElement, .introjs-showElement *, .introjs-tooltip, .introjs-tooltip *{
      pointer-events: auto;
    }
    `
      : '';
  }};
`;
const StateFlex = styled(Flex)`
  height: 100vw;
  ${({ theme }) => theme.mediaQueries.md} {
    height: 100vh;
  }
`;
const BackButtonStyled = styled(BackButton)`
  position: absolute;
  top: 15px;
  right: 22px;
`;
const State = () => {
  const { t, getHTML } = useTranslation();
  const paramsQs = useParsedQueryString();
  const { account } = useWeb3React();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [buyNum, setBuyNum] = useState(5);

  const { toastError } = useToast();
  useFetchBoxView();

  const { priceBNB, maxHeld, boxCount, loading } = useStore(
    p => p.mysteryBox.boxView,
  );

  // 控制是否开启新手指导的
  const location = useLocation();
  const { guides, setGuide } = useGuide(location.pathname);
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [activeStep, setActiveStep] = useState(guides.step);
  const steps = useMemo(() => {
    return [
      {
        element: '.mystery-state-step0',
        intro: t('GuideMysteryStateStep0'),
      },
      {
        element: '.mystery-state-step1',
        intro: t('GuideMysteryStateStep1'),
        interactive: true,
      },
    ];
  }, [t]);

  React.useEffect(() => {
    return () => {
      dispatch(storeAction.toggleVisible({ visible: false }));
    };
  }, [dispatch]);

  const quality = useMemo(() => {
    const q = Number(paramsQs.q) as MysteryBoxQualities;
    if (Object.values(mysteryBoxQualities).includes(q)) return q;
    return mysteryBoxQualities.ORDINARY;
  }, [paramsQs.q]);

  // 行星品质
  const info = useMemo(() => {
    if (mysteryConfig[quality]) {
      return mysteryConfig[quality];
    }
    return mysteryConfig[mysteryBoxQualities.ORDINARY];
  }, [quality]);

  // 价格
  const price = useMemo(() => {
    return getBalanceNumber(new BigNumber(priceBNB[quality]).times(buyNum), 18);
  }, [priceBNB, quality, buyNum]);

  // 持有盲盒数量
  const ownedNum = useMemo(() => {
    return new BigNumber(boxCount[quality]).toNumber() || 0;
  }, [boxCount, quality]);

  // 购买盲盒
  const [handleLoading, setHandleLoading] = useState(false);
  const { handleBuy } = useBuyMysteryBox();
  const onHandleBuy = useCallback(async () => {
    try {
      setHandleLoading(true);
      const res = await handleBuy(quality, priceBNB[quality], buyNum);
      dispatch(fetchUserKeysAsync(account));
      setHandleLoading(false);
    } catch (e: any) {
      setHandleLoading(false);
      // toastError(
      //   'Please try again. Confirm the transaction and make sure you are paying enough gas!',
      // );
      console.error(e);
      const msg = e?.data?.message;
      const errorMsg = msg?.substring(
        msg?.indexOf('execution reverted: ') + 20,
      );
      if (errorMsg) toastError(t(errorMsg));
      else
        toastError(
          'Please try again. Confirm the transaction and make sure you are paying enough gas!',
        );
    }
  }, [
    buyNum,
    account,
    quality,
    handleBuy,
    priceBNB,
    setHandleLoading,
    dispatch,
    toastError,
    t,
  ]);

  const { handleOpen } = useOpenMysteryBox();
  const fetchHandle = useCallback(async () => {
    if (account) {
      const event = await queryMintEvent(account);
      return event;
    }
    return [];
  }, [account]);

  // 递归扫描获得星球id
  const getPlanetId = useCallback(
    async (blockHash: string) => {
      const event = await fetchHandle();
      if (!blockHash || !event.length) return null;
      const index = event.findIndex(
        item => item.blockHash?.toLowerCase() === blockHash.toLowerCase(),
      );
      if (index === -1) {
        getPlanetId(blockHash);
      }
      const eventArgs = event.filter(
        item => item.blockHash?.toLowerCase() === blockHash.toLowerCase(),
      );
      const ids = eventArgs?.map(item =>
        new BigNumber(item?.args?.planetId?.toJSON().hex).toNumber(),
      );
      return ids;
    },
    [fetchHandle],
  );

  // 打开多个盲盒，使用默认命名（新）
  const handleOpenBox = useCallback(async () => {
    try {
      setHandleLoading(true);
      // console.log(quality, buyNum);
      const res = await handleOpen(quality, '', ownedNum);
      const ids = await getPlanetId(res?.blockHash);
      dispatch(fetchUserKeysAsync(account));
      setHandleLoading(false);
      navigate(`/mystery-box/list?q=${quality}&i=${ids?.join(',')}`, {
        replace: true,
      });
    } catch (e: any) {
      setHandleLoading(false);
      // toastError(
      //   'Please try again. Confirm the transaction and make sure you are paying enough gas!',
      // );
      console.error(e);
      const msg = e?.data?.message;
      const errorMsg = msg?.substring(
        msg?.indexOf('execution reverted: ') + 20,
      );
      if (errorMsg) toastError(t(errorMsg));
      else
        toastError(
          'Please try again. Confirm the transaction and make sure you are paying enough gas!',
        );
    }
  }, [
    account,
    ownedNum,
    quality,
    handleOpen,
    navigate,
    getPlanetId,
    dispatch,
    toastError,
    t,
  ]);

  useEffect(() => {
    fetchHandle();
  }, [fetchHandle]);

  const existBox = useMemo(() => {
    return !!ownedNum;
  }, [ownedNum]);

  const maxNum = useMemo(() => {
    return new BigNumber(maxHeld).toNumber();
  }, [maxHeld]);

  const onRefreshClick = useCallback(() => {
    dispatch(fetchBoxViewAsync(account));
    dispatch(fetchUserKeysAsync(account));
  }, [account, dispatch]);

  // 监听刷新事件
  React.useEffect(() => {
    eventBus.addEventListener('onRefresh', onRefreshClick);
    return () => {
      eventBus.removeEventListener('onRefresh', onRefreshClick);
    };
  }, [onRefreshClick]);

  return (
    <StateFlex
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
    >
      {!guides.guideFinish && guides.finish && steps.length - 1 > guides.step && (
        <>
          <GlobalStyle
            interactive={steps[activeStep]?.interactive && stepsEnabled}
          />
          <Steps
            enabled={stepsEnabled}
            steps={steps}
            initialStep={guides.step}
            options={{
              exitOnOverlayClick: false,
              tooltipPosition: 'top',
              scrollPadding: 0,
            }}
            onChange={currentStep => {
              if (currentStep > guides.step) {
                setGuide(currentStep);
              }
            }}
            onBeforeChange={event => {
              setActiveStep(event);
            }}
            onExit={index => {
              setStepsEnabled(false);
              if (index < steps.length - 1) {
                dispatch(
                  storeAction.toggleVisible({
                    visible: true,
                    lastStep: steps.length,
                  }),
                );
              }
            }}
          />
        </>
      )}
      <BackButtonStyled />
      <MysteryBoxCom
        width={1440}
        height={800}
        rotate={0}
        left={0}
        right={0}
        top={-200}
        quality={quality}
      />
      <Flex
        mt='300px'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
      >
        <Flex
          className='mystery-state-step0'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
        >
          <Text fontSize='22px' bold>
            {t('OpenMysteryBoxDesc1')}
          </Text>
          <Flex mt='20px'>
            <Text mr='20px' fontSize='22px' bold>
              {t('OpenMysteryBoxDesc2-1')}
            </Text>
            {info.rarity.map(item => (
              <Text
                mr='20px'
                key={item}
                color={QualityColor[item]}
                fontSize='22px'
                bold
              >
                {t(`rarity-${item}`)}
              </Text>
            ))}
            <Text fontSize='22px' bold>
              {t('OpenMysteryBoxDesc2-2')}
            </Text>
          </Flex>
        </Flex>

        <Box mt='90px' className='mystery-state-step1'>
          {!existBox && (
            <Flex justifyContent='center'>
              <Box width={30}>
                <TokenImage width={30} height={30} tokenAddress='BNB' />
              </Box>
              <Text ml='15px' fontSize='22px' bold>
                {t('BNB')}
              </Text>
              {loading ? (
                <Skeleton height={40} />
              ) : (
                <Text ml='15px' fontSize='22px' fontStyle='normal' bold mark>
                  {price}
                </Text>
              )}
            </Flex>
          )}

          <Flex mt='28px' justifyContent='center'>
            {existBox ? (
              <Button
                width='280px'
                height='91px'
                variant='vs'
                disabled={handleLoading || loading || !ownedNum}
                onClick={() => {
                  // setVisible(true);
                  handleOpenBox();
                }}
              >
                {handleLoading ? (
                  <Dots>{t('Opening')}</Dots>
                ) : (
                  <Text fontSize='22px' bold>
                    {t('Open')}
                  </Text>
                )}
              </Button>
            ) : (
              <Button
                width='280px'
                height='91px'
                variant='vs'
                disabled={handleLoading || loading || !maxNum}
                onClick={onHandleBuy}
              >
                {handleLoading ? (
                  <Dots>{t('Purchasing')}</Dots>
                ) : (
                  <Text fontSize='22px' bold>
                    {t('Buy')}
                  </Text>
                )}
              </Button>
            )}
          </Flex>
        </Box>
      </Flex>
    </StateFlex>
  );
};

export default State;
