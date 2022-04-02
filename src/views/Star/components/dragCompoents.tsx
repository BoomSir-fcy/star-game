import React from 'react';
import styled, { css } from 'styled-components';
import { useDispatch } from 'react-redux';
import { Box, Flex, BgCard, Card, Button, Text } from 'uikit';
import { useStore } from 'state';

import { GameInfo, GameThing } from './gameModel';

const Container = styled(Flex)`
  position: relative;
  width: 476px;
  height: 476px;
  border: 1px solid #fff;
  /* border-right: 1px solid #fff;
  border-bottom: 1px solid #fff; */
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
  border: 1px solid #fff;
  /* border-top: 1px solid #fff;
  border-left: 1px solid #fff; */
  transition: all 0.5s;
  img {
    pointer-events: none;
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

const BuildingsScroll = styled(Flex)`
  max-width: 100%;
  overflow-x: auto;
  ::-webkit-scrollbar {
    width: 1px;
  }
`;

const BuildingsItem = styled(Box)`
  margin-right: 45px;
  &::last-child {
    margin-right: 0;
  }
`;

let dragged = {} as any;
export const DragCompoents: React.FC<{
  itemData: any;
  rows: number;
  cols: number;
}> = ({ itemData, cols, rows }) => {
  const dispatch = useDispatch();
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

  const selfBuildings = useStore(p => p.buildling.selfBuildings);
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
      getPosition();
    }
  }, [setState, state, data]);

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
      const index = data.findIndex((item: any) => item.row === 2);
      // 判断大方块在什么位置
      const bigGridRow = parseInt(String(index / cols + 1));
      const bigGridCol = parseInt(String((index % rows) + 1));
      for (let i = 0; i < doms.length; i++) {
        let row = parseInt(String(i / cols));
        let col = parseInt(String(i % rows));

        // console.log(row, col);
        // console.log(row, col, doms[i], doms[i].previousSibling?.offsetWidth);
        // const prevWidth = doms[i].previousSibling?.offsetWidth;
        // if (col === 2 && prevWidth === 316) {
        //   row += 1;
        //   col = 0;
        // }
        // console.log(doms[i].nextSibling);
        // console.log(doms[i].nextSibling?.offsetWidth);

        // if (i > index) {
        //   // 不换行
        //   if (row + 2 === bigGridRow) {
        //     row = col - 2;
        //     col = 2;
        //   } else if (col + 2 >= bigGridCol && row === 0) {
        //     row += 1;
        //     col = 0;
        //     // console.log(doms[i], row, col);
        //   } else if (bigGridRow === row && bigGridCol + 1 === col) {
        //     // console.log(doms[i], row, col);
        //     row += 1;
        //     col = 0;
        //   } else {
        //     row += 1;
        //   }
        // } else if (i === index) {
        //   row = row >= 2 ? row - 1 : row;
        //   col = col >= 2 ? col - 1 : col;
        // } else if (bigGridCol >= col + 2) {
        //   console.log(232, row, col, doms[i]);
        //   row = col;
        //   col = 0;
        // }

        if (index !== i && bigGridCol > 0 && bigGridRow > 0) {
          // 当超过最大列数时，换行
          if (bigGridRow === 2) {
            if (row === 1 && bigGridCol === 1) {
              row = col;
              col = bigGridRow;
            }
            if (row + bigGridRow === rows && bigGridCol === cols) {
              row = col + 1;
              col = 0;
            } else if (row + bigGridRow === rows && bigGridCol === col) {
              row += 1;
              col = 0;
            }
          } else if (row === 0 && col !== 0 && bigGridCol + col < cols) {
            row = col - 1 > 0 ? col - 1 : col;
            col = bigGridCol + col;
          } else if (row === 0 && bigGridCol + col > cols) {
            row = bigGridRow + row;
            col = 0;
          } else if (row === 1 && row + bigGridRow <= rows) {
            // 当前行+2X2格子不换行
            row = bigGridRow + row;
          }
        } else {
          col = bigGridCol + col > cols ? col - 1 : col;
        }

        doms[i].style.top = `${row * 158}px`;
        doms[i].style.left = `${col * 158}px`;
      }

      // const rowIndex = data.findIndex((item: any) => item.row === 2);
      // const diffArr: any = data.slice(rowIndex + 1) ?? [];
      // if (rowIndex > -1) {
      //   for (let i = 0; i < diffArr.length; i++) {
      //     const row = parseInt(String(i / cols)) + 2;
      //     const col = parseInt(String(i % cols));
      //     const domIndex = diffArr[i]?.index - 1 || 0;

      //     doms[domIndex].style.left = `${col * 158}px`;
      //     doms[domIndex].style.top = `${row * 158}px`;
      //   }
      // }

      // const boxWidth = doms[rowIndex]?.offsetWidth;
      // const screenWidth = dragBox?.current?.offsetWidth;
      // const diffString = String(screenWidth / boxWidth);
      // const cols = parseInt(diffString);
      // const heightArr = [];
      // let boxHeight = 0;
      // let minBoxHeight = 0;
      // let minBoxIndex = 0;

      // console.log(rowIndex, cols);
      // for (let i = 0; i < doms.length; i++) {
      //   boxHeight = doms[i].offsetHeight;
      //   if (i < cols) {
      //     heightArr.push(boxHeight);
      //     doms[i].style = '';
      //   } else {
      //     minBoxHeight = Math.min(...heightArr);
      //     minBoxIndex = getMinBoxIndex(heightArr, minBoxHeight);

      //     doms[i].style.left = `${minBoxIndex * boxWidth}px`;
      //     doms[i].style.top = `${minBoxHeight}px`;
      //     heightArr[minBoxIndex] += boxHeight;
      //   }

      //   console.log(heightArr, minBoxIndex, boxHeight);
      // }
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
      listData.splice(to, 0, listData.splice(from, 1)[0]);
      // [listData[from], listData[to]] = [listData[to], listData[from]];
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
    console.log(event.target.tagName);
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
          <BuildingsScroll ml='40px'>
            {(selfBuildings[state?.currentTab] ?? []).map((row: any) => (
              <BuildingsItem key={row.buildings_number}>
                <GameThing
                  onDragStart={event => {
                    console.log(event.target);
                  }}
                  onDrop={event => {
                    event.preventDefault();
                  }}
                  onDragOver={dragOver}
                  onDragEnter={dragEnter}
                  src={row.picture}
                  scale='sm'
                  text={row?.propterty.name_cn}
                />
              </BuildingsItem>
            ))}
          </BuildingsScroll>
        </Flex>
      </BgCard>
    </Box>
  );
};
