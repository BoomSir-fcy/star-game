import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  BgCard,
  Box,
  Text,
  Flex,
  BackButton,
  RefreshButton,
  Card,
  Image,
  Button,
  Dots,
} from 'uikit';
import {
  Layout,
  ConnectWalletButton,
  useCountdownTime,
  getTimePeriod,
} from 'components';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import { useGalaxyNft, useAuction } from 'state/galaxy/hooks';
import {
  fetchAuctionRecordListAsync,
  fetchGalaxyListAsync,
  fetchGetNftViewAsync,
} from 'state/galaxy/reducer';
import { getGalaxyIncoming } from 'state/galaxy/util';
import { useStore } from 'state';
import { getBalanceAmount, getFullDisplayBalance } from 'utils/formatBalance';
import { formatUTC } from 'utils/timeFormat';
import BigNumber from 'bignumber.js';
import { useToast } from 'contexts/ToastsContext';
import useParsedQueryString from 'hooks/useParsedQueryString';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'contexts/Localization';
import KingAvatar from '../components/KingAvatar';
import { LeftFlex, Line, PriceText, RightFlex } from './style';
import { GalaxyImage } from '../components/GalaxyImage';

dayjs.extend(utc);

const AuctionCard = styled(Card)`
  /* height: 375px; */
  height: auto;
  padding: 20px 55px;
`;

