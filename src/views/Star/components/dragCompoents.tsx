import React from 'react';
import styled, { css } from 'styled-components';
import { Box, Flex, BgCard, Card, Button, Text } from 'uikit';

import { GameInfo, GameThing } from './gameModel';

const Container = styled(Flex)`
  position: relative;
  width: 476px;
  height: 476px;
  border-right: 1px solid #fff;
  border-bottom: 1px solid #fff;
`;

const Normal = styled(Flex)<{ row: number }>`
  cursor: pointer;
  position: absolute;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #ffffff;
  font-size: 40px;
  text-shadow: 1px 1px 5px #41b7ff, -1px -1px 5px #41b7ff;
  width: ${({ row }) => row * 158}px;
  height: ${({ row }) => row * 158}px;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  transition: all 0.5s;
  &:nth-child(1) {
    top: 0;
    left: 0;
  }

  &:nth-child(2) {
    top: 0;
    left: 158px;
  }

  &:nth-child(3) {
    top: 0;
    left: 316px;
  }

  &:nth-child(4) {
    top: 158px;
    left: 0;
  }

  &:nth-child(5) {
    top: 158px;
    left: 158px;
  }

  &:nth-child(6) {
    top: 158px;
    left: 316px;
  }

  &:nth-child(7) {
    top: 316px;
    left: 0;
  }

  &:nth-child(8) {
    top: 316px;
    left: 158px;
  }

  &:nth-child(9) {
    top: 316px;
    left: 316px;
  }
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

const target = {} as any;
let dragged = {} as any;

export const DragCompoents: React.FC<{
  itemData: any;
  rowCells: number;
  colCells: number;
}> = ({ itemData }) => {
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
    data: [],
  });
  const { data } = state;
  const dragBox = React.useRef<HTMLDivElement>(null);

  // 计算格子
  React.useEffect(() => {
    const items = itemData.filter((item: any) => item.row === 2);
    let newData: any = [];
    if (items.length > 0) {
      newData = itemData.slice(
        0,
        itemData.length - (items.length * items.length + items.length + 1),
      );
      setState({ ...state, data: newData });
    } else {
      setState({ ...state, data: itemData });
    }
  }, []);

  React.useEffect(() => {
    if (data.length > 0) {
      console.log(data);
      getPosition();
    }
  }, [data]);

  // 计算两个元素的距离
  const distance = (dom: HTMLDivElement, beforeDom: HTMLDivElement) => {
    const diffLeft = dom?.offsetLeft - beforeDom?.offsetLeft;
    const diffTop = dom?.offsetTop - beforeDom?.offsetTop;
    return Math.sqrt(diffLeft * diffLeft + diffTop * diffTop);
  };

  // 计算所有格子的距离
  const getPosition = () => {
    if (dragBox?.current) {
      const doms: any = dragBox?.current.children;

      // for (let i = 0; i < doms.length; i++) {
      //   console.log(doms[i].dataset?.row);
      // }
      const rowIndex = data.findIndex((item: any) => item.row === 2);
      const boxWidth = doms[rowIndex]?.offsetWidth;
      const screenWidth = dragBox?.current?.offsetWidth;
      const diffString = String(screenWidth / boxWidth);
      const cols = parseInt(diffString);
      const heightArr = [];
      let boxHeight = 0;
      let minBoxHeight = 0;
      let minBoxIndex = 0;

      console.log(rowIndex, cols);
      for (let i = 0; i < doms.length; i++) {
        boxHeight = doms[i].offsetHeight;
        if (i < cols) {
          heightArr.push(boxHeight);
          doms[i].style = '';
        } else {
          minBoxHeight = Math.min(...heightArr);
          minBoxIndex = getMinBoxIndex(heightArr, minBoxHeight);

          doms[i].style.left = `${minBoxIndex * boxWidth}px`;
          doms[i].style.top = `${minBoxHeight}px`;
          heightArr[minBoxIndex] += boxHeight;
        }

        console.log(heightArr, minBoxIndex, boxHeight);
      }
    }
  };

  const getMinBoxIndex = (arr: any, value: any) => {
    return arr.findIndex((item: any) => item === value) || 0;
  };

  const handleData = (afterTarget: any) => {
    dragged.style.opacity = '1';
    dragged.style.transform = 'scale(1)';
    const from = dragged?.dataset?.id;
    const to = afterTarget?.dataset?.id;

    if (from !== to) {
      const listData = data;
      // listData.splice(to, 0, listData.splice(from, 1)[0]);
      [listData[from], listData[to]] = [listData[to], listData[from]];
      setState({
        ...state,
        data: listData,
      });
    }
  };

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('目标元素：', e.target);
    dragged = e.target;
  };

  const dragEnd = () => {
    dragged.style.opacity = '1';
  };

  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragged.style.opacity = '1';
  };

  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragEnter = (event: any) => {
    event.preventDefault();
    if (event.target.tagName !== 'DIV') {
      return;
    }
    handleData(event.target);
  };

  return (
    <Box>
      <Flex justifyContent='space-between'>
        <Container ref={dragBox}>
          {state.data.map((item: any, index: number) => {
            return (
              <Normal
                key={`${item?.index}`}
                row={item?.row}
                draggable
                data-id={index}
                data-row={item?.row}
                onDragStart={dragStart}
                onDragEnter={dragEnter}
                onDragOver={dragOver}
                onDrop={drop}
                onDragEnd={dragEnd}
                data-item={JSON.stringify(item)}
              >
                <img src={item?.icon} alt='' />
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
          <Flex ml='40px'>
            <GameThing
              onDragStart={event => {
                console.log(event.target);
              }}
              onDrop={event => {
                event.preventDefault();
              }}
              onDragOver={dragOver}
              onDragEnter={dragEnter}
              scale='sm'
              text='防空塔'
            />
            <GameThing
              onDragStart={event => {
                console.log(event.target);
              }}
              onDrop={event => {
                event.preventDefault();
              }}
              onDragOver={dragOver}
              onDragEnter={dragEnter}
              scale='sm'
              text='矿石建筑'
            />
          </Flex>
        </Flex>
      </BgCard>
    </Box>
  );
};
