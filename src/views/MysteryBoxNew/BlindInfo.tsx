import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MysteryBoxCom,
  mysteryBoxQualities,
  MysteryBoxQualities,
} from 'components/MysteryBoxComNew';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { Image, Box, Button, Dots, Flex, Skeleton, Text } from 'uikit';
import { getGetStkbnbAddress, getWEtherAddress } from 'utils/addressHelpers';
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
import { useNavigate } from 'react-router-dom';
import { useToast } from 'contexts/ToastsContext';
import eventBus from 'utils/eventBus';
import 'intro.js/introjs.css';
import styled from 'styled-components';
import { FetchApproveNum, useRWA } from 'components/NavPop/hook';
import { useBuyMysteryBox, useOpenMysteryBox } from './hooks';
import { queryMintEvent } from './event';

const BlindInfo: React.FC<{
  quality: number;
  approvedNum: number;
  ApprovePending: boolean;
  onApprove: () => void;
}> = ({ quality, approvedNum, onApprove, ApprovePending }) => {
  const { t, getHTML } = useTranslation();
  const { account } = useWeb3React();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [buyNum, setBuyNum] = useState(5);
  const { toastError } = useToast();
  useFetchBoxView();

  const { priceBNB, maxHeld, boxCount, loading, stkBnbRate } = useStore(
    p => p.mysteryBox.boxView,
  );

  React.useEffect(() => {
    return () => {
      dispatch(storeAction.toggleVisible({ visible: false }));
    };
  }, [dispatch]);

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

  // stkbnb价格
  const stkPrice = useMemo(() => {
    return new BigNumber(stkBnbRate).div(10000).times(price).toNumber();
  }, [price, stkBnbRate]);

  // 持有盲盒数量
  const ownedNum = useMemo(() => {
    return new BigNumber(boxCount[quality]).toNumber() || 0;
  }, [boxCount, quality]);

  // 购买盲盒
  const [handleLoading, setHandleLoading] = useState(false);
  const [handleStkLoading, sethandleStkLoading] = useState(false);
  const { handleBuy, handleBuyWithStkBnb } = useBuyMysteryBox();
  const onHandleBuy = useCallback(
    async type => {
      try {
        if (type === 'BNB') {
          setHandleLoading(true);
          const res = await handleBuy(quality, priceBNB[quality], buyNum);
        } else {
          sethandleStkLoading(true);
          const res = await handleBuyWithStkBnb(quality, buyNum);
        }
        dispatch(fetchUserKeysAsync(account));
      } catch (e: any) {
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
      } finally {
        if (type === 'BNB') {
          setHandleLoading(false);
        } else {
          sethandleStkLoading(false);
        }
      }
    },
    [
      buyNum,
      account,
      quality,
      handleBuy,
      handleBuyWithStkBnb,
      priceBNB,
      setHandleLoading,
      dispatch,
      toastError,
      t,
      sethandleStkLoading,
    ],
  );

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
    <Flex
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      width='30%'
      mr='50px'
    >
      <Flex alignItems='center' justifyContent='center' flexWrap='wrap'>
        <Text mr='10px' fontSize='16px' bold>
          {t('OpenMysteryBoxDesc2-1-1')}
        </Text>
        {info.rarity.map(item => (
          <Text
            mr='10px'
            key={item}
            color={QualityColor[item]}
            fontSize='18px'
            bold
          >
            {t(`rarity-${item}`)}
          </Text>
        ))}
        <Text fontSize='16px' bold>
          {t('OpenMysteryBoxDesc2-2')}
        </Text>
      </Flex>
      <Flex width='80%' justifyContent='space-around' mt='20px'>
        {/* bnb */}
        <Box>
          <Flex alignItems='center' justifyContent='center'>
            <Box width={40}>
              <TokenImage width={40} height={40} tokenAddress='BNB' />
            </Box>
            <Box ml='15px'>
              <Text bold>{t('BNB')}</Text>
              {loading ? (
                <Skeleton height={40} />
              ) : (
                <Text fontSize='22px' fontStyle='normal' bold mark>
                  {price}
                </Text>
              )}
            </Box>
          </Flex>
          {!existBox && (
            <Flex mt='28px' justifyContent='center'>
              <Button
                width='180px'
                height='55px'
                variant='vs'
                disabled={
                  handleLoading || loading || !maxNum || handleStkLoading
                }
                onClick={() => onHandleBuy('BNB')}
              >
                {handleLoading ? (
                  <Text fontSize='18px' bold>
                    <Dots>{t('Purchasing')}</Dots>
                  </Text>
                ) : (
                  <Text fontSize='18px' bold>
                    {t('Buy Blind Box')}
                  </Text>
                )}
              </Button>
            </Flex>
          )}
        </Box>
        {/* stkbnb */}
        <Box>
          <Flex alignItems='center' justifyContent='center'>
            <Box width={40}>
              <Image width={40} height={40} src='/images/tokens/stknbnb.svg' />
            </Box>
            <Box ml='15px'>
              <Text bold>{t('stkBNB')}</Text>
              {loading ? (
                <Skeleton height={40} />
              ) : (
                <Text fontSize='22px' fontStyle='normal' bold mark>
                  {stkPrice}
                </Text>
              )}
            </Box>
          </Flex>
          {!existBox && (
            <Flex mt='28px' justifyContent='center'>
              {approvedNum <= 0 ? (
                <Button
                  width='180px'
                  height='55px'
                  variant='vs'
                  disabled={ApprovePending || loading}
                  onClick={() => onApprove()}
                >
                  {ApprovePending ? (
                    <Text fontSize='18px' bold>
                      <Dots>{t('Approving')}</Dots>
                    </Text>
                  ) : (
                    <Text fontSize='18px' bold>
                      {t('Approve')}
                    </Text>
                  )}
                </Button>
              ) : (
                <Button
                  width='180px'
                  height='55px'
                  variant='vs'
                  disabled={
                    handleStkLoading || loading || !maxNum || handleLoading
                  }
                  onClick={() => onHandleBuy('stkBNB')}
                >
                  {handleStkLoading ? (
                    <Text fontSize='18px' bold>
                      <Dots>{t('Purchasing')}</Dots>
                    </Text>
                  ) : (
                    <Text fontSize='18px' bold>
                      {t('Buy Blind Box')}
                    </Text>
                  )}
                </Button>
              )}
            </Flex>
          )}
        </Box>
      </Flex>
      {existBox && (
        <Flex mt='20px' justifyContent='center'>
          <Button
            width='180px'
            height='55px'
            variant='vs'
            disabled={handleLoading || loading || !ownedNum}
            onClick={() => {
              // setVisible(true);
              handleOpenBox();
            }}
          >
            {handleLoading ? (
              <Text fontSize='18px' bold>
                <Dots>{t('Opening')}</Dots>
              </Text>
            ) : (
              <Text fontSize='22px' bold>
                {t('Open')}
              </Text>
            )}
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default BlindInfo;
