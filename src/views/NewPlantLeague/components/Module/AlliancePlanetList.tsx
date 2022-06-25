import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button, Flex, Box, Spinner, MarkText, Text, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';
import { useStore } from 'state';
import { Globe } from 'components';
import { QualityColor } from 'uikit/theme/colors';
import { getPlanetRarity } from 'utils/planetRarity';
import { useJoinAlliance } from 'views/Star/hook';
import ModalQueue from 'views/Star/components/planet/ModalQueue';
import { useToast } from 'contexts/ToastsContext';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import { useDispatch } from 'react-redux';

const OutModule = styled(Box)<{ ShowListModule: boolean }>`
  display: ${({ ShowListModule }) => (ShowListModule ? 'block' : 'none')};
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ListBox = styled(Box)`
  width: 660px;
  height: 100%;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid ${({ theme }) => theme.colors.borderPrimary};
  padding: 16px;
`;

const ScrollBox = styled(Box)`
  min-height: calc(100% - 60px);
  max-height: calc(100% - 60px);
  overflow-y: auto;
`;

const BtnFlex = styled(Flex)`
  position: absolute;
  width: 120%;
  bottom: -15px;
  left: -16px;
  justify-content: space-between;
`;

const ReplaceBtn = styled(Button)`
  width: 48%;
  height: 45px;
  padding: 0 4px;
`;

const UpDownImg = styled.img`
  width: 33px;
  height: 33px;
  display: inline-block;
  margin-right: 4px;
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

