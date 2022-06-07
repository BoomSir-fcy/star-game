import React from 'react';
import styled, { css } from 'styled-components';
import { polyfill } from 'mobile-drag-drop';
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';
import { useDispatch } from 'react-redux';
import { Box, Flex, BgCard, Card, Button, Text, Input } from 'uikit';
import { useStore, storeAction } from 'state';
import { Api } from 'apis';
import { isApp } from 'utils/client';

import { useToast } from 'contexts/ToastsContext';
import { useTranslation } from 'contexts/Localization';
import { fetchPlanetBuildingsAsync } from 'state/buildling/fetchers';

import { BuyVipModal } from 'components/Modal/buyVipModal';
import { GameInfo, GameThing, Building } from './gameModel';
import { BuffBonus } from './buff';
import { useBuffer } from './hooks';

polyfill({
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
});

export interface AreaDataItem {
  x: number;
  y: number;
  index: number;
  isbuilding: boolean;
  isactive: boolean;
}

const Container = styled(Flex)`
  position: relative;
  border: 1px solid #30343d;
  background-color: ${({ theme }) => theme.colors.backgroundCard};
`;

const Normal = styled(Flex)<{ pre: boolean; isbuilding?: boolean }>`
  cursor: pointer;
  position: absolute;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #ffffff;
  font-size: 40px;
  text-shadow: 1px 1px 5px #41b7ff, -1px -1px 5px #41b7ff;
  border: 1px solid
    ${({ isbuilding }) => (isbuilding ? 'transparent' : '#30343d')};
  transition: all 0.5s;
  background: ${({ pre }) => (pre ? '#30343d' : 'transparent')};
  img {
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    height: auto;
    vertical-align: middle;
    pointer-events: none;
  }
  line-height: 1;
  &::after {
    content: '';
    height: 100%;
    display: inline-block;
    width: 0px;
    vertical-align: middle;
  }
`;

const BuildingBox = styled(Box)<{ checked: boolean }>`
  position: absolute;
  text-shadow: 1px 1px 5px #41b7ff, -1px -1px 5px #41b7ff;
  z-index: 10;
  cursor: pointer;
  border: 1px solid #30343d;

  ${({ checked }) =>
    checked &&
    css`
      border: 1px solid #fff;
      box-shadow: 0 0 5px 2px #41b7ff;
    `}
  img {
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    height: auto;
    vertical-align: middle;
    pointer-events: none;
  }
  &::after {
    content: '';
    height: 100%;
    display: none;
    width: 0px;
    vertical-align: middle;
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
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 0;
  }
`;

