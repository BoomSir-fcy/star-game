import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button, Flex, Box, BgCard, MarkText, Text, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';
import { useStore } from 'state';
import { Globe } from 'components';
import { QualityColor } from 'uikit/theme/colors';
import { getPlanetRarity } from 'utils/planetRarity';
import { useJoinAlliance } from 'views/Star/hook';
import ModalQueue from 'views/Star/components/planet/ModalQueue';
import { useToast } from 'contexts/ToastsContext';

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

const ReplaceBtn = styled(Button)`
  position: absolute;
  width: 100%;
  bottom: -15px;
  padding: 0 10px;
  height: 45px;
`;

const UpDownImg = styled.img`
  width: 33px;
  height: 33px;
  display: inline-block;
  margin-right: 4px;
`;

const AlliancePlanetList: React.FC<{
  ShowListModule: boolean;
  setShowListModule: (e) => void;
  ChoosePlant: Api.Planet.PlanetInfo;
}> = ({ ShowListModule, ChoosePlant, setShowListModule }) => {
  const { t } = useTranslation();
  const { toastError, toastSuccess, toastWarning } = useToast();
  const { SetWorking } = useJoinAlliance();
  const { order } = useStore(p => p.alliance.allianceView);
  const workingList = useStore(p => p.alliance.workingPlanet);
  const [ChooseList, setChooseList] = useState<number[]>([]);
  const [StarList, setStarList] = useState<Api.Planet.PlanetInfo[]>([]);

  // const PlanetList = useMemo(() => {
  //   const arr = [];
  //   for (let i = 0; i < 5; i++) {
  //     const item = { ...order[i]?.planet };
  //     arr.push(item);
  //   }
  //   return arr;
  // }, [order]);

  const UpDownImgUrl = useCallback((Choose: number, now: number) => {
    if (Choose > now) {
      return '/images/commons/icon/up.png';
    }
    if (Choose === now) {
      return '';
    }
    return '/images/commons/icon/down.png';
  }, []);

  const addPlanetToList = useCallback(
    (id: number) => {
      if (id === ChoosePlant.id) {
        toastError(t('此星球为当前选择星球'));
        return;
      }
      console.log(123);
    },
    [ChoosePlant, t, toastError],
  );

  useEffect(() => {
    const arr = order.map(item => {
      return item.planet;
    });
    // const arr = [];
    // for (let i = 0; i < order.length; i++) {
    //   const item = order[i]?.planet;
    //   arr.push(item);
    //   console.log(item);
    // }
    console.log(arr);
    setStarList(arr);
  }, [order]);

  useEffect(() => {
    console.log(StarList);
  }, [StarList]);

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
          <Button onClick={() => {}} padding='0 10px' height='42px'>
            <Text>{t('保存更改')}</Text>
          </Button>
        </Flex>
        <ScrollBox>
          {(StarList ?? []).map((item, index) => (
            <Box mb='30px' key={`${item.id}_${item.name}`}>
              {item?.id > 0 ? (
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
                    <ReplaceBtn onClick={() => {}}>
                      <Text>{t('替换')}</Text>
                    </ReplaceBtn>
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
                      <Text
                        width='98px'
                        color={QualityColor[item?.rarity]}
                        bold
                      >
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
                      {ChoosePlant.stone !== item?.stone && (
                        <UpDownImg
                          src={UpDownImgUrl(ChoosePlant.stone, item?.stone)}
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
                      {ChoosePlant.energy !== item?.energy && (
                        <UpDownImg
                          src={UpDownImgUrl(ChoosePlant.energy, item?.energy)}
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
                      {ChoosePlant.population !== item?.population && (
                        <UpDownImg
                          src={UpDownImgUrl(
                            ChoosePlant.population,
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
                      {ChoosePlant.oreYield !== item?.oreYield && (
                        <UpDownImg
                          src={UpDownImgUrl(
                            ChoosePlant.oreYield,
                            item?.oreYield,
                          )}
                          alt=''
                        />
                      )}
                    </Flex>
                    <Flex ml='14px' alignItems='center'>
                      <Text bold>+{item?.energyYield}/s</Text>
                      {ChoosePlant.energyYield !== item?.energyYield && (
                        <UpDownImg
                          src={UpDownImgUrl(
                            ChoosePlant.energyYield,
                            item?.energyYield,
                          )}
                          alt=''
                        />
                      )}
                    </Flex>
                    <Flex ml='14px' alignItems='center'>
                      <Text bold>+{item?.populationYield}/s</Text>
                      {ChoosePlant.populationYield !==
                        item?.populationYield && (
                        <UpDownImg
                          src={UpDownImgUrl(
                            ChoosePlant.populationYield,
                            item?.populationYield,
                          )}
                          alt=''
                        />
                      )}
                    </Flex>
                  </Flex>
                </Flex>
              ) : (
                <Flex>
                  <Button onClick={() => {}} padding='0 10px' height='42px'>
                    <Text>{t('添加')}</Text>
                  </Button>
                </Flex>
              )}
            </Box>
          ))}
        </ScrollBox>
      </ListBox>
    </OutModule>
  );
};

export default AlliancePlanetList;
