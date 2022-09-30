import React, { useEffect, useRef, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Spinner, Text, MarkText, Button, Dots } from 'uikit';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'contexts/Localization';
import { useStore } from 'state';
import { PlanetBall } from 'components';
import { QualityColor, RaceTypeColor } from 'uikit/theme/colors';
import { useToast } from 'contexts/ToastsContext';
import { useJoinAlliance } from 'views/Star/hook';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import { useFetchAllianceView } from 'state/alliance/hooks';
import { setActivePlanet } from 'state/planet/actions';
import ModalWrapper from 'components/Modal';
import { Api } from 'apis';

const DeleteBtnImg = styled.img`
  width: 38px;
  height: 38px;
  cursor: pointer;
`;

const LoadingBox = styled(Box)`
  position: absolute;
  left: 56%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const StyledStar = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  background: url('/images/commons/star/add.png') no-repeat;
  background-size: 100%;
  border: 0;
  box-shadow: none;
  /* cursor: pointer; */
  transition: 0.3s;
  z-index: 2;
  margin-left: -10px;
  /* &:hover,
  &:active,
  &.star-active {
    background: url('/images/commons/star/add-active.png') no-repeat;
    background-size: 100%;
    width: 100px;
    height: 100px;
    transform: scale(1.1);
  } */
`;

