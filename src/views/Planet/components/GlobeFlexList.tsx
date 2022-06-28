import React from 'react';
import { Flex, Spinner, Box, Text } from 'uikit';
import { QualityColor } from 'uikit/theme/colors';
import { Globe } from 'components';
import { useStore } from 'state';
import { useTranslation } from 'contexts/Localization';
import { GlobeFlex, Desc, useStarCss, LinkStyled } from '../styled';

interface GlobeFlexListProps {
  planetList: Api.Planet.PlanetInfo[];
  activePlanet: Api.Planet.PlanetInfo;
  setVisibleInfo: (visible: boolean) => void;
  setActivePlanet: (item: any) => void;
}
const GlobeFlexList: React.FC<GlobeFlexListProps> = ({
  planetList,
  activePlanet,
  setVisibleInfo,
  setActivePlanet,
}) => {
  const { t } = useTranslation();
  const starCss = useStarCss(planetList.length);
  const loading = useStore(p => p.planet.mePlanetLoading);
  return (
    <GlobeFlex starCss={starCss}>
      {loading ? (
        <Flex ml='25%' alignItems='center' justifyContent='center'>
          <Spinner />
        </Flex>
      ) : (
        <>
          {planetList?.length > 0 &&
            planetList.map((item, index) => (
              <Box
                className={`star star-${index} `}
                key={item?.id}
                onClick={() => {
                  setVisibleInfo(true);
                  setActivePlanet(item);
                }}
              >
                <Box className='ball'>
                  <Desc>
                    {activePlanet?.id === item?.id && (
                      <Flex
                        pt='7px'
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                      >
                        <Flex justifyContent='center' alignItems='center'>
                          <Text fontSize='0.001rem'>战斗力</Text>
                          <Text
                            ml='0.4rem'
                            fontSize='1rem'
                            fontStyle='normal'
                            mark
                            bold
                          >
                            Lv {item?.level}
                          </Text>
                        </Flex>
                        <Text fontSize='1rem' fontStyle='normal' mark bold>
                          {item?.power}
                        </Text>
                      </Flex>
                    )}
                  </Desc>
                  <Globe
                    shadow={QualityColor[item?.rarity]}
                    rotate={activePlanet?.id === item?.id}
                    url={item?.picture1}
                  />
                </Box>
              </Box>
            ))}
          {!planetList?.length && (
            <Flex
              mt='50px'
              ml='25%'
              justifyContent='center'
              alignItems='center'
            >
              <LinkStyled to='/mystery-box'>
                <Text fontSize='18px'>
                  {t('No data, Go to open the blind box')} &gt;
                </Text>
              </LinkStyled>
            </Flex>
          )}
        </>
      )}
    </GlobeFlex>
  );
};

export default React.memo(GlobeFlexList);