const Auction = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { toastSuccess, toastError } = useToast();
  const parseQs = useParsedQueryString();
  const galaxyId = Number(parseQs.i);
  useGalaxyNft(galaxyId);
  const { onAuction } = useAuction();

  const { galaxyNft, auctionRecordList } = useStore(p => p.galaxy);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    dispatch(fetchAuctionRecordListAsync(galaxyId));
  }, [galaxyId, dispatch]);

  // 冷却时间
  const cooldownTimestamp = new BigNumber(galaxyNft.lastTimestamp)
    .plus(new BigNumber(galaxyNft.miniBuyDuration))
    .toNumber();
  const diffSeconds = useCountdownTime(cooldownTimestamp, dayjs().unix());
  const timePeriod = useMemo(() => {
    return getTimePeriod(diffSeconds);
  }, [diffSeconds]);

  const lastPrice = useMemo(() => {
    const price = getFullDisplayBalance(
      new BigNumber(galaxyNft.lastPrice),
      18,
      6,
    );
    return Number(price) ? price : 0;
  }, [galaxyNft]);

  const currentPrice = useMemo(() => {
    const price = getFullDisplayBalance(
      new BigNumber(galaxyNft.currentPrice),
      18,
      6,
    );
    return Number(price) ? price : 0;
  }, [galaxyNft]);

  const ownerInfo = useMemo(() => {
    return auctionRecordList ? auctionRecordList[0] : {};
  }, [auctionRecordList]);

  const incomingPrice = useMemo(() => {
    const price = getGalaxyIncoming(galaxyNft.lastPrice);
    const balance = getFullDisplayBalance(price, 18, 6);
    return Number(balance) ? balance : 0;
  }, [galaxyNft]);

  // 竞拍
  const handleAuction = useCallback(async () => {
    try {
      setPending(true);
      await onAuction(galaxyId, galaxyNft.currentPrice);
      dispatch(fetchGalaxyListAsync());
      dispatch(fetchGetNftViewAsync(galaxyId));
      dispatch(fetchAuctionRecordListAsync(galaxyId));
      setTimeout(() => {
        dispatch(fetchAuctionRecordListAsync(galaxyId));
      }, 10000);
      toastSuccess(t('Auction succeeded'));
    } catch (error) {
      console.log(error);
      toastError(t('Auction failed'));
    } finally {
      setPending(false);
    }
  }, [galaxyId, galaxyNft, toastSuccess, toastError, onAuction, dispatch, t]);

  return (
    <Layout>
      <Flex padding='0 20px' mb='16px' justifyContent='space-between' flex={1}>
        <Box>
          <BackButton />
          <RefreshButton
            ml='33px'
            onRefresh={async () => {
              dispatch(fetchGetNftViewAsync(galaxyId));
              dispatch(fetchAuctionRecordListAsync(galaxyId));
            }}
          />
        </Box>
        <BgCard padding='40px 80px' variant='full'>
          <Flex flexDirection='column'>
            <Flex>
              <GalaxyImage width={351} height={351} ml='53px' mr='174px' />
              <Flex flexDirection='column'>
                <Text fontSize='28px'>{t('Current price')}</Text>
                <PriceText>{lastPrice ? `${lastPrice} BNB` : '---'}</PriceText>

                <Flex mt='20px' mb='10px' alignItems='center'>
                  <Text>{t('Current winner')}</Text>
                  {account?.toLowerCase() ===
                    ownerInfo?.newOwner?.toLowerCase() && (
                    <Text ml='55px' fontSize='22px' small>
                      {t('After others bid, you can get (≈ %value% BNB)', {
                        value: incomingPrice,
                      })}
                    </Text>
                  )}
                </Flex>
                {ownerInfo?.newOwner ? (
                  <Flex>
                    <KingAvatar url={ownerInfo?.avatar} />
                    <Flex
                      ml='40px'
                      flexDirection='column'
                      justifyContent='space-evenly'
                    >
                      <Text>{ownerInfo?.nickname}</Text>
                      <Text>{t('Get galaxy rewards (10000 STAR)')}</Text>
                    </Flex>
                  </Flex>
                ) : (
                  <PriceText>---</PriceText>
                )}
              </Flex>
            </Flex>
            <AuctionCard>
              <Flex>
                <LeftFlex>
                  <Flex justifyContent='space-between'>
                    <Text fontSize='22px'>{t('Bid price')}</Text>
                    <Text fontSize='22px'>{t('Calculation:')} 2.5*(1+30%)</Text>
                  </Flex>
                  <PriceText mt='10px'>
                    {currentPrice ? `${currentPrice} BNB` : '---'}
                  </PriceText>
                  {!account ? (
                    <ConnectWalletButton
                      scale='ld'
                      width='270px'
                      padding='0 10px'
                    />
                  ) : (
                    <Button
                      disabled={diffSeconds > 0 || pending}
                      width='270px'
                      mt='20px'
                      padding='0 10px'
                      onClick={handleAuction}
                    >
                      {diffSeconds > 0 ? (
                        `${t('Cooling')}:${timePeriod.minutes}${t('m')}${
                          timePeriod.seconds
                        }${t('s')}`
                      ) : pending ? (
                        <Dots>{t('Bid now')}</Dots>
                      ) : (
                        <Text fontSize='inherit'>{t('Bid now')}</Text>
                      )}
                    </Button>
                  )}

                  <Text mt='20px' small>
                    {t(
                      'After the auction is successful, you can receive the reward of the galaxy at 24:00 UTC every day, which will be sent by',
                    )}
                  </Text>
                  <Text small>
                    {t(
                      'If you are auctioned by other people in the middle, you can only receive the reward from the time when you have it to when you lose it.',
                    )}
                  </Text>
                </LeftFlex>
                <Line />
                <RightFlex>
                  {auctionRecordList?.length
                    ? auctionRecordList.map(item => (
                        <Text key={item.id} small>
                          {t(
                            'UTC %time% %name% won the system at %price% BNB auction',
                            {
                              time: formatUTC(item?.auctionAt, 'HH:mm'),
                              name: item?.nickname,
                              price: new BigNumber(item?.price).toFixed(6),
                            },
                          )}
                        </Text>
                      ))
                    : null}
                </RightFlex>
              </Flex>
            </AuctionCard>
          </Flex>
        </BgCard>
      </Flex>
    </Layout>
  );
};

export default Auction;
