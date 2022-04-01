import React, { useCallback, useMemo } from 'react';
// import { Rarity, RarityText } from 'state/planet/type';
import { Box, Text, Flex, BoxProps } from 'uikit';
import { LabelStyled, LabelText, AttrText } from './styled';

interface AttributesProps extends BoxProps {
  info: any;
}
const Attributes: React.FC<AttributesProps> = ({
  info,
  children,
  ...props
}) => {
  const getRarity = useCallback((value: number) => {
    let text = '';
    switch (value) {
      case 1:
        text = 'ordinary'; // 普通
        break;
      case 2:
        text = 'good'; // 良好
        break;
      case 3:
        text = 'rare'; // 稀有
        break;
      case 4:
        text = 'epic'; // 史诗
        break;
      case 5:
        text = 'legend'; // 传说
        break;
      case 6:
        text = 'mythology'; // 神话
        break;
      default:
        text = '';
        break;
    }
    return text;
  }, []);
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
          <AttrText color={getRarity(info?.rarity)}>
            {getRarity(info?.rarity)}
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