let dragged = {} as any;
export const DragCompoents: React.FC<{
  planet_id: number;
  itemData: any[];
  rows: number;
  cols: number;
  gridSize: number;
}> = ({ planet_id, itemData, cols, rows, gridSize }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { getPlanetBuff } = useBuffer();
  const { toastSuccess, toastError } = useToast();
  const [state, setState] = React.useState({
    currentTab: 1,
    currentBuilding: '',
    tabs: [
      {
        index: 1,
        title: `${t('planetBuildingTypeBusinessClass')}`,
      },
      {
        index: 2,
        title: `建造/升级队列`,
      },
    ],
  });
  const [grid, setGrid] = React.useState<any[]>([]);
  const [gridBuilds, setGridBuilds] = React.useState<any[]>([]);
  const [currentBuild, setCurrentBuild] = React.useState<any>({});
  const [buffer, setBuffer] = React.useState<any>([]);
  const [currentBuffer, setCurrentBuffer] =
    React.useState<Api.Building.BuildingBuffer>(null);
  const buildings = useStore(p => p.buildling.buildings);
  const dragBox = React.useRef<HTMLDivElement>(null);

  // X, row, width 横
  // Y, col, height 竖
  const { width, height } = React.useMemo(() => {
    return {
      width: gridSize / rows,
      height: gridSize / cols,
    };
  }, [rows, cols, gridSize]);

  const updateGrids = React.useCallback(propsData => {
    const currBuilds = propsData?.filter((row: any) => row.isbuilding);
    // const isactive = gridBuilds.filter((row: any) => row.isactive);
    setGrid(propsData);
    setGridBuilds(currBuilds);
  }, []);

  const changeBuff = (item: any) => {
    const currentBuildBuff = buffer?.find(
      (row: any) => row?.build_id === item?._id,
    );
    setCurrentBuffer(currentBuildBuff);
  };

  const getBuffer = React.useCallback(async () => {
    const res = await getPlanetBuff({ planet_id });
    setBuffer(res);
    const currentBuildBuff = buffer?.find(
      (row: any) => row?.build_id === currentBuild?._id,
    );
    if (!currentBuildBuff?._id) {
      const obj: any = {};
      // eslint-disable-next-line array-callback-return
      res?.map((value: any) => {
        // eslint-disable-next-line array-callback-return
        Object.keys(value).map((key: any) => {
          if (obj[key]) {
            obj[key] += value[key];
          } else {
            obj[key] = value[key];
          }
        });
      });
      setCurrentBuffer(obj);
    }
  }, [buffer, currentBuild?._id, getPlanetBuff, planet_id]);

  React.useEffect(() => {
    if (itemData.length > 0) {
      updateGrids(itemData);
    }
  }, [itemData, updateGrids]);

  React.useEffect(() => {
    if (planet_id) {
      getBuffer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 计算绝对坐标
  const getAbsolutePosition = React.useCallback(
    (index: number, area = 2): number[] => {
      // const row = Math.floor(index / cols);
      // const col = Math.floor(index % rows);
      // // 计算相邻的格子坐标
      // const bottomRow = row + 1;
      // const bottomCol = col;
      // // 当前格子右边坐标
      // const rightRow = row;
      // const rightCol = col + 1;
      // if (bottomRow > rows - 1 || rightCol > cols - 1) {
      //   return [];
      // }
      // // if (index ) {
      // //   return []
      // // }
      // // 斜角点坐标
      // const bottomRightRow = bottomRow - row + (rightRow - row) + row;
      // const bottomRightCol = bottomCol - col + (rightCol - col) + col;
      // const bevelIndex = bottomRightRow * rows + bottomRightCol;
      // return [Number(index), Number(index) + 1, bevelIndex - 1, bevelIndex];

      /**
       * @dev 获取2*2建筑对应的坐标点
       * @s1 根据当前index 获取坐标A
       * @s2 根据当前坐标获取四个对角的坐标D E F G， 判断是否存在（一个点判断能不能在周围放2*2的建筑, 判断 左上、左下、右上、右下是否存在）
       * @s3 根据四个坐标中存在的坐标点， 可以获取一个2*2的区域(设A的坐标为[x, y], 则令左上坐标为D, 可知D坐标为[x - 1, y - 1], 
            则可知由A-D构成的2*2的区域
            【D[x-1, y-1], B[x, y-1]
              C[x-1, y], A[x, y]】)
       * @s4 根据2*2区域对应的【D-B-C-A】四个坐标 判断四个坐标内是否存在建筑，若没有建筑，则可放置当前2*2的建筑
       * @s5 若可放置 则返回4个坐标点, 若不可放置，则返回空数组
       * 
       */

      /** @s1 */
      const currentAxis = itemData.find(item => item.index === Number(index));
      // TODO:
      if (!currentAxis) return [];
      /** @s2  根据用户习惯 筛选顺序为 右下 左下 右上 左上 */
      const axisPoint = [
        { x: currentAxis.x + 1, y: currentAxis.y + 1 }, // 右下
        { x: currentAxis.x - 1, y: currentAxis.y + 1 }, // 左下
        { x: currentAxis.x + 1, y: currentAxis.y - 1 }, // 右上
        { x: currentAxis.x - 1, y: currentAxis.y - 1 }, // 左上
      ];

      for (let i = 0; i < axisPoint.length; i++) {
        const axis = itemData.find(
          item => item.x === axisPoint[i].x && item.y === axisPoint[i].y,
        );
        if (axis) {
          /** @s3 */
          const areaPoints = [
            axis,
            itemData.find(
              item => item.x === axis.x && item.y === currentAxis.y,
            ),
            itemData.find(
              item => item.x === currentAxis.x && item.y === axis.y,
            ),
            currentAxis,
          ];

          /** @s4 */
          const canUseArea = areaPoints?.every(
            item =>
              !grid.find(subItem => subItem.index === item.index)?.isbuilding,
          );
          if (canUseArea) {
            return areaPoints.map(item => item.index);
          }
        }
      }
      return [];
    },
    [itemData, grid],
  );

  const handleData = React.useCallback(
    (afterTarget: any) => {
      const from = Number(dragged?.dataset?.id);
      const to = Number(afterTarget?.dataset?.id);
      let draggedItem = {
        propterty: {
          size: {
            area_x: {},
          },
        },
      };
      let targetItem = {};
      try {
        draggedItem = JSON.parse(dragged?.dataset?.item) || {};
        targetItem = JSON.parse(afterTarget?.dataset?.item) || {};
      } catch (error) {
        console.error(error);
      }
      const area = draggedItem?.propterty?.size?.area_x;
      // 获取当前点的正方形下标
      const currentSize = area >= 2 ? getAbsolutePosition(to) : [Number(to)];
      if (area >= 2 && currentSize.length < 4) {
        toastError(t('planetTipsFail1'));
        return;
      }
      const canSave = currentSize?.every(
        item => !grid[grid.findIndex(row => row.index === item)]?.isbuilding,
      );
      setGrid(pre => {
        const next = pre?.map((row: any) => {
          if (!canSave) {
            return {
              ...row,
              pre: false,
            };
          }
          if (currentSize.includes(row.index)) {
            return {
              ...row,
              // ...targetItem,
              // ...draggedItem,
              pre: false,
              isbuilding: true,
              buildingId: (draggedItem as any)._id,
            };
          }
          return { ...row, pre: false };
        });
        return [...next];
      });

      if (canSave) {
        const startIndex = Math.min(...currentSize);

        for (let i = grid.length - 1; i >= 0; i--) {
          if (grid[i].index === startIndex) {
            setGridBuilds((prev: any) => {
              const next = [
                ...prev,
                {
                  // ...targetItem,
                  ...grid[i],
                  ...draggedItem,
                  pre: true,
                  isbuilding: true,
                  isactive: true,
                },
              ];
              return next;
            });
            return;
          }
        }
      }
    },
    [getAbsolutePosition, grid, t, toastError],
  );

  const gradRef = React.useRef(null);

  const dragStart = (
    e: React.DragEvent<HTMLDivElement>,
    row?: Api.Building.Building,
  ) => {
    try {
      const divTarget = e.target as HTMLDivElement;
      const { width: realWidth, height: realHeight } = (
        gradRef.current || divTarget
      ).getBoundingClientRect();

      const realSize =
        Math.min(realHeight, realWidth) * row.propterty.size.area_x;

      const img = document.createElement('img');
      img.style.position = 'absolute';
      img.style.top = '-9999px';
      img.style.maxWidth = `${realSize}px`;
      img.style.maxHeight = `${realSize}px`;
      img.src = divTarget.getElementsByTagName('img')[0]?.src;

      const { clientHeight, clientWidth } = window.document.body;
      if (clientWidth < clientHeight) {
        img.style.transform = 'rotate(90deg)';
      }
      document.body.append(img);

      if (isApp()) {
        e.dataTransfer.setDragImage(img, 0, 0);
      } else {
        e.dataTransfer.setDragImage(img, realSize / 2, realSize / 2);
      }
    } catch (error) {
      console.error(error);
    }
    dragged = e.target;
  };

  const dragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setGrid(pre => {
      const next = pre?.map((row: any) => {
        return { ...row, pre: false };
      });
      return [...next];
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
    let draggedTarget = {
      propterty: {
        size: {
          area_x: {},
        },
      },
    };
    try {
      draggedTarget = JSON.parse(dragged?.dataset?.item) || {};
    } catch (error) {
      console.error(error);
    }

    const index = event.target?.dataset?.id;
    const area = draggedTarget?.propterty?.size?.area_x;

    const currentSize =
      area >= 2 ? getAbsolutePosition(index, area) : [Number(index)];

    // 查看所有点位是否被占领
    const canSave = currentSize?.every(
      item => !grid[grid.findIndex(row => row.index === item)]?.isbuilding,
    );
    setGrid(pre => {
      const next = pre?.map((row: any) => {
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
      return [...next];
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
    const params = gridBuilds?.reduce((current, next, index): any => {
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
        setGridBuilds([]);
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
      setCurrentBuild({});
      setGrid(pre => {
        const next = pre?.map((row: any) => {
          if (row.buildingId === currentBuild._id) {
            return {
              ...row,
              isbuilding: false,
            };
          }
          return { ...row };
        });
        return [...next];
      });
      setGridBuilds(r => {
        const next = r.filter((row: any) => row.index !== currentBuild?.index);
        return [...next];
      });
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
              className='star_manager'
            >
              {(grid ?? []).map((item: any, index: number) => {
                return (
                  <Normal
                    key={`${item.index}_${item?._id}`}
                    className={`energy_tank_grid energy_tank_${index}`}
                    draggable={false}
                    ref={gradRef}
                    data-id={item.index}
                    data-row={item?.row}
                    data-item={JSON.stringify(item)}
                    pre={item?.pre}
                    isbuilding={item?.isbuilding}
                    width={width}
                    height={height}
                    left={item.x * width}
                    top={item.y * height}
                    onDragStart={dragStart}
                    onDragEnter={dragEnter}
                    onDragOver={dragOver}
                    onDrop={drop}
                    onDragEnd={dragEnd}
                  >
                    {/* x{item.x}, y{item.y} ({item.index}) */}
                  </Normal>
                );
              })}
              {(gridBuilds ?? []).map((item, index) => {
                return (
                  <BuildingBox
                    key={`${item.index}_${item?._id}_${index}`}
                    draggable={false}
                    data-id={item.index}
                    data-item={JSON.stringify(item)}
                    width={item?.propterty?.size?.area_x * width}
                    height={item?.propterty?.size?.area_y * height}
                    left={item.x * width}
                    top={item.y * height}
                    checked={currentBuild?.index === item?.index}
                    onClick={() => {
                      setCurrentBuild(item);
                      changeBuff(item);
                    }}
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
            <Flex
              ml='10px'
              flexDirection='column'
              justifyContent='space-between'
            >
              <BuffBonus currentBuff={currentBuffer} />
              <Flex flexDirection='column'>
                <ActionButton onClick={destroyBuilding}>
                  {t('One-clickRepair')} 3
                </ActionButton>
                <ActionButton onClick={createGrid}>
                  {t('planetSave')}
                </ActionButton>
                <ActionButton onClick={destroyBuilding} variant='danger'>
                  {t('planetDestroy')}
                </ActionButton>
              </Flex>
            </Flex>
          </Flex>
          <GameInfo
            planet_id={planet_id}
            building_id={currentBuild?._id}
            currentBuild={currentBuild}
            callback={() => setCurrentBuild({})}
          />
        </Flex>
        <BgCard variant='long' mt='12px' padding='40px'>
          <Flex className='buildings'>
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
              {(buildings[state?.currentTab] ?? []).map(
                (row: Api.Building.Building, index: number) => (
                  <BuildingsItem
                    key={`${row.buildings_number}_${index}`}
                    className={`building_${index}`}
                  >
                    <GameThing
                      draggable
                      onClick={() => {
                        console.log(row);
                      }}
                      onDragStart={e => dragStart(e, row)}
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
                ),
              )}
            </BuildingsScroll>
          </Flex>
        </BgCard>
        {/* <BuyVipModal visible onClose={() => {}} /> */}
      </Box>
    </>
  );
};
