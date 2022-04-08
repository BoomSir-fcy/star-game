import React from 'react';
import styled, { css } from 'styled-components';
import { useDispatch } from 'react-redux';
import { Box, Flex, BgCard, Card, Button, Text } from 'uikit';
import { useStore } from 'state';
import { Api } from 'apis';
import { useToast } from 'contexts/ToastsContext';

import { GameInfo, GameThing, Building } from './gameModel';

interface DragCompoentsProps {
  boards: any[];
  row: number;
  col: number;
}

const Board = styled(Box)<{ hasObj: boolean; pre: boolean }>`
  position: absolute;
  color: #ffffff;
  text-shadow: 1px 1px 5px #41b7ff, -1px -1px 5px #41b7ff;
  border: 1px solid #fff;
  background: ${({ hasObj, pre }) =>
    hasObj ? '#41b7ff' : pre ? 'pink' : 'transparent'};
`;

const BuildDom = styled(Box)`
  position: absolute;
  text-shadow: 1px 1px 5px #41b7ff, -1px -1px 5px #41b7ff;
  border: 1px solid #fff;
  background: red;
  z-index: 10;
`;

const WIDTH = 500;
const HEIGHT = 500;

const Container = styled(Flex)`
  position: relative;
  border: 1px solid #fff;
  /* border-right: 1px solid #fff;
  border-bottom: 1px solid #fff; */
`;

