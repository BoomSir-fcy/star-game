import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from 'react';
import styled from 'styled-components';
import { Box, Flex, Spinner, Text, Image, MarkText, Button } from 'uikit';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'contexts/Localization';
import { useStore } from 'state';
import { PlanetBall, RaceAvatar } from 'components';
import { QualityColor, RaceTypeColor } from 'uikit/theme/colors';
import { getPlanetRarity } from 'utils/planetRarity';
import { setActivePlanet } from 'state/planet/actions';
import { PlanetDesc } from './PlanetDesc';
import { LinkStyled } from '../styled';

const ScrollBox = styled(Flex)`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  flex-wrap: wrap;
`;
const PlanetItem = styled(Box)`
  position: relative;
  height: 300px;
  width: 740px;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid ${({ theme }) => theme.colors.borderPrimary};
  margin-bottom: 10px;
  margin-right: 10px;
  padding: 16px 20px;
  &:nth-child(2n) {
    margin-right: 0;
  }
`;

const LeveFlex = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const ClickModule = styled(Flex)`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgb(22 25 32 / 50%);
  top: 0;
  left: 0;
  align-items: center;
  justify-content: space-around;
`;

const PlanetListBox: React.FC<{
  activePlanet: Api.Planet.PlanetInfo;
  planetList: Api.Planet.PlanetInfo[];
  setActive: (item: any) => void;
  loadMore: (e) => void;
}> = ({ activePlanet, planetList, setActive, loadMore }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const WorkCount = useCallback((time: number, count: number) => {
    let num = 0;
    const toDay = new Date(new Date().toLocaleDateString()).getTime() / 1000;
    if (time >= toDay) {
      num = count;
    }
    return num;
  }, []);

  return (
    <ScrollBox onScroll={loadMore}>
      {planetList.length ? (
        <>
          {(planetList ?? []).map(item => (
            <PlanetItem
              key={`${item?.id}_${item.addTime}`}
              onClick={() => setActive(item)}
            >
              <Flex
                justifyContent='space-between'
                alignItems='center'
                height='100%'
                style={{
                  cursor: 'pointer',
                }}
              >
                <Flex
                  height='100%'
                  flexDirection='column'
                  justifyContent='space-between'
                  width='33%'
                >
                  <LeveFlex>
                    <Text
                      fontSize='16px'
                      color={QualityColor[item?.rarity]}
                      bold
                    >
                      {t(getPlanetRarity(item?.rarity))}
                    </Text>
                    <Text fontSize='16px' style={{ whiteSpace: 'nowrap' }} bold>
                      Lv {item?.level}
                    </Text>
                    <Flex alignItems='center'>
                      <RaceAvatar
                        width='20px'
                        height='20px'
                        race={item?.race}
                      />
                      <Text
                        fontSize='16px'
                        ml='4px'
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
                  </LeveFlex>
                  <Flex flex={1} justifyContent='center' alignItems='center'>
                    <PlanetBall
                      rotate
                      scale='xl'
                      shadow={QualityColor[item?.rarity]}
                      url={item?.picture1}
                    />
                  </Flex>
                  <Flex alignItems='baseline'>
                    <Text small mr='10px'>
                      {t('Power')}
                    </Text>
                    <MarkText fontStyle='normal' fontSize='20px' bold>
                      {item?.power}
                    </MarkText>
                  </Flex>
                </Flex>
                <Flex
                  flexDirection='column'
                  justifyContent='space-between'
                  height='100%'
                  width='43%'
                >
                  <Flex alignItems='baseline'>
                    <MarkText
                      padding={0}
                      bold
                      fontStyle='normal'
                      color='textSubtle'
                    >
                      {t('Production')}
                    </MarkText>
                    <Text ml='20px' small>
                      {t('Explorations in 24h:')}
                      &nbsp;
                      {WorkCount(item.work_time, item.work_count)}
                    </Text>
                  </Flex>
                  <PlanetDesc info={item} />
                  <Flex>
                    <Text small mr='10px'>
                      {t('devour value')}
                    </Text>
                    <Text small>{item?.can_provided_exp}</Text>
                  </Flex>
                </Flex>
                <Flex
                  flexDirection='column'
                  justifyContent='space-between'
                  height='100%'
                  width='20%'
                >
                  <MarkText padding={0} fontStyle='normal' bold>
                    {t('Battle Attributes')}
                  </MarkText>
                  <Box>
                    <Text small color='textSubtle'>
                      {t('Building Count')}
                    </Text>
                    <Text small>{item?.build_count}</Text>
                  </Box>
                  <Box>
                    <Text small color='textSubtle'>
                      {t('Biohack')}
                    </Text>
                    <Text small>
                      {t('Power')} +{item?.ak_buff}
                    </Text>
                  </Box>
                  <Box>
                    <Text small color='textSubtle'>
                      {t('Planet Cultivation')}
                    </Text>
                    <Text small>
                      {t('Power')} +{item?.strengthen_buff}
                    </Text>
                  </Box>
                  <Box>
                    <Text small>{t('Token')}</Text>
                    <Text small>{item?.id}</Text>
                  </Box>
                </Flex>
              </Flex>
              {activePlanet?.id === item?.id && (
                <ClickModule>
                  <Button
                    width='183px'
                    height='45px'
                    variant='purple'
                    onClick={() => {
                      dispatch(setActivePlanet(item));
                    }}
                  >
                    <Text color='textPrimary' bold>
                      {t('Choose Planet')}
                    </Text>
                  </Button>
                  <Button
                    width='183px'
                    height='45px'
                    variant='purple'
                    onClick={() => {
                      navigate(`/star?id=${item?.id}`);
                    }}
                  >
                    <Text color='textPrimary' bold>
                      {t('Manage Planet')}
                    </Text>
                  </Button>
                </ClickModule>
              )}
            </PlanetItem>
          ))}
        </>
      ) : (
        <Flex
          mt='50px'
          // ml='25%'
          width='100%'
          justifyContent='center'
          alignItems='center'
        >
          <LinkStyled to='/mystery-box'>
            <Text fontSize='18px'>
              {t('No data, Go to open the black hole')} &gt;
            </Text>
          </LinkStyled>
        </Flex>
      )}
    </ScrollBox>
  );
};

export default PlanetListBox;
