import { useTranslation } from 'contexts/Localization';
import React from 'react';
import { Box, Text } from 'uikit';
import { CardStyle } from './styled';

const GrowRule = () => {
  const { t } = useTranslation();
  return (
    <CardStyle mt='12px' width='380px' height='575px' padding='20px 25px'>
      <Text fontStyle='normal' mark bold>
        {t('Cultivation Rule')}
      </Text>
      <Box mt='22px'>
        <Text small>{t('CultivationRuleDesc1')}</Text>
        <Text mt='15px' small>
          {t('CultivationRuleDesc2')}
          <span style={{ color: '#EC3838' }}>
            {t('CultivationRuleDesc2-1')}
          </span>
        </Text>
        <Text mt='15px' small>
          {t('CultivationRuleDesc3')}
          <span style={{ color: '#EC3838' }}>
            {t('CultivationRuleDesc3-1')}
          </span>
        </Text>
        <Text mt='15px' small>
          {t('CultivationRuleDesc4')}
        </Text>
      </Box>
    </CardStyle>
  );
};

export default GrowRule;
