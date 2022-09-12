import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import 'intro.js/introjs.css';

import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import {
  Box,
  Text,
  BgCard,
  Flex,
  Card,
  Image,
  Button,
  Skeleton,
  Dots,
  InputNumber,
} from 'uikit';
import Layout from 'components/Layout';
import {
  MysteryBoxStyled,
  MysteryBoxBaseStyled,
  MysteryBoxBoxStyled,
  mysteryBoxQualities,
  MysteryBoxQualities,
} from 'components/MysteryBoxCom';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { TokenImage } from 'components/TokenImage';
import { getBalanceNumber } from 'utils/formatBalance';
import { getDsgAddress, getWEtherAddress } from 'utils/addressHelpers';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useGuide } from 'hooks/useGuide';
import { mysteryConfig } from 'components/MysteryBoxCom/config';
import { useFetchBoxView } from 'state/mysteryBox/hooks';
import { useStore } from 'state';
import { useTranslation } from 'contexts/Localization';
import { useDispatch } from 'react-redux';
import { fetchUserKeysAsync } from 'state/mysteryBox/reducer';
import { useToast } from 'contexts/ToastsContext';
import { useBuyMysteryBox, useOpenMysteryBox } from './hooks';
import OpenModal from './components/OpenModal';
import { queryMintEvent } from './event';

const CardStyled = styled(Card)<{ height?: string }>`
  width: 696px;
  height: ${({ height }) => height || '145px'};
  padding: 0 35px;
`;

