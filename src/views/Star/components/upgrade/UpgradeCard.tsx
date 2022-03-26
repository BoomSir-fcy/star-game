import React from 'react';
import styled from 'styled-components';
import { Card, Flex, Image, Text } from 'uikit';

const StyledCard = styled(Card)`
  width: 300px;
  justify-content: center;
  align-items: center;
  padding: 56px 35px;
`;
const ItemFlex = styled(Flex)`
  margin-top: 23px;
`;
const ItemInfoFlex = styled(Flex)`
  flex-direction: column;
  margin-left: 23px;
  flex: 1;
`;
const UpFlex = styled(Flex)`
  flex: 1;
  margin-left: 25px;
`;
const StyledImage = styled(Image)`
  flex-shrink: 0;
`;

interface UpgradeCardProps {
  info?: any;
}
export const UpgradeCard: React.FC<UpgradeCardProps> = () => {
  return (
    <StyledCard>
      <Flex flexDirection='column'>
        <Text bold fontSize='22px' shadow='primary'>
          当前Lv1效果
        </Text>
        <ItemFlex>
          <StyledImage
            width={57}
            height={53}
            src='/images/commons/star/LV.png'
          />
          <ItemInfoFlex>
            <Text small color='textSubtle'>
              建筑等级上限
            </Text>
            <Flex justifyContent='space-between' alignItems='center'>
              <Text fontSize='22px'>Lv 10</Text>
              <UpFlex>
                <StyledImage
                  width={33}
                  height={33}
                  src='/images/commons/icon/up.png'
                />
                <Text fontSize='22px' color='legend'>
                  15
                </Text>
              </UpFlex>
            </Flex>
          </ItemInfoFlex>
        </ItemFlex>
        <ItemFlex>
          <StyledImage
            width={57}
            height={53}
            src='/images/commons/star/HP.png'
          />
          <ItemInfoFlex>
            <Text small color='textSubtle'>
              建筑等级上限
            </Text>
            <Text fontSize='22px'>+100</Text>
          </ItemInfoFlex>
        </ItemFlex>
        <ItemFlex>
          <StyledImage
            width={57}
            height={53}
            src='/images/commons/star/defense.png'
          />
          <ItemInfoFlex>
            <Text small color='textSubtle'>
              建筑等级上限
            </Text>
            <Text fontSize='22px'>+100</Text>
          </ItemInfoFlex>
        </ItemFlex>
      </Flex>
    </StyledCard>
  );
};
