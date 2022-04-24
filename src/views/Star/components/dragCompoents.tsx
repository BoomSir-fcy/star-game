import React from 'react';
import styled, { css } from 'styled-components';
import { useDispatch } from 'react-redux';
import { Box, Flex, BgCard, Card, Button, Text } from 'uikit';
import { useStore, storeAction } from 'state';
import { Api } from 'apis';

import { useToast } from 'contexts/ToastsContext';
import { useTranslation } from 'contexts/Localization';
import { fetchPlanetBuildingsAsync } from 'state/buildling/fetchers';

import { GameInfo, GameThing, Building } from './gameModel';

const Container = styled(Flex)`
  position: relative;
  border: 1px solid #fff;
`;

const Normal = styled(Flex)<{ pre: boolean }>`
  cursor: pointer;
  position: absolute;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #ffffff;
  font-size: 40px;
  text-shadow: 1px 1px 5px #41b7ff, -1px -1px 5px #41b7ff;
  border: 1px solid #fff;
  transition: all 0.5s;
  background: ${({ pre }) => (pre ? 'rgba(0,0,0,0.5)' : 'transparent')};
  img {
    max-width: 100%;
    object-fit: cover;
    height: auto;
    vertical-align: middle;
    pointer-events: none;
  }
`;

const BuildingBox = styled(Box)<{ checked: boolean }>`
  position: absolute;
  text-shadow: 1px 1px 5px #41b7ff, -1px -1px 5px #41b7ff;
  z-index: 10;
  cursor: pointer;
  ${({ checked }) =>
    checked &&
    css`
      border: 1px solid #000;
      box-shadow: 0px 0px 9px 0px #41b7ff, inset 0px 0px 9px 0px #41b7ff;
    `}
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

const ActionButton = styled(Button)`
  width: 170px;
  height: 44px;
  padding: 0;
  font-size: 20px;
  &:first-child {
    margin-bottom: 10px;
  }
