import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'contexts/Localization';
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
  const { t } = useTranslation();

  return (
    <Box mt='25px' className='mystery-detail-step1' {...props}>
      <Text fontSize='28px' mb='10px' bold>
        {t('Attributes')}
      </Text>
      <Flex mt='20px'>
        <LabelStyled>
          <Flex width='100%' justifyContent='space-between'>
            <Flex>
              <LabelText>{t('Grade')}: </LabelText>
              <AttrText>Lv{info?.level}</AttrText>
            </Flex>
            <LabelText>
              {t('MAX Lv')} {info?.max_level}
            </LabelText>
          </Flex>
        </LabelStyled>
        <LabelStyled ml='15px'>
          <LabelText>{t('Grid')}: </LabelText>
          <AttrText>
            {info?.areaX ? `${info?.areaX}x${info?.areaY}` : ''}
          </AttrText>
        </LabelStyled>
        <LabelStyled ml='15px'>
          <LabelText>{t('Building Count')}: </LabelText>
          <AttrText>{info?.build_count}</AttrText>
        </LabelStyled>
      </Flex>
      <Flex mt='11px'>
        <LabelStyled>
          <LabelText>{t('Population')}: </LabelText>
          <AttrText>{info?.population}</AttrText>
        </LabelStyled>
        <LabelStyled ml='15px'>
          <LabelText>{t('Ore')}: </LabelText>
          <AttrText>{info?.stone}</AttrText>
        </LabelStyled>
        <LabelStyled ml='15px'>
          <LabelText>{t('Energy')}: </LabelText>
          <AttrText>{info?.energy}</AttrText>
        </LabelStyled>
      </Flex>
    </Box>
  );
};

export default Attributes;
