import React from 'react';
import styled, { css } from 'styled-components';
import { Box, Flex, BgCard, Card, Button, Text } from 'uikit';

import { DragCompoents } from './components/dragCompoents';

const Upgrade = () => {
  const [state, setState] = React.useState({
    box: [
      {
        index: 1,
        row: 2,
        bgColor: 'red',
      },
      {
        index: 2,
        row: 1,
        bgColor: 'green',
      },
      {
        index: 3,
        row: 1,
        bgColor: 'blue',
      },
      {
        index: 4,
        row: 1,
        bgColor: 'yellow',
      },
      {
        index: 5,
        row: 1,
        bgColor: 'orange',
      },
      {
        index: 6,
        row: 1,
        bgColor: 'grey',
      },
    ],
    currentTab: 1,
    tabs: [
      {
        index: 1,
        title: '经营类',
      },
      {
        index: 2,
        title: '战斗类',
      },
    ],
    data: [
      {
        index: 1,
        row: 1,
        icon: '/images/model/combat_01.png',
      },
      {
        index: 2,
        row: 1,
        icon: '/images/model/combat_01.png',
      },
      {
        index: 3,
        row: 2,
        icon: '/images/model/edifice_01.png',
      },
      {
        index: 4,
        row: 1,
      },
      {
        index: 5,
        row: 1,
        icon: '/images/model/combat_01.png',
      },
      {
        index: 6,
        row: 1,
      },
      {
        index: 7,
        row: 1,
      },
      {
        index: 8,
        row: 1,
      },
      {
        index: 9,
        row: 1,
      },
    ],
  });

  return (
    <Box>
      <DragCompoents rowCells={3} colCells={3} itemData={state.data} />
    </Box>
  );
};

export default Upgrade;