const Normal = styled(Flex)<{
  gridSize: number;
  rows: number;
  cols: number;
  row: number;
  col: number;
}>`
  cursor: pointer;
  position: absolute;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #ffffff;
  font-size: 40px;
  text-shadow: 1px 1px 5px #41b7ff, -1px -1px 5px #41b7ff;
  width: ${({ gridSize, rows, row }) => row * (gridSize / rows)}px;
  height: ${({ gridSize, cols, col }) => col * (gridSize / cols)}px;
  border: 1px solid #fff;
  /* border-top: 1px solid #fff;
  border-left: 1px solid #fff; */
  transition: all 0.5s;
  img {
    max-width: 100%;
    object-fit: cover;
    height: auto;
    vertical-align: middle;
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

const config = {
  row: 4, // X
  col: 4, // Y
};

const configBoards = (() => {
  const board = [];
  let index = 0;
  for (let i = 0; i < config.row; i++) {
    for (let j = 0; j < config.col; j++) {
      board.push({
        x: i,
        y: j,
        hasObj: j === 2,
        pre: false,
        index,
      });
      index++;
    }
  }
  return board;
})();

let dragged = {} as any;
export const DragCompoents: React.FC<{
  planet_id: number;
  itemData: any;
  rows: number;
  cols: number;
  gridSize: number;
  boards: any[];
}> = ({ planet_id, itemData, cols, rows, gridSize }) => {
  const [boards, setBoards] = React.useState(configBoards);

  const [builds, setBuilds] = React.useState<any[]>([]);

  const { width, height } = React.useMemo(() => {
    return {
      width: WIDTH / rows,
      height: HEIGHT / cols,
    };
  }, [rows, cols]);

  const dispatch = useDispatch();
  const { toastSuccess, toastError } = useToast();
  const [state, setState] = React.useState({
    currentTab: 1,
    currentBuilding: '',
    tabs: [
      {
        index: 1,
        title: '经营类',
      },
      // {
      //   index: 2,
      //   title: '战斗类',
      // },
    ],
    data: [],
  });
  const { data } = state;

  const buildings = useStore(p => p.buildling.buildings);
  const dragBox = React.useRef<HTMLDivElement>(null);

  // 计算格子
  React.useEffect(() => {
    setState({ ...state, data: itemData });
  }, [itemData]);

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

  // 计算绝对坐标
  const getAbsolutePosition = (index: number) => {
    const row = Math.floor(index / cols);
    const col = Math.floor(index % rows);
    // 计算相邻的格子坐标
    const bottomRow = row + 1;
    const bottomCol = col;
    // 当前格子右边坐标
    const rightRow = row;
    const rightCol = col + 1;

    if (bottomRow > rows - 1 || rightCol > cols - 1) {
      console.log('已经没有格子了');
      return [];
    }
    // 斜角点坐标
    const bottomRightRow = bottomRow - row + (rightRow - row) + row;
    const bottomRightCol = bottomCol - col + (rightCol - col) + col;
    const bevelIndex = bottomRightRow * rows + bottomRightCol;

    return [Number(index), Number(index) + 1, bevelIndex - 1, bevelIndex];
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

        doms[i].style.top = `${row * (gridSize / rows)}px`;
        doms[i].style.left = `${col * (gridSize / cols)}px`;
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

  // 获取坐标点
  const getMatrix = (index: number, currentSize = 1) => {
    const row = Math.floor(index / cols);
    const col = Math.floor(index % rows);

    return [
      [{ x: col }, { y: row + currentSize }],
      [{ x: col + currentSize }, { y: row }],
    ];
  };

  const handleData = React.useCallback(
    (afterTarget: any) => {
      dragged.style.opacity = '1';
      dragged.style.transform = 'scale(1)';
      const listData: any = data;
      const from = dragged?.dataset?.id;
      const to = afterTarget?.dataset?.id;
      // const draggedItem = JSON.parse(dragged?.dataset?.item) || {};
      // const targetItem = JSON.parse(afterTarget?.dataset?.item) || {};

      // 获取当前点的正方形下标
      const currentSize = getAbsolutePosition(to);
      if (currentSize.length <= 0) {
        toastError('当前建筑不能放置');
        return;
      }

      const canSave = currentSize.every(item => !boards[item].hasObj);
      console.log(canSave);
      // if (!canSave) {
      //   return;
      // }
      setBoards(prev => {
        const next = prev.map(item => {
          if (!canSave) {
            return {
              ...item,
              pre: false,
            };
          }
          if (currentSize.includes(item.index)) {
            return {
              ...item,
              pre: true,
            };
          }
          return {
            ...item,
            pre: false,
          };
        });
        return next;
      });
      console.log(currentSize);
      if (afterTarget) return;
      // 目标格子为空时，拖拽到目标格子
      if (from === undefined || from === null) {
        // console.log(draggedItem);
        // listData.splice(to, 1, {
        //   ...targetItem,
        //   ...draggedItem,
        //   row: draggedItem?.propterty?.size?.area_x,
        //   isbuilding: true,
        // });
      }

      // 创建格子到九宫格中(to, draggedItem);
      // createGrid(to, draggedItem);
      setState({
        ...state,
        data: listData,
      });
    },
    [data, boards],
  );

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    dragged = e.target;
  };

  const dragEnd = () => {
    dragged.style.opacity = '1';
  };

  const drop = (event: any) => {
    event.preventDefault();
    dragged.style.opacity = '1';
    if (event.target.tagName !== 'DIV') {
      return;
    }
    // handleData(event.target);
    for (let i = boards.length - 1; i >= 0; i--) {
      if (boards[i].pre) {
        setBuilds((prev: any) => {
          return [
            ...prev,
            {
              data: {
                area_x: 2,
                area_y: 2,
                id: 1,
              },
              x: boards[i].x,
              y: boards[i].y,
            },
          ];
        });
        return;
      }
    }
    boards.forEach(item => {});
  };

  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragEnter = (event: any) => {
    event.preventDefault();
    console.log(event.target);
    handleData(event.target);
  };

  // 创建格子到九宫格中
  const createGrid = async (index: number, row: Api.Building.Building) => {
    const [from, to] = getMatrix(index, row?.propterty?.size?.area_x);

    try {
      const res = await Api.BuildingApi.createBuilding({
        planet_id,
        build_type: row.type,
        building_setting: [
          {
            buildings_id: row.buildings_number,
            position: {
              from: { x: from[0].x, y: from[1].y },
              to: { x: to[0].x, y: to[1].y },
            },
            index: Number(index),
          },
        ],
      });
      if (Api.isSuccess(res)) {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Box position='relative' width={WIDTH} height={HEIGHT}>
        {boards.map((item, index) => {
          return (
            <Board
              key={`${item.x}, ${item.y}`}
              data-id={index}
              top={item.x * width}
              left={item.y * height}
              width={width}
              height={height}
              hasObj={item.hasObj}
              pre={item.pre}
              onDragStart={dragStart}
              onDragEnter={dragEnter}
              onDragOver={dragOver}
              onDrop={drop}
              onDragEnd={dragEnd}
              draggable
            />
          );
        })}
        {builds.map(item => {
          return (
            <BuildDom
              key={item.data.id}
              width={item.data.area_x * width}
              height={item.data.area_y * height}
              top={item.x * width}
              left={item.y * height}
            />
          );
        })}
      </Box>
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
            {(buildings[state?.currentTab] ?? []).map((row: any) => (
              <BuildingsItem key={row.buildings_number}>
                <GameThing
                  draggable
                  onDragStart={dragStart}
                  onDrop={event => event.preventDefault()}
                  onDragEnter={event => event.preventDefault()}
                  onDragOver={dragOver}
                  scale='sm'
                  itemData={row}
                  src={row.picture}
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
