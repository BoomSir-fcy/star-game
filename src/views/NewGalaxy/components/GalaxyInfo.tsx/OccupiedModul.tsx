import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button, Flex, Box, Spinner, MarkText, Text, Image, Dots } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';
import { useStore } from 'state';
import { useToast } from 'contexts/ToastsContext';
import { useDispatch } from 'react-redux';
import { EasyformatTime } from 'utils/timeFormat';
import BigNumber from 'bignumber.js';
import { SubString_1 } from 'utils/DecimalPlaces';
import { splitThousandSeparator } from 'utils/formatBalance';
import Modal from 'components/Modal';
import { useWeb3React } from '@web3-react/core';
import { Api } from 'apis';
import usePlunder from 'views/NewGalaxy/hook';
import { fetchGalaxyStarListAsync } from 'state/galaxy/reducer';
import TipsOccupiedModul from './TipsOccupiedModul';

const OutModule = styled(Box)<{ ShowListModule: boolean }>`
  display: ${({ ShowListModule }) => (ShowListModule ? 'block' : 'none')};
  position: absolute;
  width: 548px;
  height: 718px;
  z-index: 2;
  right: 0;
  top: -60px;
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
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid ${({ theme }) => theme.colors.borderPrimary};
  padding: 16px;
  position: relative;
`;

const ScrollBox = styled(Box)`
  min-height: calc(100% - 60px);
  max-height: calc(100% - 60px);
  overflow-y: auto;
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

  const { galaxyStarList } = useStore(p => p.galaxy);
  const [pending, setPending] = useState(false);
  const [TotalReward, setTotalReward] = useState(0);
  const [visible, setVisible] = useState(false);
  const [ActiveInfo, setActiveInfo] = useState<Api.Galaxy.StarInfo>();

  const GetRewardFactor = useCallback(
    (disapth_box: number) => {
      if (!disapth_box || !TotalReward) return '';
      const Factor = new BigNumber(disapth_box).div(TotalReward).toString();
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
      return hasOwner?.toLowerCase() === account?.toLowerCase();
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

  useEffect(() => {
    let num = 0;
    for (let i = 0; i < galaxyStarList.length; i++) {
      num += galaxyStarList[i].disapth_box;
    }
    setTotalReward(num);
    const ScrollDom = document.getElementById('ScrollDom');
    ScrollDom.scrollTop = 0;
  }, [galaxyStarList]);

  return (
    <OutModule ShowListModule={ShowListModule}>
      <ListBox>
        <CloseBox onClick={() => setShowListModule(false)}>
          <CloseImg src='/images/commons/icon/back.png' alt='' />
        </CloseBox>
        <Flex mb='20px' justifyContent='space-between' alignItems='flex-end'>
          <MarkText fontSize='20px' bold fontStyle='normal'>
            {t('占领恒星')}
          </MarkText>
        </Flex>
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
                    <MarkText fontStyle='normal' fontSize='14px' bold>
                      # {item.number} 恒星
                    </MarkText>
                  </LeveFlex>
                  <ImgBox>
                    <img
                      src={
                        item.ownerAvatar
                          ? item.ownerAvatar
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
                      {t('恒星主')}:
                    </SmText>
                    <SmText ellipsis>{item?.nick_name || t('暂无')}</SmText>
                  </Flex>
                  <Flex alignItems='center'>
                    <SmText mr='10px' color='textSubtle'>
                      {t('奖励系数')}
                    </SmText>
                    <SmText>
                      {SubString_1(GetRewardFactor(item?.disapth_box), 3)}%
                    </SmText>
                  </Flex>
                  <Flex alignItems='center'>
                    <SmText mr='10px' color='textSubtle'>
                      {t('24小时预计获得BOX')}:
                    </SmText>
                    <SmText>{SubString_1(item.pre_box, 3)}</SmText>
                  </Flex>
                  <Flex alignItems='center'>
                    <SmText mr='10px' color='textSubtle'>
                      {t('TA的占领时间')}:
                    </SmText>
                    <SmText>
                      {item?.nick_name
                        ? EasyformatTime(HoldTime(item.hold_time), true)
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
                  <Flex alignItems='baseline'>
                    <SmText mr='10px'>{t('Power')}</SmText>
                    <MarkText fontStyle='normal' fontSize='20px' bold>
                      {splitThousandSeparator(item.power)}
                    </MarkText>
                  </Flex>
                  {!IsOwner(item.owner) && (
                    <>
                      {item.owner ? (
                        <Button
                          variant='purple'
                          height='45px'
                          onClick={() => {
                            setActiveInfo(item);
                            setVisible(true);
                          }}
                        >
                          <Text color='textPrimary' fontSize='16px' bold>
                            {t('Seize Star')}
                          </Text>
                        </Button>
                      ) : (
                        <Button
                          disabled={pending}
                          variant='purple'
                          height='45px'
                          onClick={() => handleHold(item)}
                        >
                          <Text color='textPrimary' fontSize='16px' bold>
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
                      variant='purple'
                      height='45px'
                      onClick={() => handleGiveupStar(item)}
                    >
                      <Text color='textPrimary' fontSize='16px' bold>
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
      </ListBox>
      {/* {pending && (
        <LoadingBox>
          <Spinner size={200} />
        </LoadingBox>
      )} */}
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
