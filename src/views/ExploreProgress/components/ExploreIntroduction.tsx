import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { Flex, Box, GraphicsCard, MarkText, Text } from 'uikit';
import styled from 'styled-components';
import { useTranslation } from 'contexts/Localization';

const BgBox = styled(GraphicsCard)`
  width: 600px;
  height: 243px;
  padding: 16px 30px;
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
        {t('指挥官')}
      </Text>
      <SmText mb='16px'>
        {t(
          '这场探索将持续4小时，探索过程中，我们每个行星的资源工厂都会开始运作，他们会持续生产[矿石] [能量] [香料]等资源',
        )}
      </SmText>
      <SmText>
        {t(
          '90分钟后我们会进入探险的风险区，在这里会遭遇其他行星联盟的攻击，请提前做好战斗布阵。',
        )}
      </SmText>
      <SmText>
        {t('保持行星等级和建筑等级的提升，有助于在风险区能够存活下来。')}
      </SmText>
    </BgBox>
  );
};

export default ExploreIntroduction;
