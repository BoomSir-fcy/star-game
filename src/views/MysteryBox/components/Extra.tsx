import React from 'react';
import { Box, Text, Flex, BoxProps } from 'uikit';
import { ExtraLabelStyled, LabelText, AttrText } from './styled';

interface ExtraProps extends BoxProps {
  info: any;
}
const Extra: React.FC<ExtraProps> = ({ info, children, ...props }) => {
  return (
    <Box {...props}>
      <Text mb='10px'>Extra</Text>
      <ExtraLabelStyled>
        <LabelText>防御加成：</LabelText>
        <AttrText>所有建筑防御 +{info?.defense}</AttrText>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='13px'>
        <LabelText>攻击加成：</LabelText>
        <AttrText>攻击建筑伤害 +{info?.attack}</AttrText>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='13px'>
        <LabelText>HP加成：</LabelText>
        <AttrText>所有产能速度 +{info?.hp}</AttrText>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='13px'>
        <LabelText>产能加成：</LabelText>
        <AttrText>所有产能速度 +{info?.product}</AttrText>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='13px'>
        <LabelText>建筑成本：</LabelText>
        <AttrText>所有建筑修建费用 +{info?.build}</AttrText>
      </ExtraLabelStyled>
      {children}
    </Box>
  );
};

export default Extra;
