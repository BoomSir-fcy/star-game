import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { Flex, Box, GraphicsCard, MarkText, Text } from 'uikit';
import styled from 'styled-components';
import { useTranslation } from 'contexts/Localization';

const BgBox = styled(GraphicsCard)`
  width: 600px;
  height: 243px;
  padding: 16px 30px;
  overflow-y: auto;
`;

const SmText = styled(Text)`
  font-size: 14px;
  line-height: 30px;
`;

const ExploreIntroduction: React.FC = () => {
  const { t, getHTML } = useTranslation();

  return (
    <BgBox stripe>
      <Text mb='20px' fontSize='18px'>
        {t('Commander')}
      </Text>
      <SmText mb='16px'>{t('ExploreDesc1')}</SmText>
      <SmText>{t('ExploreDesc2')}</SmText>
      <SmText>{t('ExploreDesc3')}</SmText>
    </BgBox>
  );
};

export default ExploreIntroduction;