const AlliancePlanetList: React.FC<{
  ShowListModule: boolean;
  setShowListModule: (e) => void;
}> = ({ ShowListModule, setShowListModule }) => {
  const { t } = useTranslation();
  const { toastError, toastSuccess, toastWarning } = useToast();
  const dispatch = useDispatch();

  const { SetWorking } = useJoinAlliance();
  const { order } = useStore(p => p.alliance.allianceView);
  const workingList = useStore(p => p.alliance.workingPlanet);
  const activePlanet = useStore(p => p.planet.activePlanet);
  const [ChooseList, setChooseList] = useState<number[]>([]);
  const [StarList, setStarList] = useState<Api.Planet.PlanetInfo[]>([]);
  const [AddBtnList, setAddBtnList] = useState([]);
  const [pending, setpending] = useState(false);

  const UpDownImgUrl = useCallback((Choose: number, now: number) => {
    if (Choose > now) {
      return '/images/commons/icon/up.png';
    }
    if (Choose === now) {
      return '';
    }
    return '/images/commons/icon/down.png';
  }, []);

  // 添加、替换、删除
  const addPlanetToList = useCallback(
    (id: number, index: number, type: number) => {
      const list = ChooseList.concat([]);
      const arr = StarList.concat();
      let newList = [];
      const InIt = list.indexOf(activePlanet.id);
      if (type === 1) {
        // 替换、添加
        if (InIt !== -1) {
          toastError(t('联盟中已有此星球'));
          return;
        }
        arr[index] = activePlanet;
        list[index] = activePlanet.id;
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
      console.log(ChooseList);
      await SetWorking(ChooseList);
      toastSuccess(t('Join Succeeded'));
      dispatch(fetchAllianceViewAsync());

      setShowListModule(false);
    } catch (e) {
      console.error(e);
      toastError(t('Join Failed'));
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
    setShowListModule,
    dispatch,
  ]);
  useEffect(() => {
    if (order.length) {
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
    }
  }, [StarList]);

  useEffect(() => {
    setChooseList(workingList);
  }, [workingList]);

  return (
    <OutModule
      ShowListModule={ShowListModule}
      onClick={() => setShowListModule(false)}
    >
      <ListBox
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Flex mb='20px' justifyContent='space-between' alignItems='flex-end'>
          <MarkText fontSize='18px' bold fontStyle='normal'>
            {t('行星联盟更换')}
          </MarkText>
          <Button onClick={ToSetWorking} padding='0 10px' height='42px'>
            <Text>{t('保存更改')}</Text>
          </Button>
        </Flex>
        <ScrollBox>
          {(StarList ?? []).map((item, index) => (
            <Box mb='30px' key={`${item.id}`}>
              <Flex
                padding='0 20px'
                justifyContent='space-between'
                alignItems='center'
                height='156px'
              >
                <Box position='relative'>
                  <Globe
                    scale='md'
                    shadow={QualityColor[item?.rarity]}
                    url={item?.picture1}
                  />
                  <BtnFlex>
                    <ReplaceBtn
                      onClick={() => {
                        addPlanetToList(item.id, index, 1);
                      }}
                    >
                      <Text>{t('替换')}</Text>
                    </ReplaceBtn>
                    <ReplaceBtn
                      onClick={() => {
                        addPlanetToList(item.id, index, 2);
                      }}
                    >
                      <Text>{t('删除')}</Text>
                    </ReplaceBtn>
                  </BtnFlex>
                </Box>
                <Flex
                  flexDirection='column'
                  justifyContent='space-between'
                  height='100%'
                >
                  <Flex alignItems='baseline'>
                    <Text mr='10px' color='textSubtle'>
                      {t('稀有度')}
                    </Text>
                    <Text width='98px' color={QualityColor[item?.rarity]} bold>
                      {t(getPlanetRarity(item?.rarity))}
                    </Text>
                  </Flex>

                  <Flex alignItems='baseline'>
                    <Text mr='10px' color='textSubtle'>
                      {t('兵种总数')}
                    </Text>
                    <Text bold>{item?.arm_count}</Text>
                  </Flex>
                  <Flex alignItems='center'>
                    <Text mr='10px' color='textSubtle'>
                      {t('Ore')}
                    </Text>
                    <Text bold>
                      {item?.stone}/{item?.max_stone}
                    </Text>
                    {activePlanet.stone !== item?.stone && (
                      <UpDownImg
                        src={UpDownImgUrl(activePlanet.stone, item?.stone)}
                        alt=''
                      />
                    )}
                  </Flex>
                  <Flex alignItems='center'>
                    <Text mr='10px' color='textSubtle'>
                      {t('Energy')}
                    </Text>
                    <Text bold>
                      {item?.energy}/{item?.max_energy}
                    </Text>
                    {activePlanet.energy !== item?.energy && (
                      <UpDownImg
                        src={UpDownImgUrl(activePlanet.energy, item?.energy)}
                        alt=''
                      />
                    )}
                  </Flex>
                  <Flex alignItems='center'>
                    <Text mr='10px' color='textSubtle'>
                      {t('Population')}
                    </Text>
                    <Text bold>
                      {item?.population}/{item?.max_population}
                    </Text>
                    {activePlanet.population !== item?.population && (
                      <UpDownImg
                        src={UpDownImgUrl(
                          activePlanet.population,
                          item?.population,
                        )}
                        alt=''
                      />
                    )}
                  </Flex>
                </Flex>
                <Flex
                  flexDirection='column'
                  justifyContent='space-between'
                  height='100%'
                >
                  <Flex alignItems='baseline'>
                    <Text mr='10px'>{t('Power')}</Text>
                    <MarkText fontStyle='normal' fontSize='20px' bold>
                      {item.power}
                    </MarkText>
                  </Flex>

                  <Flex alignItems='baseline'>
                    <Text mr='10px' color='textSubtle'>
                      {t('Building Count')}
                    </Text>
                    <Text bold>{item?.build_count}</Text>
                  </Flex>
                  <Flex ml='14px' alignItems='center'>
                    <Text bold>+{item?.oreYield}/s</Text>
                    {activePlanet.oreYield !== item?.oreYield && (
                      <UpDownImg
                        src={UpDownImgUrl(
                          activePlanet.oreYield,
                          item?.oreYield,
                        )}
                        alt=''
                      />
                    )}
                  </Flex>
                  <Flex ml='14px' alignItems='center'>
                    <Text bold>+{item?.energyYield}/s</Text>
                    {activePlanet.energyYield !== item?.energyYield && (
                      <UpDownImg
                        src={UpDownImgUrl(
                          activePlanet.energyYield,
                          item?.energyYield,
                        )}
                        alt=''
                      />
                    )}
                  </Flex>
                  <Flex ml='14px' alignItems='center'>
                    <Text bold>+{item?.populationYield}/s</Text>
                    {activePlanet.populationYield !== item?.populationYield && (
                      <UpDownImg
                        src={UpDownImgUrl(
                          activePlanet.populationYield,
                          item?.populationYield,
                        )}
                        alt=''
                      />
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          ))}
          {(AddBtnList ?? []).map(item => (
            <Flex
              key={`${item}`}
              padding='0 20px'
              justifyContent='center'
              alignItems='center'
              height='156px'
            >
              <Button
                onClick={() => {
                  addPlanetToList(activePlanet.id, StarList.length, 1);
                }}
                padding='0 10px'
                height='42px'
              >
                <Text>{t('添加')}</Text>
              </Button>
            </Flex>
          ))}
        </ScrollBox>
      </ListBox>
      {pending && (
        <LoadingBox
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <Spinner size={200} />
        </LoadingBox>
      )}
    </OutModule>
  );
};

export default AlliancePlanetList;