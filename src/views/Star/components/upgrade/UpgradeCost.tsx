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
}

export const UpgradeCost: React.FC<UpgradeCostProps> = ({
  stone,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <Flex flexDirection='column'>
      <Text bold fontSize='20px' shadow='primary'>
        {t('升级消耗')}
      </Text>
      <Flex flexWrap='wrap'>
        <ItemFlex>
          <StyledImage
            width={57}
            height={53}
            src='/images/commons/icon/ore.png'
          />
          <ItemInfoFlex>
            <Text small color='textSubtle'>
              {t('Stone')}
            </Text>
            <Text fontSize='22px'>-100</Text>
          </ItemInfoFlex>
        </ItemFlex>
        <ItemFlex>
          <StyledImage
            width={57}
            height={53}
            src='/images/commons/icon/spices.png'
          />
          <ItemInfoFlex>
            <Text small color='textSubtle'>
              {t('Spices')}
            </Text>
            <Text fontSize='22px'>-100</Text>
          </ItemInfoFlex>
        </ItemFlex>
        <ItemFlex>
          <StyledImage
            width={57}
            height={53}
            src='/images/commons/icon/energy.png'
          />
          <ItemInfoFlex>
            <Text small color='textSubtle'>
              {t('Energy')}
            </Text>
            <Text fontSize='22px'>-100</Text>
          </ItemInfoFlex>
        </ItemFlex>
      </Flex>
    </Flex>
  );
};
