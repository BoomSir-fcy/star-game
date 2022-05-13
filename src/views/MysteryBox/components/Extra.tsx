import { useTranslation } from 'contexts/Localization';
import React from 'react';
import { Box, Text, Flex, BoxProps } from 'uikit';
import { ExtraLabelStyled, LabelText, AttrText } from './styled';

interface ExtraProps extends BoxProps {
  info: any;
}
const Extra: React.FC<ExtraProps> = ({ info, children, ...props }) => {
  const { t } = useTranslation();
  return (
    <Box {...props}>
      <Text mb='10px'>{t('Extra')}</Text>
      <ExtraLabelStyled>
        <LabelText>{t('Defense Enhancement')}：</LabelText>
        <AttrText>
          {t('All building defenses')} +{info?.defense}
        </AttrText>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='13px'>
        <LabelText>{t('Attack Enhancement')}：</LabelText>
        <AttrText>
          {t('Attack building damage')} +{info?.attack}
        </AttrText>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='13px'>
        <LabelText>{t('HP Enhancement')}：</LabelText>
        <AttrText>
          {t('All buildings HP')} +{info?.hp}
        </AttrText>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='13px'>
        <LabelText>{t('Capacity Enhancement')}：</LabelText>
        <AttrText>
          {t("All capacities'speed")} +{info?.product}
        </AttrText>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='13px'>
        <LabelText>{t('Building Cost')}：</LabelText>
        <AttrText>
          {t('All building construction costs')} +{info?.build}
        </AttrText>
      </ExtraLabelStyled>
      {children}
    </Box>
  );
};

export default Extra;
