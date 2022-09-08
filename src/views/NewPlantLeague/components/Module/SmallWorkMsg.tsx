import React, { useState, useCallback } from 'react';
import { Button, Flex, Box, BgCard, MarkText, Text, GraphicsCard } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MsgList from 'views/ExploreProgress/components/MsgList';
import { useFetchExploreProgressView } from 'state/alliance/hooks';

const OutBox = styled(Box)`
  width: 682px;
  height: max-content;
  border: 1px solid #fff;
`;

const SmallWorkMsg: React.FC<{
  ShowMsgModule: boolean;
}> = ({ ShowMsgModule }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useFetchExploreProgressView();

  return (
    <Box
      display={ShowMsgModule ? 'block' : 'none'}
      className='Exploration_Difficulty'
      zIndex={1}
      position='absolute'
      left={0}
      bottom={-20}
      style={{ cursor: 'pointer' }}
      onClick={() => {
        navigate('/explore-progress');
      }}
    >
      <OutBox>
        <MsgList concise />
      </OutBox>
    </Box>
  );
};

export default SmallWorkMsg;
