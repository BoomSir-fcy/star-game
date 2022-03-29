import React from 'react';
import styled, { css } from 'styled-components';
import { Box, Flex, BgCard, Card, Button, Text } from 'uikit';

import { GameInfo, GameThing } from './gameModel';

const Container = styled(Flex)`
  width: 476px;
  height: 476px;
  justify-content: center;
  align-self: auto;
  flex-wrap: wrap;
  border: 1px solid #373c45;
`;

const Normal = styled(Flex)<{ row: number }>`
  justify-content: center;
  align-items: center;
  width: ${({ row }) => row * 158}px;
  height: ${({ row }) => row * 158}px;
  border: 1px solid #373c45;
  transition: all 0.5s;
`;

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
      background: url(/images/commons/btn/blue-round.png) no-repeat;
    `}
`;

export const DragCompoents = () => {
  const [state, setState] = React.useState({
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
    target: {} as any,
    dragged: {} as any,
  });

  const { data } = state;

  const handleData = React.useCallback(
    (target: any) => {
      // state.dragged.style.opacity = '1';
      // state.dragged.style.transform = 'scale(1)';
      const from = state.dragged?.dataset?.id;
      const to = target?.dataset?.id;
      const listData = data;

      console.log(state.dragged, from, to);
      if (from !== to) {
        listData.splice(to, 0, listData.splice(from, 1)[0]);
        setState({
          ...state,
          target,
          data: listData,
          dragged: target,
        });
      }
    },
    [state, data],
  );

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('目标元素：', e.target);

    setState({
      ...state,
      dragged: e.target,
    });
  };

  const dragEnd = () => {
    state.dragged.style.opacity = '1';
    state.dragged.style.transform = 'scale(1)';
  };

  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    state.dragged.style.opacity = '1';
    state.dragged.style.transform = 'scale(1)';
  };

  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const dragEnter = (event: any) => {
    event.preventDefault();
    const targetBox = event.target;
    console.log('结束', state.target, targetBox);
    // targetBox.style.opacity = '0.6';
    // targetBox.style.transform = 'scale(1.1)';
    handleData(targetBox);
  };

  return (
    <Box>
      <Flex justifyContent='space-between'>
        <Container>
          {state.data.map((item: any, index: number) => {
            return (
              <Normal
                key={`${item.index}`}
                row={item.row}
                style={{ background: item.bgColor }}
                draggable
                onDragStart={dragStart}
                onDragEnd={dragEnd}
                onDragEnter={dragEnter}
                onDragOver={dragOver}
                onDrop={drop}
                data-item={JSON.stringify(item)}
              >
                {item.index}
              </Normal>
            );
          })}
        </Container>
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
            <GameThing
              onDragStart={event => {
                console.log(event.target);
                setState({
                  ...state,
                  dragged: event.target,
                });
              }}
              onDrop={event => {
                event.preventDefault();
              }}
              onDragOver={dragOver}
              onDragEnter={dragEnter}
              scale='sm'
              text='防空塔'
            />
          </Box>
        </Flex>
      </BgCard>
    </Box>
  );
};
