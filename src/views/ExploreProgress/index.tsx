import React, { Fragment, useCallback, useState } from 'react';
import {
  RefreshButton,
  Flex,
  Box,
  BackButton,
  MarkText,
  Text,
  Empty,
  Button,
} from 'uikit';
import styled from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import useTheme from 'hooks/useTheme';
import { shortenAddress } from 'utils';
import { formatDisplayApr } from 'utils/formatBalance';
import { raceData } from 'config/buildConfig';
import { getSpriteName, getSpriteRes } from 'game/core/utils';
import { EasyformatTime } from 'utils/timeFormat';
import { useNavigate } from 'react-router-dom';
import ProgressContent from './components/ProgressContent';

const TitleBox = styled(Flex)`
  width: 512px;
  height: 52px;
  background: url('/images/battleReport/top.png') no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: center;
`;

const ContentBox = styled(Box)`
  height: calc(940px - 160px);
  width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.borderPrimary};
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  padding: 30px 50px;
`;

const ExploreProgress: React.FC = () => {
  const { t, getHTML } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <Box>
      <Flex padding='0 20px' mb='16px' alignItems='center' flex={1}>
        <Box mr='40px'>
          <BackButton />
        </Box>
        <TitleBox>
          <MarkText fontSize='18px' bold>
            {t('探索状态')}
          </MarkText>
        </TitleBox>
      </Flex>
      <ContentBox>
        <Flex>
          <ProgressContent />
        </Flex>
      </ContentBox>
    </Box>
  );
};

export default ExploreProgress;