`;

let dragged = {} as any;
export const DragCompoents: React.FC<{
  planet_id: number;
  itemData: any;
  rows: number;
  cols: number;
  gridSize: number;
}> = ({ planet_id, itemData, cols, rows, gridSize }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { toastSuccess, toastError } = useToast();
  const [state, setState] = React.useState({
    currentTab: 1,
    currentBuilding: '',
    tabs: [
      {
        index: 1,
        title: `${t('planetBuildingTypeBusinessClass')}`,
      },
      // {
      //   index: 2,
      //   title: `${t('planetBuildingTypeCombatClass')}`,
      // },
    ],
    data: [] as any,
  });
  const [builds, setBuilds] = React.useState<any[]>([]);
  const [currentBuild, setCurrentBuild] = React.useState<any>({});
  const { data } = state;
  const buildings = useStore(p => p.buildling.buildings);
  const dragBox = React.useRef<HTMLDivElement>(null);
  const { width, height } = React.useMemo(() => {
    return {
      width: gridSize / rows,
      height: gridSize / cols,
    };
  }, [rows, cols, gridSize]);

  // 计算格子
  React.useEffect(() => {
    const currBuilds = itemData?.filter((row: any) => row.isbuilding);
    const isactive = builds.filter((row: any) => row.isactive);
    setState({ ...state, data: itemData });
    setBuilds([...currBuilds, ...isactive]);
  }, [itemData, builds, state]);

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
  // const getPosition = () => {
  //   if (dragBox?.current) {
  //     const doms: any = dragBox?.current.children;
  //     const index = data.findIndex((item: any) => item.row === 2);
  //     // 判断大方块在什么位置
  //     const bigGridRow = parseInt(String(index / cols + 1));
  //     const bigGridCol = parseInt(String((index % rows) + 1));
  //     for (let i = 0; i < doms.length; i++) {
  //       let row = parseInt(String(i / cols));
  //       let col = parseInt(String(i % rows));

  //       // console.log(row, col);
  //       // console.log(row, col, doms[i], doms[i].previousSibling?.offsetWidth);
  //       // const prevWidth = doms[i].previousSibling?.offsetWidth;
  //       // if (col === 2 && prevWidth === 316) {
  //       //   row += 1;
  //       //   col = 0;
  //       // }
  //       // console.log(doms[i].nextSibling);
  //       // console.log(doms[i].nextSibling?.offsetWidth);

  //       // if (i > index) {
  //       //   // 不换行
  //       //   if (row + 2 === bigGridRow) {
  //       //     row = col - 2;
  //       //     col = 2;
  //       //   } else if (col + 2 >= bigGridCol && row === 0) {
  //       //     row += 1;
  //       //     col = 0;
  //       //     // console.log(doms[i], row, col);
  //       //   } else if (bigGridRow === row && bigGridCol + 1 === col) {
  //       //     // console.log(doms[i], row, col);
  //       //     row += 1;
  //       //     col = 0;
  //       //   } else {
  //       //     row += 1;
  //       //   }
  //       // } else if (i === index) {
  //       //   row = row >= 2 ? row - 1 : row;
  //       //   col = col >= 2 ? col - 1 : col;
  //       // } else if (bigGridCol >= col + 2) {
  //       //   console.log(232, row, col, doms[i]);
  //       //   row = col;
  //       //   col = 0;
  //       // }

  //       if (index !== i && bigGridCol > 0 && bigGridRow > 0) {
  //         // 当超过最大列数时，换行
  //         if (bigGridRow === 2) {
  //           if (row === 1 && bigGridCol === 1) {
  //             row = col;
  //             col = bigGridRow;
  //           }
  //           if (row + bigGridRow === rows && bigGridCol === cols) {
  //             row = col + 1;
  //             col = 0;
  //           } else if (row + bigGridRow === rows && bigGridCol === col) {
  //             row += 1;
  //             col = 0;
  //           }
  //         } else if (row === 0 && col !== 0 && bigGridCol + col < cols) {
  //           row = col - 1 > 0 ? col - 1 : col;
  //           col = bigGridCol + col;
  //         } else if (row === 0 && bigGridCol + col > cols) {
  //           row = bigGridRow + row;
  //           col = 0;
  //         } else if (row === 1 && row + bigGridRow <= rows) {
  //           // 当前行+2X2格子不换行
  //           row = bigGridRow + row;
  //         }
  //       } else {
  //         col = bigGridCol + col > cols ? col - 1 : col;
  //       }

  //       doms[i].style.top = `${row * (gridSize / rows)}px`;
  //       doms[i].style.left = `${col * (gridSize / cols)}px`;
  //     }

  //     // const rowIndex = data.findIndex((item: any) => item.row === 2);
  //     // const diffArr: any = data.slice(rowIndex + 1) ?? [];
  //     // if (rowIndex > -1) {
  //     //   for (let i = 0; i < diffArr.length; i++) {
  //     //     const row = parseInt(String(i / cols)) + 2;
  //     //     const col = parseInt(String(i % cols));
  //     //     const domIndex = diffArr[i]?.index - 1 || 0;

  //     //     doms[domIndex].style.left = `${col * 158}px`;
  //     //     doms[domIndex].style.top = `${row * 158}px`;
  //     //   }
  //     // }

  //     // const boxWidth = doms[rowIndex]?.offsetWidth;
  //     // const screenWidth = dragBox?.current?.offsetWidth;
  //     // const diffString = String(screenWidth / boxWidth);
  //     // const cols = parseInt(diffString);
  //     // const heightArr = [];
  //     // let boxHeight = 0;
  //     // let minBoxHeight = 0;
  //     // let minBoxIndex = 0;

  //     // console.log(rowIndex, cols);
  //     // for (let i = 0; i < doms.length; i++) {
  //     //   boxHeight = doms[i].offsetHeight;
  //     //   if (i < cols) {
  //     //     heightArr.push(boxHeight);
  //     //     doms[i].style = '';
  //     //   } else {
  //     //     minBoxHeight = Math.min(...heightArr);
  //     //     minBoxIndex = getMinBoxIndex(heightArr, minBoxHeight);

  //     //     doms[i].style.left = `${minBoxIndex * boxWidth}px`;
  //     //     doms[i].style.top = `${minBoxHeight}px`;
  //     //     heightArr[minBoxIndex] += boxHeight;
  //     //   }

  //     //   console.log(heightArr, minBoxIndex, boxHeight);
  //     // }
  //   }
  // };

  const handleData = React.useCallback(
    (afterTarget: any) => {
      const from = Number(dragged?.dataset?.id);
      const to = Number(afterTarget?.dataset?.id);
      const draggedItem = JSON.parse(dragged?.dataset?.item) || {};
      const targetItem = JSON.parse(afterTarget?.dataset?.item) || {};
      const area = draggedItem?.propterty?.size?.area_x;

      // 获取当前点的正方形下标
      const currentSize = area >= 2 ? getAbsolutePosition(to) : [Number(to)];
      if (area >= 2 && currentSize.length < 4) {
        toastError(t('planetTipsFail1'));
        return;
      }
      const canSave = currentSize?.every(item => !state.data[item]?.isbuilding);
      setState(pre => {
        const next = pre?.data.map((row: any) => {
          if (!canSave) {
            return {
              ...row,
              pre: false,
            };
          }
          if (row.index === Number(to)) {
            return {
              ...row,
              ...targetItem,
              ...draggedItem,
              pre: false,
              isbuilding: true,
            };
          }
          return { ...row, pre: false };
        });
        return { ...pre, data: next };
      });

      if (canSave) {
        for (let i = state.data.length - 1; i >= 0; i--) {
          if (i === Number(to)) {
            setBuilds((prev: any) => {
              return [
                ...prev,
                {
                  ...state.data[i],
                  ...targetItem,
                  ...draggedItem,
                  pre: false,
                  isbuilding: true,
                  isactive: true,
                },
              ];
            });
            return;
          }
        }
      }
    },
    // eslint-disable-next-line
    [state.data, t, toastError],
  );

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    dragged = e.target;
  };

  const dragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState(pre => {
      const next = pre?.data.map((row: any) => {
        return { ...row, pre: false };
      });
      return { ...pre, data: next };
    });
  };

  const drop = (event: any) => {
    event.preventDefault();
    if (event.target.tagName !== 'DIV') {
      return;
    }
    handleData(event.target);
  };

  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragEnter = (event: any) => {
    event.preventDefault();
    const draggedTarget = JSON.parse(dragged?.dataset?.item) || {};
    const index = event.target?.dataset?.id;
    const area = draggedTarget?.propterty?.size?.area_x;
    const currentSize =
      area >= 2 ? getAbsolutePosition(index) : [Number(index)];
    // 查看所有点位是否被占领
    const canSave = currentSize?.every(item => !state.data[item]?.isbuilding);

    setState(pre => {
      const next = pre?.data.map((row: any) => {
        if (!canSave) {
          return {
            ...row,
            pre: false,
          };
        }
        if (currentSize.includes(row.index)) {
          if (row.isbuilding) {
            return { ...row, pre: false };
          }
          return {
            ...row,
            pre: true,
          };
        }
        return { ...row, pre: false };
      });
      return { ...pre, data: next };
    });
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

  // 创建格子到九宫格中
  const createGrid = async () => {
    const params = builds?.reduce((current, next, index): any => {
      if (next?.isactive) {
        const [from, to] = getMatrix(
          next?.index,
          next?.propterty?.size?.area_x,
        );
        current.push({
          buildings_id: next.buildings_number,
          position: {
            from: { x: from[0].x, y: from[1].y },
            to: { x: to[0].x, y: to[1].y },
          },
          index: next.index,
        });
      }
      return current;
    }, []);

    try {
      const res = await Api.BuildingApi.createBuilding({
        planet_id,
        build_type: 1,
        building_setting: params,
      });
      if (Api.isSuccess(res)) {
        toastSuccess(t('planetTipsSaveSuccess'));
        setBuilds([]);
        dispatch(fetchPlanetBuildingsAsync(planet_id));
      } else {
        toastError(res?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 销毁建筑
  const destroyBuilding = () => {
    if (!currentBuild?._id) {
      toastError(t('planetPleaseSelectbuilding'));
      return;
    }
    if (currentBuild?.isactive) {
      const index = builds.findIndex(r => r.index === currentBuild?.index);
      builds.splice(index, 1);
      setBuilds([...builds]);
      return;
    }
    dispatch(storeAction.destoryBuildingVisibleModal(true));
  };

  return (
    <>
      <Box>
        <Flex justifyContent='space-between'>
          <Flex flex='1'>
            <Container
              ref={dragBox}
              width={`${gridSize}px`}
              height={`${gridSize}px`}
            >
              {state.data.map((item: any, index: number) => {
                return (
                  <Normal
                    key={`${item.index}_${item?._id}`}
                    draggable={false}
                    data-id={index}
                    data-row={item?.row}
                    data-item={JSON.stringify(item)}
                    pre={item?.pre}
                    width={width}
                    height={height}
                    top={item.x * width}
                    left={item.y * height}
                    onDragStart={dragStart}
                    onDragEnter={dragEnter}
                    onDragOver={dragOver}
                    onDrop={drop}
                    onDragEnd={dragEnd}
                  />
                );
              })}
              {builds.map((item, index) => {
                return (
                  <BuildingBox
                    key={`${item.index}_${item?._id}_${index}`}
                    draggable={false}
                    data-id={item.index}
                    data-item={JSON.stringify(item)}
                    width={item?.propterty?.size?.area_x * width}
                    height={item?.propterty?.size?.area_y * height}
                    top={item.x * width}
                    left={item.y * height}
                    checked={currentBuild?.index === item?.index}
                    onClick={() => setCurrentBuild(item)}
                  >
                    <Building
                      planet_id={planet_id}
                      level={item?.propterty?.levelEnergy}
                      src={item?.picture}
                      itemData={item}
                    />
                  </BuildingBox>
                );
              })}
            </Container>
            <Flex ml='10px' flexDirection='column'>
              <ActionButton onClick={createGrid}>
                {t('planetSave')}
              </ActionButton>
              <ActionButton onClick={destroyBuilding} variant='danger'>
                {t('planetDestroy')}
              </ActionButton>
            </Flex>
          </Flex>
          <GameInfo
            planet_id={planet_id}
            building_id={currentBuild?._id}
            currentBuild={currentBuild}
          />
        </Flex>
        <BgCard variant='long' mt='12px' padding='40px'>
          <Flex>
            <Flex flexDirection='column' width='230px'>
              <CardTab>
                {(state.tabs ?? []).map(row => (
                  <TabsButton
                    key={row.index}
                    onClick={() =>
                      setState({ ...state, currentTab: row.index })
                    }
                    active={row.index === state.currentTab}
                    variant='text'
                  >
                    {row.title}
                  </TabsButton>
                ))}
              </CardTab>
              <Text mt='13px' small>
                {t('planetDragBuildingDesiredGrid')}
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
                    onDragEnd={dragEnd}
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
    </>
  );
};
