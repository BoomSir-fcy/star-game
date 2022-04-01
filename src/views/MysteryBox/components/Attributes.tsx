import React, { useCallback, useMemo } from 'react';
import { Box, Text, Flex, BoxProps } from 'uikit';
import { QualityColor } from 'uikit/theme/colors';
import { LabelStyled, LabelText, AttrText } from './styled';
import { Info } from '../type';

interface AttributesProps extends BoxProps {
  info: Info;
}
const Attributes: React.FC<AttributesProps> = ({
  info,
  children,
  ...props
}) => {
  return (
    <Box {...props}>
      <Text mb='10px'>Attributes</Text>
      <Flex>
        <LabelStyled>
          <LabelText>格子:</LabelText>
          <AttrText>
            {info?.areaX ? `${info?.areaX}x${info?.areaY}` : ''}
          </AttrText>
        </LabelStyled>
        <LabelStyled ml='15px'>
          <LabelText>等级:</LabelText>
          <AttrText>{info?.level}级</AttrText>
        </LabelStyled>
        <LabelStyled ml='15px'>
          <LabelText>稀有度:</LabelText>
          {/* TODO: 翻译待完成 */}
          <AttrText color={QualityColor[info.rarity]}>
            {QualityColor[info.rarity]}
          </AttrText>
        </LabelStyled>
      </Flex>
      <Flex mt='13px'>
        <LabelStyled>
          <LabelText>掠夺速度:</LabelText>
          <AttrText>{info?.plunder_speed}</AttrText>
        </LabelStyled>
        <LabelStyled ml='15px'>
          <LabelText>矿石:</LabelText>
          <AttrText>{info?.stone}</AttrText>
        </LabelStyled>
        <LabelStyled ml='15px'>
          <LabelText>人口:</LabelText>
          <AttrText>{info?.population}</AttrText>
        </LabelStyled>
      </Flex>
      <Flex mt='13px'>
        <LabelStyled>
          <LabelText>能量:</LabelText>
          <AttrText>{info?.energy}</AttrText>
        </LabelStyled>
        <LabelStyled ml='15px'>
          <LabelText>建筑数:</LabelText>
          <AttrText>{info?.build_count}</AttrText>
        </LabelStyled>
      </Flex>
      {children}
    </Box>
  );
};

export default Attributes;
