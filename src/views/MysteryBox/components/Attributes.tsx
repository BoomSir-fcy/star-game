import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'contexts/Localization';
import { Box, Text, Flex, BoxProps } from 'uikit';
import { QualityColor } from 'uikit/theme/colors';
import { Qualities } from 'uikit/theme/types';
import { LabelStyled, LabelText, AttrText } from './styled';

interface AttributesProps extends BoxProps {
  info: any;
}
const Attributes: React.FC<AttributesProps> = ({
  info,
  children,
  ...props
}) => {
  const { t } = useTranslation();

  const rarity = useMemo(() => {
    return info?.rarity as Qualities;
  }, [info]);

  return (
    <Box {...props}>
      <Text mb='10px'>Attributes</Text>
      <Flex>
        <LabelStyled>
          <LabelText>{t('Lattice')}:</LabelText>
          <AttrText>
            {info?.areaX ? `${info?.areaX}x${info?.areaY}` : ''}
          </AttrText>
        </LabelStyled>
        <LabelStyled ml='15px'>
          <LabelText>{t('Grade')}:</LabelText>
          <AttrText>
            {info?.level}
            {t('Level')}
          </AttrText>
        </LabelStyled>
        <LabelStyled ml='15px'>
          <LabelText>{t('Rarity')}:</LabelText>
          <AttrText color={QualityColor[rarity]}>
            {rarity ? t(`rarity-${rarity}`) : ''}
          </AttrText>
        </LabelStyled>
      </Flex>
      <Flex mt='13px'>
        <LabelStyled>
          <LabelText>{t('Plunder speed')}:</LabelText>
          <AttrText>{info?.plunder_speed}</AttrText>
        </LabelStyled>
        <LabelStyled ml='15px'>
          <LabelText>{t('Ore')}:</LabelText>
          <AttrText>{info?.stone}</AttrText>
        </LabelStyled>
        <LabelStyled ml='15px'>
          <LabelText>{t('Population')}:</LabelText>
          <AttrText>{info?.population}</AttrText>
        </LabelStyled>
      </Flex>
      <Flex mt='13px'>
        <LabelStyled>
          <LabelText>{t('Energy')}:</LabelText>
          <AttrText>{info?.energy}</AttrText>
        </LabelStyled>
        <LabelStyled ml='15px'>
          <LabelText>{t('Buildings')}:</LabelText>
          <AttrText>{info?.build_count}</AttrText>
        </LabelStyled>
      </Flex>
      {children}
    </Box>
  );
};

export default Attributes;
