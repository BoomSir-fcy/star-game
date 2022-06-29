import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MysteryBoxCom,
  mysteryBoxQualities,
  MysteryBoxQualities,
} from 'components/MysteryBoxComNew';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { Box, Button, Dots, Flex, Skeleton, Text } from 'uikit';
import { getWEtherAddress } from 'utils/addressHelpers';
import { TokenImage } from 'components/TokenImage';
import { mysteryConfig } from 'components/MysteryBoxComNew/config';
import { QualityColor } from 'uikit/theme/colors';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { useFetchBoxView } from 'state/mysteryBox/hooks';
import { useStore } from 'state';
import { getBalanceNumber } from 'utils/formatBalance';
import BigNumber from 'bignumber.js';
import {
  fetchUserKeysAsync,
  fetchBoxViewAsync,
} from 'state/mysteryBox/reducer';
import { useNavigate } from 'react-router-dom';
import eventBus from 'utils/eventBus';
import { useBuyMysteryBox, useOpenMysteryBox } from './hooks';
import { queryMintEvent } from './event';

const State = () => {
  const { t } = useTranslation();
  const paramsQs = useParsedQueryString();
  const { account } = useWeb3React();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [buyNum, setBuyNum] = useState(5);

  useFetchBoxView();

  const { priceBNB, maxHeld, boxCount, loading } = useStore(
    p => p.mysteryBox.boxView,
  );

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
    setHandleLoading,
    dispatch,
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
      const res = await handleOpen(quality, '', buyNum);
      const ids = await getPlanetId(res?.blockHash);
      dispatch(fetchUserKeysAsync(account));
      setHandleLoading(false);
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
    <Flex flexDirection='column' justifyContent='center' alignItems='center'>
      <MysteryBoxCom rotate={0} left={0} right={0} quality={quality} />
      <Flex mt='180px' flexDirection='column' justifyContent='center'>
        <Text fontSize='22px' bold>
          {t('OpenMysteryBoxDesc')}
        </Text>
        <Flex mt='20px'>
          {info.rarity.map(item => (
            <Text
              mr='30px'
              key={item}
              color={QualityColor[item]}
              fontSize='22px'
              bold
            >
              {t(`rarity-${item}`)}
            </Text>
          ))}
        </Flex>
        <Flex mt='85px' justifyContent='center'>
          <Box width={30}>
            <TokenImage
              width={30}
              height={30}
              tokenAddress={getWEtherAddress()}
            />
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
                  {t('Open blind box')}
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
                  {t('Buy blind box')}
                </Text>
              )}
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default State;
