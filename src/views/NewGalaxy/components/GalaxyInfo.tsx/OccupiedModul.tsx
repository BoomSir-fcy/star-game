import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import {
  Button,
  Flex,
  Box,
  Spinner,
  MarkText,
  Text,
  Image,
  Dots,
  BalanceText,
} from 'uikit';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';
import { storeAction, useStore } from 'state';
import { useToast } from 'contexts/ToastsContext';
import { useDispatch } from 'react-redux';
import { EasyformatTime } from 'utils/timeFormat';
import BigNumber from 'bignumber.js';
import { SubString_1 } from 'utils/DecimalPlaces';
import {
  formatLocalisedCompactBalance,
  splitThousandSeparator,
} from 'utils/formatBalance';
import Modal from 'components/Modal';
import { useWeb3React } from '@web3-react/core';
import { Api } from 'apis';
import usePlunder from 'views/NewGalaxy/hook';
import { fetchGalaxyStarListAsync } from 'state/galaxy/reducer';
import { fetchUserBalanceAsync } from 'state/userInfo/reducer';
import { TooltipTrigger } from 'components';
import TipsOccupiedModul from './TipsOccupiedModul';

const OutModule = styled(Box)`
  position: fixed;
  width: 548px;
  height: 718px;
  z-index: 2;
  top: 110px;
  right: -548px;
  opacity: 0;
  transition: all 0.5s ease;
  &.active {
    opacity: 1;
    right: 0;
    animation: activeDom 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1 alternate
      forwards;
  }
  &.removeActive {
    animation: removeDom 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1 alternate
      forwards;
  }
  @keyframes activeDom {
    0% {
      right: -548px;
    }
    100% {
      right: 0;
    }
  }
  @keyframes removeDom {
    0% {
      right: 0;
    }
    100% {
      right: -548px;
    }
  }
`;

const CloseBox = styled(Flex)`
  width: 43px;
  height: 173px;
  background: url('/images/commons/sideCloseButton.png');
  background-size: 100% 100%;
  cursor: pointer;
  position: absolute;
  left: -43px;
  top: 40%;
  align-items: center;
  justify-content: flex-end;
`;

const CloseImg = styled.img`
  width: 80%;
  height: 50px;
`;

const ListBox = styled(Box)`
  width: 100%;
  height: 100%;
  background: linear-gradient(270deg, #520d4e, #123d45);
  border: 2px solid;
  border-image: linear-gradient(90deg, #c83cc0, #2faced) 2 2;
  padding: 16px;
  position: relative;
`;

const ScrollBox = styled(Box)`
  min-height: calc(100% - 150px - 50px);
  max-height: calc(100% - 150px - 50px);
  overflow-y: auto;
  margin-bottom: 16px;
`;

const LeveFlex = styled(Flex)`
  position: absolute;
  top: -10px;
  width: 100%;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const SmText = styled(Text)`
  font-size: 14px;
`;
const LoadingBox = styled(Box)`
  position: fixed;
  left: 56%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 100%;
  z-index: 99;
`;

const ImgBox = styled(Box)`
  width: 80px;
  height: 74px;
  .img {
    width: 100%;
  }
