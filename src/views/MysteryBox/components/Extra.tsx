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
      <Text mb='10px'>Extra</Text>
      <ExtraLabelStyled>
        <LabelText>{t('Defense bonus')}：</LabelText>
        <AttrText>
          {t('All building defenses')} +{info?.defense}
        </AttrText>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='13px'>
        <LabelText>{t('Attack bonus')}：</LabelText>
        <AttrText>
          {t('Attack building damage')} +{info?.attack}
        </AttrText>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='13px'>
        <LabelText>{t('HP bonus')}：</LabelText>
        <AttrText>
          {t('All buildings HP')} +{info?.hp}
        </AttrText>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='13px'>
        <LabelText>{t('Capacity bonus')}：</LabelText>
        <AttrText>
          {t('All throughput speeds')} +{info?.product}
        </AttrText>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='13px'>
        <LabelText>{t('The cost of building')}：</LabelText>
        <AttrText>
          {t('All building construction costs')} +{info?.build}
        </AttrText>
      </ExtraLabelStyled>
      {children}
    </Box>
  );
};

export default Extra;
