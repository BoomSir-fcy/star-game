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
import KingAvatar from '../components/KingAvatar';
import { LeftFlex, Line, PriceText, RightFlex } from './style';
import { GalaxyImage } from '../components/GalaxyImage';

dayjs.extend(utc);

const AuctionCard = styled(Card)`
  height: 375px;
  padding: 30px 55px;
`;

const Auction = () => {
  const dispatch = useDispatch();
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
  console.log(diffSeconds, 'diffSeconds');
  const timePeriod = useMemo(() => {
    return getTimePeriod(diffSeconds);
  }, [diffSeconds]);

  const lastPrice = useMemo(() => {
    return getFullDisplayBalance(new BigNumber(galaxyNft.lastPrice), 18, 6);
  }, [galaxyNft]);

  const currentPrice = useMemo(() => {
    return getFullDisplayBalance(new BigNumber(galaxyNft.currentPrice), 18, 6);
  }, [galaxyNft]);

  const ownerInfo = useMemo(() => {
    return auctionRecordList ? auctionRecordList[0] : {};
  }, [auctionRecordList]);

  const incomingPrice = useMemo(() => {
    const price = getGalaxyIncoming(galaxyNft.lastPrice);
    return getFullDisplayBalance(price, 18, 6);
  }, [galaxyNft]);

  // 竞拍
  const handleAuction = useCallback(async () => {
    try {
      setPending(true);
      await onAuction(galaxyId, galaxyNft.currentPrice);
      dispatch(fetchGetNftViewAsync(galaxyId));
      dispatch(fetchAuctionRecordListAsync(galaxyId));
      setTimeout(() => {
        dispatch(fetchAuctionRecordListAsync(galaxyId));
      }, 10000);
      toastSuccess('竞拍成功');
    } catch (error) {
      console.log(error);
      toastSuccess('竞拍失败');
    } finally {
      setPending(false);
    }
  }, [galaxyId, galaxyNft, toastSuccess, onAuction, dispatch]);

  return (
    <Layout>
      <Flex padding='0 20px' mb='16px' justifyContent='space-between' flex={1}>
        <Box>
          <BackButton />
          <RefreshButton ml='33px' />
        </Box>
        <BgCard padding='40px 80px' variant='full'>
          <Flex flexDirection='column'>
            <Flex>
              <GalaxyImage width={351} height={351} ml='53px' mr='174px' />
              <Flex flexDirection='column'>
                <Text fontSize='28px'>当前价格</Text>
                <PriceText>{lastPrice ? `${lastPrice} BNB` : '---'}</PriceText>

                <Flex mt='20px' mb='10px' alignItems='center'>
                  <Text>当前得主</Text>
                  {account?.toLowerCase() ===
                    ownerInfo?.newOwner?.toLowerCase() && (
                    <Text ml='55px' fontSize='22px' small>
                      别人竞拍后，你可以获得（≈ {incomingPrice} BNB）
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
                      <Text>可获得星系奖励(10000 STAR)</Text>
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
                    <Text fontSize='22px'>竞标价格</Text>
                    <Text fontSize='22px'>计算方式: 2.5*(1+30%)</Text>
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
                        `冷却:${timePeriod.minutes}m${timePeriod.seconds}s`
                      ) : pending ? (
                        <Dots>立即竞拍</Dots>
                      ) : (
                        '立即竞拍'
                      )}
                    </Button>
                  )}

                  <Text mt='20px' small>
                    竞拍成功后，可在每日UTC24点领取该星系的奖励，此奖励由送出
                  </Text>
                  <Text small>
                    如果中途被其他人竞拍获得，则只能领取从拥有开始到失去拥有的时间段的奖励
                  </Text>
                </LeftFlex>
                <Line />
                <RightFlex>
                  {auctionRecordList?.length
                    ? auctionRecordList.map(item => (
                        <Text key={item.id} small>
                          UTC {formatUTC(item?.auctionAt, 'HH:mm')}{' '}
                          {item?.nickname} 以{' '}
                          {new BigNumber(item?.price).toFixed(6)} BNB
                          竞拍成功获得该星系
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
