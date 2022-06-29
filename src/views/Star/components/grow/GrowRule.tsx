import { useTranslation } from 'contexts/Localization';
import React from 'react';
import { Box, Text } from 'uikit';
import { CardStyle } from './styled';

const GrowRule = () => {
  const { t } = useTranslation();
  return (
    <CardStyle mt='12px' width='380px' height='347px' padding='31px 25px'>
      <Text fontStyle='normal' mark bold>
        {t('Cultivation Rule')}
      </Text>
      <Box mt='22px'>
        <Text small>{t('CultivationRuleDesc1')}</Text>
        <Text mt='6px' small>
          {t('CultivationRuleDesc2')}
        </Text>
        <Text mt='6px' small>
          {t('CultivationRuleDesc3')}
        </Text>
        <Text mt='6px' small>
          {t('CultivationRuleDesc4')}
        </Text>
      </Box>
    </CardStyle>
  );
};

export default GrowRule;