const MysteryBoxState = () => {
  const paramsQs = useParsedQueryString();
  const navigate = useNavigate();

  useFetchBoxView();
  const { priceBNB, seedBlocks, maxHeld, boxCount, loading } = useStore(
    p => p.mysteryBox.boxView,
  );
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [buyNum, setBuyNum] = useState(1);

  const quality = useMemo(() => {
    const q = Number(paramsQs.q) as MysteryBoxQualities;

    if (Object.values(mysteryBoxQualities).includes(q)) return q;
    return mysteryBoxQualities.ORDINARY;
  }, [paramsQs.q]);
  const price = useMemo(() => {
    return getBalanceNumber(new BigNumber(priceBNB[quality]).times(buyNum), 18);
  }, [priceBNB, quality, buyNum]);

  // 持有盲盒数量
  const ownedNum = useMemo(() => {
    return new BigNumber(boxCount[quality]).toNumber() || 0;
  }, [boxCount, quality]);

  const [bought, setBought] = useState(false);
  const [handleLoading, setHandleLoading] = useState(false);
  const { handleBuy } = useBuyMysteryBox();
  const onHandleBuy = useCallback(async () => {
    try {
      setHandleLoading(true);
      const res = await handleBuy(quality, priceBNB[quality], buyNum);
      dispatch(fetchUserKeysAsync(account));
      setHandleLoading(false);
      setBought(true);
    } catch (error) {
      setHandleLoading(false);

      console.error(error);
    }
  }, [
    buyNum,
    account,
    quality,
    handleBuy,
    priceBNB,
    setBought,
    setHandleLoading,
    dispatch,
  ]);

  const { handleOpen } = useOpenMysteryBox();
  const [visible, setVisible] = useState(false);
  const [openedBox, setOpenedBox] = useState(false);

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

  // 打开单个盲盒，能给星球命名（旧）
  const onHandleOpen = useCallback(
    async name => {
      try {
        const res = await handleOpen(quality, name);
        // const event = await fetchHandle();
        const planetId = await getPlanetId(res?.blockHash);
        // 盲盒打开特效视频
        setOpenedBox(true);
        setBought(false);
        setTimeout(() => {
          setVisible(false);
          navigate(`/mystery-box/detail?i=${planetId[0]}`);
        }, 3000);
      } catch (error) {
        console.error(error);
      }
    },
    [quality, handleOpen, setBought, navigate, getPlanetId],
  );

  // 打开多个盲盒，使用默认命名（新）
  const handleOpenBox = useCallback(async () => {
    try {
      setHandleLoading(true);
      const res = await handleOpen(quality, '', buyNum);
      const ids = await getPlanetId(res?.blockHash);
      dispatch(fetchUserKeysAsync(account));
      setHandleLoading(false);
      // navigate(`/star/planet`);
      navigate(`/mystery-box/list?q=${quality}&i=${ids?.join(',')}`);
    } catch (error) {
      setHandleLoading(false);
      console.error(error);
    }
  }, [account, buyNum, quality, handleOpen, navigate, getPlanetId, dispatch]);

  useEffect(() => {
    fetchHandle();
  }, [fetchHandle]);

  const existBox = useMemo(() => {
    // return Boolean(Number(seedBlocks[quality])) || bought;
    return !!ownedNum;
    // }, [seedBlocks, quality, bought]);
  }, [ownedNum]);

  const location = useLocation();
  // 控制是否开启新手指导的
  const { guides, setGuide } = useGuide(location.pathname);
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const steps = React.useMemo(() => {
    return [
      {
        element: '.mystery-state-step0',
        intro: t('Click the button to start the star sea immediately~~'),
      },
    ];
  }, [t]);

  const maxNum = useMemo(() => {
    return new BigNumber(maxHeld).toNumber();
  }, [maxHeld]);
  return (
    <Layout>
      {!guides.guideFinish && guides.finish && steps.length - 1 >= guides.step && (
        <Steps
          enabled={stepsEnabled}
          steps={steps}
          initialStep={guides.step}
          options={{
            exitOnOverlayClick: false,
          }}
          onChange={currentStep => {
            if (currentStep > guides.step) {
              setGuide(currentStep);
            }
          }}
          onBeforeChange={event => {
            console.log(event);
          }}
          onExit={currentStep => {
            setGuide(1);
            setStepsEnabled(false);
          }}
        />
      )}
      <BgCard margin='auto' variant='longMedium'>
        <Box
          className='mystery-state-step0'
          width='98%'
          height='94%'
          position='absolute'
          top='0%'
          left='1%'
          zIndex={-1}
        />
        <Flex alignItems='center' justifyContent='center'>
          <MysteryBoxStyled>
            <MysteryBoxBaseStyled quality={quality} />
            <MysteryBoxBoxStyled quality={quality} />
          </MysteryBoxStyled>
          <Box>
            <CardStyled height='175px'>
              <Flex height='100%' alignItems='center'>
                <Box width={100}>
                  <Image
                    width={100}
                    height={100}
                    src={`/images/mystery-box/g-${mysteryConfig[quality]?.srcName}.png`}
                  />
                </Box>
                <Box ml='20px'>
                  <Text fontSize='24px' color='textTips'>
                    {mysteryConfig[quality]?.label}
                  </Text>
                  <Text>{mysteryConfig[quality]?.tips}</Text>
                  <Flex mt='14px' justifyContent='space-between'>
                    <Text fontSize='24px' color='textTips'>
                      {t('Maximum number: ')} {maxNum}
                    </Text>
                    <Text fontSize='24px' color='textTips'>
                      {t('Owned: ')} {ownedNum}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </CardStyled>
            <CardStyled mt='23px'>
              <Flex
                height='100%'
                alignItems='center'
                justifyContent='space-between'
              >
                <Flex alignItems='center'>
                  <Box width={100}>
                    <TokenImage width={80} height={80} tokenAddress='BNB' />
                  </Box>
                  <Box ml='20px'>
                    <Text color='textTips'>{t('BNB Value')}</Text>
                    {loading ? <Skeleton height={40} /> : <Text>{price} </Text>}
                  </Box>
                </Flex>
                <Flex flexDirection='column' alignItems='flex-end'>
                  <Text mb='10px' color='textTips'>
                    {existBox ? t('Open quantity') : t('Purchase quantity')}
                  </Text>
                  <InputNumber
                    disabled={
                      handleLoading ||
                      loading ||
                      (existBox ? !ownedNum : !maxNum)
                    }
                    value={buyNum}
                    max={existBox ? ownedNum : maxNum}
                    onChangeNum={val => {
                      setBuyNum(val);
                    }}
                  />
                </Flex>
              </Flex>
            </CardStyled>
            <Flex mt='34px' justifyContent='center'>
              {existBox ? (
                <Button
                  disabled={handleLoading || loading || !ownedNum}
                  onClick={() => {
                    // setVisible(true);
                    handleOpenBox();
                  }}
                >
                  {handleLoading ? (
                    <Dots>{t('Opening')}</Dots>
                  ) : (
                    <Text fontSize='inherit'>{t('Open')}</Text>
                  )}
                </Button>
              ) : (
                <Button
                  disabled={handleLoading || loading || !maxNum}
                  onClick={onHandleBuy}
                >
                  {handleLoading ? (
                    <Dots>{t('Purchasing')}</Dots>
                  ) : (
                    <Text fontSize='inherit'>{t('Buy')}</Text>
                  )}
                </Button>
              )}
            </Flex>
          </Box>
        </Flex>
      </BgCard>
      <OpenModal
        visible={visible}
        openedBox={openedBox}
        quality={quality}
        onClose={() => {
          setVisible(false);
          setOpenedBox(false);
        }}
        onOpen={onHandleOpen}
      />
    </Layout>
  );
};

export default MysteryBoxState;