const Alliance: React.FC<{
  setNowAllianceListId: (item: any) => void;
}> = ({ setNowAllianceListId }) => {
  useFetchAllianceView();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { toastError, toastSuccess, toastWarning } = useToast();

  const { SetWorking } = useJoinAlliance();
  const { order, alliance } = useStore(p => p.alliance.allianceView);
  const workingList = useStore(p => p.alliance.workingPlanet);
  const activePlanet = useStore(p => p.planet.activePlanet);
  const [ChooseList, setChooseList] = useState<number[]>([]);
  const [StarList, setStarList] = useState<Api.Planet.PlanetInfo[]>([]);
  const [AddBtnList, setAddBtnList] = useState([]);
  const [pending, setpending] = useState(false);
  const [visible, setVisible] = useState(false);
  const [StopWorkVisible, setStopWorkVisible] = useState(false);

  // 添加、替换、删除
  const addPlanetToList = useCallback(
    (id: number, index: number, type: number) => {
      const list = ChooseList.concat([]);
      const arr = StarList.concat();
      let newList = [];
      const InIt = list.indexOf(id);
      if (type === 1) {
        // 替换、添加
        if (InIt !== -1) {
          toastError(t('This planet is already in the alliance'));
          return;
        }
        arr[index] = activePlanet;
        list[index] = id;
        setStarList(arr);
      } else {
        // 删除
        newList = StarList.filter(item => {
          return item.id !== id;
        });
        list.splice(index, 1);
        setStarList(newList);
      }
      setChooseList(list);
    },
    [activePlanet, StarList, ChooseList, t, toastError],
  );

  // 保存联盟设置
  const ToSetWorking = useCallback(async () => {
    if (pending) {
      return;
    }

    setpending(true);
    try {
      const ChooseListStr = ChooseList.join();
      const workingListStr = workingList.join();
      if (ChooseListStr === workingListStr) {
        toastError(t('The alliance has not changed'));
        return;
      }
      await SetWorking(ChooseList);
      toastSuccess(t('planetTipsSaveSuccess'));
      dispatch(fetchAllianceViewAsync());
    } catch (e: any) {
      console.error(e);
      if (e?.data?.message === 'execution reverted: not owner') {
        toastError(t('Not Owner'));
        return;
      }
      toastError(t('Save Failed'));
    } finally {
      setpending(false);
    }
  }, [
    pending,
    ChooseList,
    workingList,
    SetWorking,
    toastSuccess,
    t,
    toastError,
    dispatch,
  ]);

  const getWork = useCallback(async () => {
    setpending(true);
    await Api.AllianceApi.getMyPlanetAlliance()
      .then(res => {
        setpending(false);

        if (Api.isSuccess(res)) {
          const working = res.data.alliance.working;
          if (working === 1) {
            setStopWorkVisible(true);
            return;
          }
          if (ChooseList.length < 5) {
            setVisible(true);
            return;
          }

          ToSetWorking();
        }
      })
      .catch(err => {
        setpending(false);

        console.error(err);
      });
  }, [ChooseList, ToSetWorking]);

  useEffect(() => {
    if (order?.length) {
      const arr = order.map(item => {
        return item.planet;
      });
      setStarList(arr);
    }
  }, [order]);

  useEffect(() => {
    const BtnLength = 5 - StarList.length;
    if (BtnLength > 0) {
      const list = [];
      for (let i = 0; i < BtnLength; i++) {
        list.push(i);
      }
      setAddBtnList(list);
    } else {
      setAddBtnList([]);
    }
  }, [StarList]);

  useEffect(() => {
    setChooseList(workingList);
  }, [workingList]);

  useEffect(() => {
    setNowAllianceListId(ChooseList);
  }, [ChooseList, setNowAllianceListId]);

  useEffect(() => {
    if (activePlanet?.id) {
      if (StarList.length === 5) {
        toastError(t('Choose up to 5 planets'));
        dispatch(setActivePlanet(null));

        return;
      }
      addPlanetToList(activePlanet.id, StarList.length, 1);
      dispatch(setActivePlanet(null));
    }
  }, [activePlanet, StarList.length, toastError, t, addPlanetToList, dispatch]);

  return (
    <Box position='relative'>
      <MarkText
        width='100%'
        textAlign='center'
        fontStyle='normal'
        fontSize='20px'
        bold
        mb='40px'
      >
        {t('Your Planet Alliance')}
      </MarkText>
      {(StarList ?? []).map((item, index) => (
        <Box mb='40px' key={`${item.id}`}>
          <Flex justifyContent='space-between' height='max-content'>
            <PlanetBall
              rotate
              scale='sm'
              shadow={QualityColor[item?.rarity]}
              url={item?.picture1}
              showUnion
              IconWidth={34}
              IconHeight={32}
            />
            <Flex
              flexDirection='column'
              justifyContent='space-between'
              height='100%'
              width='50%'
            >
              <Flex alignItems='baseline'>
                <MarkText padding={0} fontStyle='normal' fontSize='18px' bold>
                  Lv {item.level}
                </MarkText>
                <Text
                  fontSize='16px'
                  ml='20px'
                  color={RaceTypeColor[item?.race || 3]}
                  bold
                >
                  {item?.race === 1
                    ? t('race-1')
                    : item?.race === 2
                    ? t('race-2')
                    : t('race-3')}
                </Text>
              </Flex>
              <Text small>{t('Power')}</Text>
              <MarkText padding={0} fontStyle='normal' fontSize='20px' bold>
                {item?.power}
              </MarkText>
            </Flex>
            <Flex
              height='100%'
              onClick={() => {
                addPlanetToList(item.id, index, 2);
              }}
            >
              <DeleteBtnImg src='/images/commons/introjs-close.png' />
            </Flex>
          </Flex>
        </Box>
      ))}
      {(AddBtnList ?? []).map(item => (
        <Flex
          key={`${item}`}
          justifyContent='space-between'
          alignItems='center'
          mb='20px'
        >
          <StyledStar
          // onClick={() => {
          //   if (activePlanet.id) {
          //     addPlanetToList(activePlanet.id, StarList.length, 1);
          //   }
          // }}
          />
          <Text width='68%'>
            {t('Select planets from list to join Alliance')}
          </Text>
        </Flex>
      ))}
      <Flex justifyContent='center'>
        <Button
          variant='purple'
          width='180px'
          onClick={() => {
            getWork();
          }}
          height='45px'
          disabled={pending}
        >
          <Text color='textPrimary' bold fontSize='16px'>
            {pending ? <Dots>{t('Save')}</Dots> : t('Save')}
          </Text>
        </Button>
      </Flex>
      {pending && (
        <LoadingBox>
          <Spinner size={200} />
        </LoadingBox>
      )}
      {visible && (
        <ModalWrapper
          title={t('Tips')}
          visible={visible}
          setVisible={() => setVisible(false)}
        >
          <Box padding='80px 25px'>
            <Text textAlign='center' fontSize='28px'>
              {t(
                'Your Alliance is incomplete and may not be able to start Exploration, are you sure you want to confirm?',
              )}
            </Text>
            <Flex justifyContent='space-around' mt='150px'>
              <Button
                width='200px'
                variant='purple'
                onClick={() => setVisible(false)}
              >
                {t('Cancel')}
              </Button>
              <Button
                width='200px'
                variant='purple'
                onClick={() => {
                  setVisible(false);
                  ToSetWorking();
                }}
              >
                {t('Confirm')}
              </Button>
            </Flex>
          </Box>
        </ModalWrapper>
      )}
      {StopWorkVisible && (
        <ModalWrapper
          title={t('Tips')}
          visible={StopWorkVisible}
          setVisible={() => setStopWorkVisible(false)}
        >
          <Box padding='80px 25px'>
            <Text textAlign='center' fontSize='28px'>
              {t('StopWorkWarn')}
            </Text>
            <Flex justifyContent='space-around' mt='80px'>
              <Button
                width='200px'
                variant='purple'
                onClick={() => setStopWorkVisible(false)}
              >
                {t('Cancel')}
              </Button>
              <Button
                variant='purple'
                width='200px'
                onClick={() => {
                  setStopWorkVisible(false);
                  if (ChooseList.length < 5) {
                    setVisible(true);
                    return;
                  }
                  ToSetWorking();
                }}
              >
                {t('Confirm')}
              </Button>
            </Flex>
          </Box>
        </ModalWrapper>
      )}
    </Box>
  );
};

export default Alliance;