`;

const OccupiedModul: React.FC<{
  ShowListModule: boolean;
  setShowListModule: (e) => void;
}> = ({ ShowListModule, setShowListModule }) => {
  const { t } = useTranslation();
  const { toastError, toastSuccess, toastWarning } = useToast();
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { handleGiveup } = usePlunder();
  const { galaxyStarList, currentGalaxy } = useStore(p => p.galaxy);
  const { scale, TooltipTriggerZIndex } = useStore(p => p.user);

  const [pending, setPending] = useState(false);
  const [TotalReward, setTotalReward] = useState(0);
  const [visible, setVisible] = useState(false);
  const [ActiveInfo, setActiveInfo] = useState<Api.Galaxy.StarInfo>();
  const [claimMax, setClaimMax] = useState(0);

  const timer = useRef<ReturnType<typeof setTimeout>>();

  const GetRewardFactor = useCallback(
    (disapth_box: number) => {
      if (!disapth_box || !TotalReward) return '';
      const Factor = new BigNumber(disapth_box)
        .div(TotalReward)
        .times(100)
        .toString();
      return Factor;
    },
    [TotalReward],
  );

  // const GetBoxFor24 = useCallback((Factor: string) => {
  //   // 50000000000 / 365 / 10 * 0.8 * Factor
  //   const Num = new BigNumber(50000000000)
  //     .div(365)
  //     .div(10)
  //     .times(0.8)
  //     .times(Factor)
  //     .toString();
  //   return Num;
  // }, []);

  const HoldTime = useCallback((hold_time: number) => {
    const time = Math.floor(new Date().getTime() / 1000) - hold_time;
    return time;
  }, []);

  const IsOwner = useCallback(
    (hasOwner: string) => {
      return hasOwner?.toLocaleLowerCase() === account?.toLocaleLowerCase();
    },
    [account],
  );

  // 占领
  const handleHold = useCallback(
    async (info: Api.Galaxy.StarInfo) => {
      try {
        setPending(true);
        const res = await Api.GalaxyApi.holdStar(info.token_id, info.number);
        if (Api.isSuccess(res)) {
          toastSuccess(t('Occupy Succeeded'));
          setVisible(false);
        }
      } catch (error) {
        toastError(t('Occupy Failed'));
      }
      setPending(false);
      dispatch(fetchGalaxyStarListAsync(info.token_id as number));
    },
    [setVisible, dispatch, toastSuccess, toastError, t],
  );

  // 放弃占领
  const handleGiveupStar = useCallback(
    async (info: Api.Galaxy.StarInfo) => {
      if (info?.owner) {
        setPending(true);
        const res = await handleGiveup({
          nft_id: info.token_id,
          number: info.number,
        });
        if (res) {
          toastSuccess(t('Give up Occupy Succeeded'));
          setVisible(false);
        } else {
          toastError(t('Give up Occupy Failed'));
        }
      }
      dispatch(fetchGalaxyStarListAsync(info.token_id as number));
      setPending(false);
    },
    [handleGiveup, dispatch, setVisible, t, toastError, toastSuccess],
  );

  // 获取领取Box数量
  const getClaimMax = useCallback(async (id: number) => {
    try {
      const res = await Api.GalaxyApi.getPlanetClaimMax(id);
      if (Api.isSuccess(res)) {
        setClaimMax(res.data?.amount);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleClaim = useCallback(async () => {
    const galaxy_id = currentGalaxy.id;
    try {
      const res = await Api.GalaxyApi.ClaimPlanetRewards(galaxy_id);
      if (Api.isSuccess(res)) {
        dispatch(
          storeAction.setTokenToFrom({
            fromTop: 840,
            fromLeft: 1500,
            toTop: 70,
            toLeft: 220,
            token: ['BOX'],
          }),
        );
        setTimeout(() => {
          dispatch(
            storeAction.setTokenToFrom({
              fromTop: 0,
              fromLeft: 0,
              toTop: 0,
              toLeft: 0,
              token: [],
            }),
          );
        }, 2000);
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
    let num = 0;
    for (let i = 0; i < galaxyStarList.length; i++) {
      num += galaxyStarList[i].disapth_box;
    }
    setTotalReward(num);
    const ScrollDom = document.getElementById('ScrollDom');
    ScrollDom.scrollTop = 0;
  }, [galaxyStarList]);

  // useEffect(() => {
  //   getClaimMax(currentGalaxy.id);
  // }, [currentGalaxy.id, getClaimMax]);

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
  }, [timer, currentGalaxy, getClaimMax]);

  return (
    <OutModule className={ShowListModule ? 'active' : 'removeActive'}>
      <ListBox>
        <CloseBox onClick={() => setShowListModule(false)}>
          <CloseImg src='/images/commons/icon/back.png' alt='' />
        </CloseBox>
        <Flex alignItems='flex-end'>
          <Text gold fontSize='20px' bold fontStyle='normal'>
            {t('Occupy')}
          </Text>
          {/* <TooltipTrigger
            overlay={
              
            }
            placement='leftBottom'
          >
            <Image
              ml='10px'
              width={25}
              height={25}
              src='/images/commons/icon/help-new.png'
            />
          </TooltipTrigger> */}
        </Flex>
        <Text mb='10px' color='textTips' small>
          {t('occupationRules')}
        </Text>
        <ScrollBox id='ScrollDom'>
          {(galaxyStarList ?? []).map((item, index) => (
            <Box mb='30px' key={`${item.number}`}>
              <Flex
                justifyContent='space-between'
                alignItems='center'
                height='100px'
              >
                <Box position='relative'>
                  <LeveFlex>
                    <Text Purple fontStyle='normal' fontSize='14px' bold>
                      # {item.number} {t('Star')}
                    </Text>
                  </LeveFlex>
                  <ImgBox>
                    <img
                      src={
                        item.ownerAvatar
                          ? item.ownerAvatar
                          : item?.nick_name
                          ? '/images/login/a-man.png'
                          : '/images/commons/36.png'
                      }
                      alt=''
                    />
                  </ImgBox>
                </Box>
                <Flex
                  flexDirection='column'
                  justifyContent='space-between'
                  height='100%'
                  width='50%'
                >
                  <Flex alignItems='baseline'>
                    <SmText mr='10px' color='textSubtle'>
                      {t('Star Lord')}:
                    </SmText>
                    <SmText ellipsis>{item?.nick_name || ''}</SmText>
                  </Flex>
                  <Flex alignItems='center'>
                    <SmText mr='10px' color='textSubtle'>
                      {t('Reward Coefficient')}
                    </SmText>
                    <SmText>
                      {SubString_1(GetRewardFactor(item?.disapth_box), 3)}%
                    </SmText>
                  </Flex>
                  <Flex alignItems='center'>
                    <SmText mr='10px' color='textSubtle'>
                      {t('Estimated amount of BOX received in 24 hours')}:&nbsp;
                      <span style={{ color: '#fff' }}>
                        {formatLocalisedCompactBalance(item.pre_box)}
                      </span>
                    </SmText>
                    {/* <SmText>
                      
                    </SmText> */}
                  </Flex>
                  <Flex alignItems='center'>
                    <SmText mr='10px' color='textSubtle'>
                      {t('Time of occupation')}:
                    </SmText>
                    <SmText>
                      {item?.nick_name
                        ? EasyformatTime(HoldTime(item.hold_time))
                        : ''}
                    </SmText>
                  </Flex>
                </Flex>
                <Flex
                  flexDirection='column'
                  justifyContent='space-between'
                  height='100%'
                  width='30%'
                >
                  <Flex alignItems='baseline' flexWrap='wrap'>
                    <SmText mr='10px'>{t('Power')}</SmText>
                    <Text gold ellipsis fontStyle='normal' fontSize='20px' bold>
                      {splitThousandSeparator(item.power)}
                    </Text>
                  </Flex>
                  {!IsOwner(item.owner) && (
                    <>
                      {item.owner ? (
                        <Button
                          variant='gold'
                          height='45px'
                          onClick={() => {
                            setActiveInfo(item);
                            setVisible(true);
                          }}
                        >
                          <Text color='#FBC249' fontSize='16px' bold>
                            {t('Seize Star')}
                          </Text>
                        </Button>
                      ) : (
                        <Button
                          disabled={pending}
                          variant='gold'
                          height='45px'
                          onClick={() => handleHold(item)}
                        >
                          <Text color='#FBC249' fontSize='16px' bold>
                            {/* {pending ? (
                              <Dots>{t('Occupy Star')}</Dots>
                            ) : (
                              t('Occupy Star')
                            )} */}
                            {t('Occupy Star')}
                          </Text>
                        </Button>
                      )}
                    </>
                  )}

                  {IsOwner(item.owner) && (
                    <Button
                      disabled={pending}
                      variant='gold'
                      height='45px'
                      onClick={() => handleGiveupStar(item)}
                    >
                      <Text color='#FBC249' fontSize='16px' bold>
                        {/* {pending ? (
                          <Dots>{t('Give up Occupy')}</Dots>
                        ) : (
                          t('Give up Occupy')
                        )} */}
                        {t('Give up Occupy')}
                      </Text>
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Box>
          ))}
        </ScrollBox>
        <Flex justifyContent='center'>
          <Button
            variant='gold'
            height='45px'
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
          </Button>
        </Flex>
      </ListBox>
      {visible && (
        <Modal title='TIPS' visible={visible} setVisible={setVisible}>
          <TipsOccupiedModul
            info={ActiveInfo}
            setVisible={e => setVisible(e)}
          />
        </Modal>
      )}
    </OutModule>
  );
};

export default OccupiedModul;
