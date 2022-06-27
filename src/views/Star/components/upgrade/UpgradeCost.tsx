import { useTranslation } from 'contexts/Localization';
import React from 'react';
import styled from 'styled-components';
import { Flex, FlexProps, Image, Text } from 'uikit';

const ItemFlex = styled(Flex)`
  margin-top: 23px;
  margin-right: 100px;
  flex: 1;
`;
const ItemInfoFlex = styled(Flex)`
  flex-direction: column;
  margin-left: 10px;
  flex: 1;
`;

const StyledImage = styled(Image)`
  flex-shrink: 0;
`;

interface UpgradeCostProps extends FlexProps {
  stone?: number;
  spices?: number;
  energy?: number;
  planetInfo: Api.Planet.PlanetInfo;
}

export const UpgradeCost: React.FC<UpgradeCostProps> = ({
  stone,
  spices,
  energy,
  planetInfo,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Flex>
      <ItemFlex>
        <StyledImage
          width={35}
          height={39}
          src='/images/commons/icon/icon_minera.png'
        />
        <ItemInfoFlex>
          <Text small color='textSubtle'>
            {t('Ore')}
          </Text>
          <Text bold color={planetInfo?.stone < stone ? 'warning' : 'white'}>
            -{stone}
          </Text>
        </ItemInfoFlex>
      </ItemFlex>
      <ItemFlex>
        <StyledImage
          width={35}
          height={39}
          src='/images/commons/icon/icon_spice.png'
        />
        <ItemInfoFlex>
          <Text small color='textSubtle'>
            {t('Population')}
          </Text>
          <Text
            bold
            color={planetInfo?.population < spices ? 'warning' : 'white'}
          >
            -{spices}
          </Text>
        </ItemInfoFlex>
      </ItemFlex>
      <ItemFlex>
        <StyledImage
          width={35}
          height={39}
          src='/images/commons/icon/icon_energy.png'
        />
        <ItemInfoFlex>
          <Text small color='textSubtle'>
            {t('Energy')}
          </Text>
          <Text bold color={planetInfo?.energy < energy ? 'warning' : 'white'}>
            -{energy}
          </Text>
        </ItemInfoFlex>
      </ItemFlex>
    </Flex>
  );
};
