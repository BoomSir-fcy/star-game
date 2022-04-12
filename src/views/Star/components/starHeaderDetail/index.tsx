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
import { RechargeAssets } from '../Modal';

const CardStyled = styled(Card)`
  width: 1610px;
  /* max-height: 140px; */
  flex: 1;
`;
const TextStyled = styled(Text)`
  width: max-content;
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
        <Flex padding='14px 20px' justifyContent='space-between'>
          <Flex>
            <StarCom
              scale='sm'
              quality={planetInfo?.rarity}
              mr='40px'
              showUnion
              style={{ flexShrink: 1 }}
            />
            <Flex flexDirection='column' justifyContent='space-between'>
              <Flex alignItems='center'>
                <Text color='legend'>
                  {t(getPlanetRarity(planetInfo?.rarity))}
                </Text>
                <Text ml='13px' bold>
                  Lv{planetInfo?.level}
                </Text>
                <TextStyled ml='52px' small>
                  {planetInfo?.id}
                </TextStyled>
              </Flex>
              <Flex>
                <Flex alignItems='center' mr='100px'>
                  <ImageStyled src='/images/commons/icon/ore.png' />
                  <Flex flexDirection='column' ml='14px'>
                    <Flex>
                      <TextStyled color='textTips' small>
                        {t('Total capacity')}
                      </TextStyled>
                      <TextStyled ml='20px' small>
                        {planetInfo?.energyYield}/s
                      </TextStyled>
                    </Flex>
                    <Flex>
                      <TextStyled color='textTips' small>
                        {t('Total ore')}
                      </TextStyled>
                      <TextStyled ml='20px' small>
                        {planetInfo?.stone}/{planetInfo?.max_stone}
                      </TextStyled>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex alignItems='center' mr='100px'>
                  <ImageStyled src='/images/commons/icon/population.png' />
                  <Flex flexDirection='column' ml='14px'>
                    <Flex>
                      <TextStyled color='textTips' small>
                        {t('Total capacity')}
                      </TextStyled>
                      <TextStyled ml='20px' small>
                        {planetInfo?.populationYield}/s
                      </TextStyled>
                    </Flex>
                    <Flex>
                      <TextStyled color='textTips' small>
                        {t('Total population')}
                      </TextStyled>
                      <TextStyled ml='20px' small>
                        {planetInfo?.population}/{planetInfo?.max_population}
                      </TextStyled>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex alignItems='center'>
                  <ImageStyled src='/images/commons/icon/energy.png' />
                  <Flex flexDirection='column' ml='14px'>
                    <Flex>
                      <TextStyled color='textTips' small>
                        {t('Total capacity')}
                      </TextStyled>
                      <TextStyled ml='20px' small>
                        {planetInfo?.energyYield}/s
                      </TextStyled>
                    </Flex>
                    <Flex>
                      <TextStyled color='textTips' small>
                        {t('Total energy')}
                      </TextStyled>
                      <TextStyled ml='20px' small>
                        {planetInfo?.energy}/{planetInfo?.max_energy}
                      </TextStyled>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            flexDirection='column'
            justifyContent='space-between'
            alignItems='flex-end'
          >
            <TextStyled fontSize='20px' color='warning'>
              {planetInfo?.status === 2
                ? t(
                    'During cultivation, the planet has no production capacity for the time being',
                  )
                : null}
            </TextStyled>
            <ButtonStyled
              scale='sm'
              onClick={() => setState({ ...state, visible: true })}
            >
              {t('Supplementary resources')}
            </ButtonStyled>
          </Flex>
          <RaceFlex>
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
              <RaceAvatar width='99px' height='99px' race={planetInfo?.race} />
            </RaceImageFlex>
          </RaceFlex>
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
