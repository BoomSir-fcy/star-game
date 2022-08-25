import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useStore } from 'state';
import { Text, Flex, Box, GraphicsCard, Dots, BalanceText, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useDispatch } from 'react-redux';
import { Api } from 'apis';
import {
  InfoModuleBox,
  NormalMarkText,
  CloseImg,
  UserImg,
  BorderBox,
  ScrollBox,
  AuctionBtn,
  GetImg,
} from 'views/NewGalaxy/style';
import {
  fetchAuctionRecordListAsync,
  fetchGalaxyListAsync,
  fetchGetNftViewAsync,
  fetchOwnerInfoAsync,
} from 'state/galaxy/reducer';
import { EasyformatTime, formatUTC } from 'utils/timeFormat';
import { shortenAddress } from 'utils/contract';
import {
  splitThousandSeparator,
  getFullDisplayBalance,
} from 'utils/formatBalance';
import BigNumber from 'bignumber.js';
import { useAuction, useGalaxyNft } from 'state/galaxy/hooks';
import { SubString_1 } from 'utils/DecimalPlaces';
import { getGalaxyIncoming } from 'state/galaxy/util';
import dayjs from 'dayjs';
import { getTimePeriod, useCountdownTime } from 'components';
import { useToast } from 'contexts/ToastsContext';
import { fetchUserBalanceAsync } from 'state/userInfo/reducer';
import { useWeb3React } from '@web3-react/core';

