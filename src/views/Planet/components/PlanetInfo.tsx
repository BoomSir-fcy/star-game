import BigNumber from 'bignumber.js';
import { Globe, RaceAvatar, TooltipTrigger } from 'components';
import StarCom from 'components/StarCom';
import { useTranslation } from 'contexts/Localization';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Text, Flex, Box, GraphicsCard, Image } from 'uikit';
import { QualityColor, RaceTypeColor } from 'uikit/theme/colors';
import { formatDisplayApr, splitThousandSeparator } from 'utils/formatBalance';

const InfoFlex = styled(Flex)`
  margin-top: 13px;
  flex-wrap: wrap;
  justify-content: flex-end;
  & > :nth-child(n) {
    margin-bottom: 14px;
  }
`;
const InfoValueFlex = styled(Flex)`
  width: 207px;
`;
const ImageStyled = styled.img`
  width: 45px;
  height: 45px;
`;
const TextStyled = styled(Text)`
  width: max-content;
`;
const PlanetInfo: React.FC<{ info: Api.Planet.PlanetInfo }> = ({ info }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <GraphicsCard padding='29px 37px' borderWidth={2}>
      <Flex justifyContent='space-between'>
        <Box>
          <Flex mb='17px' justifyContent='center' alignItems='center'>
            <Text color={QualityColor[info?.rarity]} fontSize='24px' bold>
              {info?.rarity ? t(`rarity-${info?.rarity}`) : ''}
            </Text>
            <Text ml='17px' fontSize='18px' bold>
              Lv{info?.level}
            </Text>
          </Flex>
          <Globe
            width='174px'
            height='161px'
            shadow={QualityColor[info?.rarity]}
            url={info?.picture1}
            showUnion={info?.in_alliance !== 0}
          />
        </Box>

        <Box>
          <Flex justifyContent='flex-end' alignItems='center'>
            <Text>{t('Power')}</Text>
            <Text ml='20px' mark fontStyle='normal' fontSize='20px' bold>
              {formatDisplayApr(info?.power)}
            </Text>

            <TooltipTrigger
              overlay={
                <Box>
                  <Text small>{t('BUFFBonusDesc')}</Text>
                  <Text color='textPrimary' small>
                    +{info?.ak_buff}
                  </Text>
                  <Text mt='10px' small>
                    {t('NurturingBonusDesc')}
                  </Text>
                  <Text color='textPrimary' small>
                    +{info?.strengthen_buff}
                  </Text>
                </Box>
              }
            >
              <Image
                ml='10px'
                width={25}
                height={25}
                src='/images/commons/icon/help-new.png'
              />
            </TooltipTrigger>
          </Flex>
          <InfoFlex>
            <InfoValueFlex alignItems='center'>
              <ImageStyled src='/images/commons/icon/icon_minera.png' />
              <Box ml='10px'>
                <Flex alignItems='center'>
                  <TextStyled color='textTips' small>
                    {t('Capacity')}
                  </TextStyled>
                  <TextStyled ml='10px' small ellipsis>
                    {formatDisplayApr(new BigNumber(info?.oreYield).toNumber())}
                    /s
                  </TextStyled>
                </Flex>
                <Flex alignItems='center'>
                  <TextStyled
                    color='textTips'
                    small
                    title={`${info?.stone}/${info?.max_stone}`}
                  >
                    {t('Ore')}
                  </TextStyled>
                  <TextStyled ml='10px' ellipsis small>
                    {info?.stone}/{info?.max_stone}
                  </TextStyled>
                </Flex>
              </Box>
            </InfoValueFlex>
            <InfoValueFlex alignItems='center'>
              <ImageStyled src='/images/commons/icon/icon_spice.png' />
              <Box ml='10px'>
                <Flex alignItems='center'>
                  <TextStyled color='textTips' small>
                    {t('Capacity')}
                  </TextStyled>
                  <TextStyled ml='10px' ellipsis small>
                    {formatDisplayApr(
                      new BigNumber(info?.populationYield).toNumber(),
                    )}
                    /s
                  </TextStyled>
                </Flex>
                <Flex alignItems='center'>
                  <TextStyled color='textTips' small>
                    {t('Population')}
                  </TextStyled>
                  <TextStyled
                    ml='10px'
                    small
                    ellipsis
                    title={`${info?.population}/${info?.max_population}`}
                  >
                    {info?.population}/{info?.max_population}
                  </TextStyled>
                </Flex>
              </Box>
            </InfoValueFlex>
            <InfoValueFlex alignItems='center'>
              <ImageStyled src='/images/commons/icon/icon_energy.png' />
              <Box ml='10px'>
                <Flex alignItems='center'>
                  <TextStyled color='textTips' small>
                    {t('Capacity')}
                  </TextStyled>
                  <TextStyled ml='10px' ellipsis small>
                    {formatDisplayApr(
                      new BigNumber(info?.energyYield).toNumber(),
                    )}
                    /s
                  </TextStyled>
                </Flex>
                <Flex alignItems='center'>
                  <TextStyled color='textTips' small>
                    {t('Energy')}
                  </TextStyled>
                  <TextStyled
                    ml='10px'
                    ellipsis
                    small
                    title={`${info?.energy}/${info?.max_energy}`}
                  >
                    {info?.energy}/{info?.max_energy}
                  </TextStyled>
                </Flex>
              </Box>
            </InfoValueFlex>
            <InfoValueFlex flexDirection='column'>
              <Flex>
                <Text color='textTips' small>
                  {t('Building Count')}
                </Text>
                <Text ml='8px' small>
                  {info?.build_count}
                </Text>
              </Flex>
              <Flex>
                <Text color='textTips' small>
                  {t('Total number of arms')}
                </Text>
                <Text ml='8px' small>
                  {info?.arm_count}
                </Text>
              </Flex>
            </InfoValueFlex>
            <InfoValueFlex alignItems='center'>
              <RaceAvatar
                ml='4px'
                width='46px'
                height='46px'
                race={info?.race}
              />
              <Text
                color={RaceTypeColor[info?.race]}
                fontSize='18px'
                ml='15px'
                bold
              >
                {info?.race ? t(`race-${info?.race}`) : ''}
              </Text>
            </InfoValueFlex>
            <Button
              width='207px'
              height='53px'
              variant='purple'
              onClick={() => {
                navigate(`/star?id=${info?.id}`);
              }}
            >
              <Text color='textPrimary' bold>
                {t('Manage Planet')}
              </Text>
            </Button>
          </InfoFlex>
        </Box>
      </Flex>
    </GraphicsCard>
  );
};

export default PlanetInfo;
