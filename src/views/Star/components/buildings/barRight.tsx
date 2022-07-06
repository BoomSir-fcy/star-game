import React from 'react';
import styled from 'styled-components';
import { useStore } from 'state';
import { Flex, Box, MarkText, BoxProps } from 'uikit';

import { useTranslation } from 'contexts/Localization';
import { useNavigate } from 'react-router-dom';
import { BarCard } from './barCard';
import { BarHead } from './barHead';
import { PlanetAssets } from './planetAssets';
import { PlanetBuff } from './planetBuff';
import { useBuffer } from '../hooks';

const BarLayout = styled(Box)<{ top: number | string }>`
  position: fixed;
  right: 0;
  /* top: 8%; */
  top: ${({ top }) => top};
  z-index: 88;
`;

const ImgFlex = styled(Flex)`
  width: 38px;
  img {
    width: 100%;
  }
`;
interface BarRightProps extends BoxProps {
  planet_id: number;
  top: number | string;
}
export const BarRight: React.FC<BarRightProps> = ({
  planet_id,
  top,
  ...props
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getPlanetBuff } = useBuffer();
  const [currentBufffer, setCurrentBuffer] = React.useState({});
  const planetInfo = useStore(p => p.planet.planetInfo[planet_id ?? 0]);

  const getBuffer = React.useCallback(async () => {
    const res = await getPlanetBuff({ planet_id });
    const buffer = (res ?? []).reduce((current: any, next: any) => {
      // eslint-disable-next-line array-callback-return
      Object.keys(next).map((key: string) => {
        if (current[key]) {
          // eslint-disable-next-line no-param-reassign
          current[key] += next[key];
        } else {
          // eslint-disable-next-line no-param-reassign
          current[key] = next[key];
        }
      });
      return current;
    }, {});
    setCurrentBuffer(buffer);
  }, [getPlanetBuff, planet_id]);

  React.useEffect(() => {
    getBuffer();
  }, [getBuffer]);

  return (
    <BarLayout top={top} {...props}>
      <Flex flexDirection='column' alignItems='flex-end'>
        <BarHead plant_info={planetInfo} />
        <BarCard
          title={t('planetMenuBuilding')}
          onClick={() => navigate(`/star?id=${planet_id}`)}
        >
          <Flex
            justifyContent='center'
            alignItems='center'
            width='42px'
            height='42px'
            mr='8px'
            position='relative'
          >
            <MarkText fontSize='18px' bold fontStyle='italic'>
              {planetInfo?.build_count}
            </MarkText>
          </Flex>
        </BarCard>
        <BarCard
          title={t('planetMenuUpgrade')}
          onClick={() => navigate(`/star/upgrade?id=${planet_id}`)}
        >
          <Flex
            justifyContent='center'
            alignItems='center'
            width='42px'
            height='42px'
            mr='8px'
            position='relative'
          >
            <MarkText fontSize='18px' bold fontStyle='italic'>
              Lv{planetInfo?.level}
            </MarkText>
          </Flex>
        </BarCard>
        <BarCard
          title={t('planetMenuGrow')}
          onClick={() => navigate(`/star/grow?id=${planet_id}`)}
        >
          <Flex
            justifyContent='center'
            alignItems='center'
            width='42px'
            height='42px'
            mr='8px'
            position='relative'
          >
            <MarkText fontSize='18px' bold fontStyle='italic'>
              +1
            </MarkText>
          </Flex>
        </BarCard>
        <BarCard
          title={t('planetMenuEmbattle')}
          onClick={() => navigate(`/star/embattle?id=${planet_id}`)}
        >
          <Flex
            justifyContent='center'
            alignItems='center'
            width='42px'
            height='42px'
            mr='8px'
            position='relative'
          >
            <ImgFlex justifyContent='center' alignItems='center'>
              <img src='/images/commons/icon/icon-finish.png' alt='' />
            </ImgFlex>
          </Flex>
        </BarCard>
        <Box>
          <PlanetAssets plant_info={planetInfo} current_buff={currentBufffer} />
          {/* <PlanetBuff current_buff={currentBufffer} /> */}
        </Box>
      </Flex>
    </BarLayout>
  );
};
