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
      <Box className='mystery-detail-step1'>
        <Text mb='10px'>{t('Attributes')}</Text>
        <Flex>
          <LabelStyled>
            <LabelText>{t('Rarity')}:</LabelText>
            <AttrText color={QualityColor[rarity]}>
              {rarity ? t(`rarity-${rarity}`) : ''}
            </AttrText>
          </LabelStyled>
          <LabelStyled ml='15px'>
            <LabelText>{t('Grade')}: </LabelText>
            <AttrText>
              Lv{info?.level}
              {/* {t('Level')} */}
            </AttrText>
          </LabelStyled>
          <LabelStyled ml='15px'>
            <LabelText>{t('Grid')}:</LabelText>
            <AttrText>
              {info?.areaX ? `${info?.areaX}x${info?.areaY}` : ''}
            </AttrText>
          </LabelStyled>
          <LabelStyled ml='15px'>
            <LabelText>{t('Building Count')}:</LabelText>
            <AttrText>{info?.build_count}</AttrText>
          </LabelStyled>
        </Flex>
        <Flex mt='11px'>
          <LabelStyled>
            <LabelText>{t('Population')}:</LabelText>
            <AttrText>{info?.population}</AttrText>
          </LabelStyled>
          <LabelStyled ml='15px'>
            <LabelText>{t('Ore')}: </LabelText>
            <AttrText>{info?.stone}</AttrText>
          </LabelStyled>
          <LabelStyled ml='15px'>
            <LabelText>{t('Energy')}:</LabelText>
            <AttrText>{info?.energy}</AttrText>
          </LabelStyled>
        </Flex>
      </Box>
      {children}
    </Box>
  );
};

export default Attributes;
