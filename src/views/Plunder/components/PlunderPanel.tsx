import React from 'react';
import styled from 'styled-components';
import {
  Box,
  Card,
  Text,
  Flex,
  BorderCard,
  BoxProps,
  Fringe,
  Image,
} from 'uikit';

const BoxStyled = styled(Box)`
  margin: 0 30px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  border: ${({ theme }) => `4px solid ${theme.colors.lightBorder}`};
  box-shadow: ${({ theme }) => theme.shadows.highlight};
  flex: 1;
`;
const CardStyled = styled(Card)`
  width: 330px;
  padding: 7px;
  margin-left: 10px;
  box-shadow: unset;
  border-radius: 0;
  border: 1px solid #373c45;
`;
const PanelText = styled(Text).attrs({ small: true })`
  white-space: nowrap;
`;
const PlunderPanel: React.FC<BoxProps> = ({ ...props }) => {
  return (
    <BoxStyled>
      <Fringe mt='-19px' zIndex={1} />
      <BorderCard mt='31px' padding='0 10px 10px 10px'>
        <Text textAlign='center' shadow='primary' fontSize='24px' bold>
          掠夺信息面板
        </Text>
        <Flex>
          <Flex flexDirection='column' flex={1} pl='20px' mt='10px'>
            <Flex>
              <PanelText color='blueSide'>蓝色方&nbsp;</PanelText>
              <PanelText>发起进攻，对&nbsp;</PanelText>
              <PanelText color='redSide'>红色方&nbsp;</PanelText>
              <PanelText>坐标X2:Y2坐标建筑造成&nbsp;</PanelText>
              <PanelText color='hp'>100HP&nbsp;</PanelText>
              <PanelText>伤害。</PanelText>
            </Flex>
            <Text small>红色剩余总 HP 500</Text>
          </Flex>
          <CardStyled>
            <Flex>
              <Image src='/assets/map/map6.png' width={80} height={100} />
              <Flex flexDirection='column' ml='14px'>
                <Text small>岩浆方格</Text>
                <Text mt='14px' small>
                  火焰伤害，每回合持续减少 10HP，持续 3 回合
                </Text>
              </Flex>
            </Flex>
          </CardStyled>
        </Flex>
      </BorderCard>
    </BoxStyled>
  );
};

export default PlunderPanel;
