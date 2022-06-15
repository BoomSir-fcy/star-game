import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Button, Text, Flex, Card, Box } from 'uikit';
import { useStore } from 'state';
import useParsedQueryString from 'hooks/useParsedQueryString';
import StarCom from 'components/StarCom';
import { useTranslation } from 'contexts/Localization';
import { getPlanetRarity } from 'utils/planetRarity';
import { RaceTypeColor } from 'uikit/theme/colors';
import { RaceAvatar } from 'components';
import { RaceType } from 'uikit/theme/types';
import ScoringPanel from 'components/ScoringPanel';
import { RechargeAssets } from '../Modal';

const CardStyled = styled(Card)`
  width: 1610px;
  /* max-height: 140px; */
  flex: 1;
`;
const TextStyled = styled(Text)`
  width: max-content;
  /* max-width: 202px; */
`;
const ImageStyled = styled.img`
  width: 50px;
  height: 50px;
`;
const ButtonStyled = styled(Button)`
  width: 202px;
  height: 52px;
  padding: 10px;
`;
const RaceFlex = styled(Flex)`
  flex-direction: column;
  position: relative;
`;
const RaceImageFlex = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: -10px;
  left: 65px;
  bottom: 0;
`;
const StarHeader = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const parsedQs = useParsedQueryString();
  const id = Number(parsedQs.id);
  const planetInfo = useStore(p => p.planet.planetInfo[id ?? 0]);
  const [state, setState] = React.useState({
    visible: false,
  });

  return (
    <Flex flex={1}>
      <CardStyled ml='82px'>
        <Flex padding='14px 20px' justifyContent='space-between' width='100%'>
          <Flex flex={1} width='100%'>
            <StarCom
              scale='sm'
              quality={planetInfo?.rarity}
              picture={planetInfo?.picture}
              picture1={planetInfo?.picture1}
              mr='40px'
              showUnion={planetInfo?.in_alliance !== 0}
              style={{ flexShrink: 1 }}
            />
            <Flex
              className='planet_header'
              flex={1}
              flexDirection='column'
              justifyContent='space-between'
            >
              <Flex
                justifyContent='space-between'
                alignItems='center'
                width='100%'
              >
                <Flex alignItems='center'>
                  <Text color='legend'>
                    {t(getPlanetRarity(planetInfo?.rarity))}
                  </Text>
                  <Text margin='0 13px' bold>
                    Lv{planetInfo?.level}
                  </Text>
                  {/* <TextStyled ml='52px' small>
                    {planetInfo?.id}
                  </TextStyled> */}
                  <ScoringPanel
                    scale='el'
                    ellipsis
                    count={planetInfo?.strengthenLevel}
                  />
                </Flex>
                {/* <TextStyled ml='10px' fontSize='20px' color='warning'>
                  {planetInfo?.status === 2
                    ? t(
                        'The planet is under cultivating, it has no capacity yet',
                      )
                    : null}
                </TextStyled> */}
              </Flex>
              <Flex justifyContent='space-between' alignItems='center'>
                <Flex alignItems='center'>
                  <ImageStyled src='/images/commons/icon/icon_minera.png' />
                  <Flex flexDirection='column' ml='10px'>
                    <Flex alignItems='center'>
                      <TextStyled color='textTips' small>
                        {t('Total Capacity')}
                      </TextStyled>
                      <TextStyled
                        ml='10px'
                        fontSize='16px'
                        ellipsis
                        style={{ width: '140px' }}
                      >
                        {planetInfo?.energyYield}/s
                      </TextStyled>
                    </Flex>
                    <Flex alignItems='center'>
                      <TextStyled color='textTips' small>
                        {t('Total Ore')}
                      </TextStyled>
                      <TextStyled
                        ml='10px'
                        fontSize='16px'
                        ellipsis
                        style={{ width: '140px' }}
                        title={`${planetInfo?.stone}/${planetInfo?.max_stone}`}
                      >
                        {planetInfo?.stone}/{planetInfo?.max_stone}
                      </TextStyled>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex alignItems='center'>
                  <ImageStyled src='/images/commons/icon/icon_spice.png' />
                  <Flex flexDirection='column' ml='10px'>
                    <Flex alignItems='center'>
                      <TextStyled color='textTips' small>
                        {t('Total Capacity')}
                      </TextStyled>
                      <TextStyled
                        ml='10px'
                        fontSize='16px'
                        ellipsis
                        style={{ width: '140px' }}
                      >
                        {planetInfo?.populationYield}/s
                      </TextStyled>
                    </Flex>
                    <Flex alignItems='center'>
                      <TextStyled color='textTips' small>
                        {t('Total Population')}
                      </TextStyled>
                      <TextStyled
                        ml='10px'
                        fontSize='16px'
                        ellipsis
                        style={{ width: '140px' }}
                        title={`${planetInfo?.population}/${planetInfo?.max_population}`}
                      >
                        {planetInfo?.population}/{planetInfo?.max_population}
                      </TextStyled>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex alignItems='center'>
                  <ImageStyled src='/images/commons/icon/icon_energy.png' />
                  <Flex flexDirection='column' ml='10px'>
                    <Flex alignItems='center'>
                      <TextStyled color='textTips' small>
                        {t('Total Capacity')}
                      </TextStyled>
                      <TextStyled
                        ml='10px'
                        fontSize='16px'
                        ellipsis
                        style={{ width: '140px' }}
                      >
                        {planetInfo?.energyYield}/s
                      </TextStyled>
                    </Flex>
                    <Flex alignItems='center'>
                      <TextStyled color='textTips' small>
                        {t('Total Energy')}
                      </TextStyled>
                      <TextStyled
                        ml='10px'
                        fontSize='16px'
                        ellipsis
                        style={{ width: '140px' }}
                        title={`${planetInfo?.energy}/${planetInfo?.max_energy}`}
                      >
                        {planetInfo?.energy}/{planetInfo?.max_energy}
                      </TextStyled>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex ml='20px' alignItems='flex-end'>
            <ButtonStyled
              scale='sm'
              onClick={() => setState({ ...state, visible: true })}
            >
              {t('Supplement Resources')}
            </ButtonStyled>
            <RaceFlex ml='10px'>
              <img alt='' src='/images/commons/star/race-box.png' />
              <RaceImageFlex>
                <Text
                  color={RaceTypeColor[planetInfo?.race]}
                  mb='2px'
                  fontSize='22px'
                  bold
                >
                  {planetInfo?.race ? t(`race-${planetInfo?.race}`) : ''}
                </Text>
                <RaceAvatar
                  width='99px'
                  height='99px'
                  race={planetInfo?.race}
                />
              </RaceImageFlex>
            </RaceFlex>
          </Flex>
        </Flex>
      </CardStyled>

      <RechargeAssets
        planet_id={id}
        visible={state.visible}
        onClose={() => setState({ ...state, visible: false })}
      />
    </Flex>
  );
};

export default StarHeader;