const InfoModule: React.FC<{
  OpenInfo: boolean;
  setOpenInfo: (e) => void;
}> = ({ OpenInfo, setOpenInfo }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { onAuction } = useAuction();
  const { toastSuccess, toastError } = useToast();
  const { account } = useWeb3React();
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const { currentGalaxy, auctionRecordList, OwnerInfo, galaxyNftList } =
    useStore(p => p.galaxy);
  const galaxyNft = galaxyNftList[currentGalaxy?.id];
  // useGalaxyNft(currentGalaxy.id);

  const [claimMax, setClaimMax] = useState(0);
  const [pending, setPending] = useState(false);

  // 星系主获得数量
  const incomingPrice = useMemo(() => {
    const price = getGalaxyIncoming(galaxyNft?.lastPrice);
    const balance = getFullDisplayBalance(price, 18, 6);
    return Number(balance) ? balance : 0;
  }, [galaxyNft]);

  // 竞拍价格
  const currentPrice = useMemo(() => {
    const price = getFullDisplayBalance(
      new BigNumber(galaxyNft?.currentPrice),
      18,
      6,
    );
    return Number(price) ? price : 0;
  }, [galaxyNft]);

  // 分配奖池金额
  const prizPpool = useMemo(() => {
    const num = new BigNumber(currentPrice).minus(incomingPrice).toString();
    return num;
  }, [incomingPrice, currentPrice]);

  // 领取倒计时
  // const endTimestamp = dayjs().utc(true).endOf('day').unix();
  // const startTimestamp = dayjs().utc(true).unix();
  // const diffSeconds = useCountdownTime(0, 0, endTimestamp - startTimestamp);

  // const { hour, minute, second } = useMemo(() => {
  //   const { hours, minutes, seconds } = getTimePeriod(diffSeconds);
  //   return {
  //     hour: hours,
  //     minute: minutes,
  //     second: seconds,
  //   };
  // }, [diffSeconds]);

  // 竞拍冷却时间
  const cooldownTimestamp = new BigNumber(galaxyNft?.lastTimestamp)
    .plus(new BigNumber(galaxyNft?.miniBuyDuration))
    .toNumber();
  const BiddingdiffSeconds = useCountdownTime(
    cooldownTimestamp,
    dayjs().unix(),
  );
  const timePeriod = useMemo(() => {
    return getTimePeriod(BiddingdiffSeconds);
  }, [BiddingdiffSeconds]);

  // 获取领取Box数量
  const getClaimMax = useCallback(async (id: number) => {
    try {
      const res = await Api.GalaxyApi.getClaimMax(id);
      if (Api.isSuccess(res)) {
        setClaimMax(res.data?.amount);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const HoldTime = useCallback((hold_time: number) => {
    const time = Math.floor((new Date().getTime() - hold_time) / 1000);
    return time;
  }, []);

  // 竞拍
  const handleAuction = useCallback(async () => {
    try {
      setPending(true);
      await onAuction(currentGalaxy.id, galaxyNft?.currentPrice);
      dispatch(fetchGalaxyListAsync());
      dispatch(fetchGetNftViewAsync(currentGalaxy.id));
      dispatch(fetchAuctionRecordListAsync(currentGalaxy.id));
      dispatch(fetchOwnerInfoAsync(currentGalaxy.id));
      setTimeout(() => {
        dispatch(fetchOwnerInfoAsync(currentGalaxy.id));
        dispatch(fetchAuctionRecordListAsync(currentGalaxy.id));
      }, 10000);
      toastSuccess(t('Bidding Succeeded'));
    } catch (error) {
      console.error(error);
      toastError(t('Bidding Failed'));
    } finally {
      setPending(false);
    }
  }, [
    currentGalaxy.id,
    galaxyNft,
    toastSuccess,
    toastError,
    onAuction,
    dispatch,
    t,
  ]);

  const handleClaim = useCallback(async () => {
    const galaxy_id = currentGalaxy.id;
    try {
      const res = await Api.GalaxyApi.ClaimRewards(galaxy_id);
      if (Api.isSuccess(res)) {
        toastSuccess(t('Claim Succeeded'));
        getClaimMax(galaxy_id);
        dispatch(fetchUserBalanceAsync());
      }
    } catch (error) {
      console.error(error);
      toastError(t('Claim Failed'));
    }
  }, [currentGalaxy.id, toastSuccess, toastError, t, getClaimMax, dispatch]);

  useEffect(() => {
    dispatch(fetchAuctionRecordListAsync(currentGalaxy.id));
    dispatch(fetchOwnerInfoAsync(currentGalaxy.id));
    // getClaimMax(currentGalaxy.id);
  }, [dispatch, currentGalaxy]);

  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    timer.current = setInterval(() => {
      getClaimMax(currentGalaxy.id);
    }, 3000);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [getClaimMax, currentGalaxy.id, timer]);

  return (
    <InfoModuleBox className={OpenInfo ? 'Show' : 'close'}>
      <Flex mb='16px' justifyContent='space-between'>
        <Flex alignItems='flex-end'>
          <Text gold bold fontSize='20px'>
            {t('Auction')}&nbsp;{currentGalaxy.name}
          </Text>
          {/* <Flex ml='30px' alignItems='flex-end'>
            <Text fontSize='14px' mr='15px'>
              {t('Total Galaxy CE')}
            </Text>
            <NormalMarkText bold fontSize='18px'>
              {splitThousandSeparator(OwnerInfo.power)}
            </NormalMarkText>
          </Flex> */}
        </Flex>
        <CloseImg
          onClick={() => setOpenInfo(false)}
          src='/images/commons/introjs-close.png'
          alt=''
        />
      </Flex>
      <BorderBox mb={20}>
        <Flex alignItems='center' justifyContent='space-between'>
          <Flex alignItems='center'>
            <UserImg
              src={
                OwnerInfo.avatar ? OwnerInfo.avatar : '/images/login/a-man.png'
              }
              alt=''
            />
            <Box ml='18px'>
              <Flex mb='10px' alignItems='flex-end'>
                <Text fontSize='14px' mr='15px'>
                  {t('Galaxy Lord')}
                </Text>
                <NormalMarkText bold fontSize='16px'>
                  {OwnerInfo.nickname}
                </NormalMarkText>
              </Flex>
              {OwnerInfo.nickname && (
                <Text fontSize='14px'>
                  {t('Claimed')}
                  &nbsp; &nbsp;
                  {EasyformatTime(HoldTime(OwnerInfo.hold_time))}
                </Text>
              )}
            </Box>
          </Flex>
          <Box
            style={{ padding: '8px 16px' }}
            width='max-content'
            height='max-content'
          >
            <Text fontSize='14px'>{t('Accumulated')} BOX</Text>
            <Text gold bold fontSize='18px'>
              {SubString_1(OwnerInfo.owner_get_box, 5)}
            </Text>
          </Box>
        </Flex>
      </BorderBox>
      <Box mb={30}>
        <Text mb='18px'>{t('GalaxyDesc1')}</Text>
        <Flex mb='12px'>
          <GetImg src='/images/commons/icon/icon-finish.png' />
          <Text ml='10px' fontSize='14px'>
            {t('GalaxyDesc1-1')}
          </Text>
        </Flex>
        <Flex mb='12px'>
          <GetImg src='/images/commons/icon/icon-finish.png' />
          <Text ml='10px' fontSize='14px'>
            {t('GalaxyDesc1-2')}
          </Text>
        </Flex>
        <Flex mb='12px'>
          <GetImg src='/images/commons/icon/icon-finish.png' />
          <Text ml='10px' fontSize='14px'>
            {t('GalaxyDesc1-3')}
          </Text>
        </Flex>
      </Box>

      {/* <Flex mb='8px' justifyContent='space-between'>
        <GraphicsCard
          stripe
          style={{ padding: '8px 16px' }}
          width='48%'
          height='max-content'
        >
          <Text fontSize='14px'>{t('Accumulated')} BOX</Text>
          <NormalMarkText bold fontSize='18px'>
            {SubString_1(OwnerInfo.owner_get_box, 5)}
          </NormalMarkText>
        </GraphicsCard>
        <GraphicsCard
          stripe
          style={{ padding: '8px 16px' }}
          width='48%'
          height='max-content'
        >
          <Text fontSize='14px'>{t('Accumulated in history')} BOX</Text>
          <NormalMarkText bold fontSize='18px'>
            {SubString_1(OwnerInfo.all_get_box, 5)}
          </NormalMarkText>
        </GraphicsCard>
      </Flex> */}
      {/* <BorderBox mb='8px'>
        <Text fontSize='14px'>
          {t('Accumulated by all Lords of this galaxy in history')}
          &nbsp;
          {OwnerInfo.all_auction_num} BNB
        </Text>
      </BorderBox>
      <Text fontSize='14px'>{t('History Record')}</Text>
      <ScrollBox mb='10px'>
        {(auctionRecordList ?? []).map(item => (
          <Text key={item.id} fontSize='14px' mb='4px'>
            UTC {formatUTC(item.auctionAt, 'HH:mm:ss')}&nbsp;&nbsp;
            {shortenAddress(item.newOwner, 2)}&nbsp;&nbsp;
            {t('won the auction with %num%BNB and became the Galaxy Lord', {
              num: item.price,
            })}
          </Text>
        ))}
      </ScrollBox> */}
      <Flex mb='16px' alignItems='center' justifyContent='center'>
        {OwnerInfo?.address?.toLocaleLowerCase() ===
        account?.toLocaleLowerCase() ? (
          <>
            <AuctionBtn
              variant='purpleShow'
              height='100%'
              minWidth='50%'
              width='max-content'
              padding='4px 10px'
              disabled
            >
              <Text width='max-content' color='textPrimary' bold>
                <Box>{t('Congratulations')}</Box>
                {t('Become the Lord of %name% galaxy', {
                  name: currentGalaxy.name,
                })}
              </Text>
            </AuctionBtn>
          </>
        ) : (
          <AuctionBtn
            variant='purpleShow'
            width='50%'
            height='max-content'
            padding='0 10px'
            disabled={BiddingdiffSeconds > 0 || pending}
            onClick={handleAuction}
          >
            <Flex alignItems='center' width='100%' justifyContent='center'>
              <Image
                width={40}
                height={40}
                src='/images/tokens/BNB.svg'
                alt=''
              />
              <Flex ml='14px' flex={1} flexDirection='column'>
                {BiddingdiffSeconds > 0 ? (
                  `${t('Cooling')}:${timePeriod.minutes}${t('m')}${
                    timePeriod.seconds
                  }${t('s')}`
                ) : pending ? (
                  <Dots>{t('Bidding')}</Dots>
                ) : (
                  <>
                    <Text>{`${t('Auction')} ${currentGalaxy.name}`}</Text>
                    <Text gold bold fontSize='18px'>
                      {`( ${currentPrice ? `${currentPrice}` : '---'} BNB )`}
                    </Text>
                  </>
                )}
              </Flex>
            </Flex>
          </AuctionBtn>
        )}
        {/* <Text color='#A9CCCB' fontSize='14px' ml='20px' mr='20px'>
          {t(
            'Of Which, %num1% BNB will be given to the previous galaxy lord, and %num2% BNB will go to the Rewards Pool',
            {
              num1: incomingPrice ? `${incomingPrice}` : '---',
              num2: prizPpool ? `${prizPpool}` : '---',
            },
          )}
        </Text> */}
      </Flex>
      <Flex alignItems='center' justifyContent='center'>
        <AuctionBtn
          variant='gold'
          width='50%'
          // disabled={!claimMax || diffSeconds <= 0}
          disabled={!claimMax}
          onClick={handleClaim}
        >
          <Text color='#FBC249' bold>
            <Flex alignItems='center'>
              {t('Claim')}(
              {claimMax ? (
                <BalanceText
                  fontSize='16px'
                  color='#FBC249'
                  value={Number(SubString_1(claimMax, 6))}
                />
              ) : (
                SubString_1(claimMax, 6)
              )}
              BOX)
            </Flex>
          </Text>
        </AuctionBtn>
        {/* <Box ml='20px'>
          <Text color='textTips' small>
            {t('Remaining time for claiming (24:00 UTC)')}
          </Text>
          <Text fontSize='18px'>
            {`${hour}${t('h')}:${minute}${t('m')}:${second}${t('s')}`}
          </Text>
        </Box> */}
      </Flex>
    </InfoModuleBox>
  );
};

export default InfoModule;
