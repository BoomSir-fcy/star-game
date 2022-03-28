import React from 'react';
import styled, { css } from 'styled-components';
import { Box, Flex, BgCard, Card, Button, Text } from 'uikit';
import { StarGrid } from 'components';

import { GameThing, GameInfo } from './components';

const CardTab = styled(Card)`
  width: 227px;
  padding: 6px;
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  background-image: linear-gradient(
    45deg,
    rgba(31, 34, 40, 0.5) 25%,
    transparent 25%,
    transparent 50%,
    rgba(31, 34, 40, 0.5) 50%,
    rgba(31, 34, 40, 0.5) 75%,
    transparent 75%,
    transparent
  );
  background-size: 10px 10px;
`;

const TabsButton = styled(Button)<{ active?: boolean }>`
  width: 213px;
  height: 50px;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  line-height: 20px;
  ${({ active }) =>
    active &&
    css`
      background: url(/images/commons/btn/B4.png) no-repeat;
    `}
`;

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
  });

  console.log(state.box);

  return (
    <Box>
      <Flex justifyContent='space-between'>
        <StarGrid
          data={state.box}
          onLayoutChange={() => {}}
          items={9}
          cols={3}
        />
        <GameInfo />
      </Flex>

      <BgCard variant='long' mt='12px' padding='40px'>
        <Flex>
          <Flex flexDirection='column'>
            <CardTab>
              {(state.tabs ?? []).map(row => (
                <TabsButton
                  key={row.index}
                  onClick={() => setState({ ...state, currentTab: row.index })}
                  active={row.index === state.currentTab}
                  variant='text'
                >
                  {row.title}
                </TabsButton>
              ))}
            </CardTab>
            <Text mt='13px' small>
              拖动建筑到需要的格子上
            </Text>
          </Flex>
          <Box ml='40px'>
            <GameThing scale='sm' text='防空塔' />
          </Box>
        </Flex>
      </BgCard>
    </Box>
  );
};

export default Upgrade;
