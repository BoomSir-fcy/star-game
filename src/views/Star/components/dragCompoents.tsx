import React from 'react';
import styled, { css } from 'styled-components';
import classnames from 'classnames';
import { polyfill } from 'mobile-drag-drop';
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';
import { useDispatch } from 'react-redux';
import { Box, Flex, BgCard, Card, Button, Text } from 'uikit';
import { useStore } from 'state';
import { Api } from 'apis';
import { isApp } from 'utils/client';

import { useToast } from 'contexts/ToastsContext';
import { useTranslation } from 'contexts/Localization';
import { fetchPlanetBuildingsAsync } from 'state/buildling/fetchers';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { BuyVipModal } from 'components/Modal/buyVipModal';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import eventBus from 'utils/eventBus';
import { useBuildingRepair } from './gameModel/hooks';

import { GameInfo, GameThing, Building, Queue } from './gameModel';
import { ThingRepairModal } from './Modal';
import { BuffBonus } from './buff';
import { useBuffer, useWorkqueue } from './hooks';
import {
  getBuilderSpriteRes,
  getBuildingOfRaceAndIndex,
} from 'building/core/utils';

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

const BuildingBox = styled(Box)<{ checked: boolean; opacity?: boolean }>`
  position: absolute;
  cursor: pointer;
  border: 1px solid #30343d;

  ${({ opacity }) =>
    opacity &&
    css`
      opacity: 0.5;
    `}

  ${({ checked }) =>
    checked &&
    css`
      &::after {
        position: absolute;
        display: block;
        content: '';
        top: 0;
        left: 0;
        right: 0;
        width: calc(100% + 0px);
        height: calc(100% + 0px);
        border: 2px solid #ffffff;
        box-shadow: ${({ theme }) => theme.shadows.highlight};
        z-index: 15;
      }
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
  padding-left: 5px;
  padding-top: 5px;
  overflow: auto;
`;

const BuildingsItem = styled(Box)`
  position: relative;
  margin-right: 45px;
  &.active {
    .game-thing {
      background-color: #000;
      &::after {
        position: absolute;
        display: block;
        content: '';
        top: -2px;
        left: -2px;
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        border-radius: 10px;
        border: 2px solid #fff;
        box-shadow: ${({ theme }) => theme.shadows.highlight};
        z-index: 5;
      }
    }
  }
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
  const { refreshWorkQueue } = useWorkqueue();
  const { toastSuccess, toastError } = useToast();
  const { setBatchRepair } = useBuildingRepair();
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
        title: `${t('BuildUpgradeQueue')}`,
      },
    ],
    visible: false,
    repairVisible: false,
  });
  const [grid, setGrid] = React.useState<any[]>([]);
  const [gridBuilds, setGridBuilds] = React.useState<any[]>([]);
  const [currentBuild, setCurrentBuild] = React.useState<any>({});
  const [buffer, setBuffer] = React.useState<any>([]);
  const [currentBuffer, setCurrentBuffer] =
    React.useState<Api.Building.BuildingBuffer>(null);
  const [serverDiffTime, setServerDiffTime] = React.useState<number>(0);
  const dragBox = React.useRef<HTMLDivElement>(null);
  const gradRef = React.useRef(null);
  const buildings = useStore(p => p.buildling.buildings);
  const userVipinfo = useStore(p => p.userInfo?.userInfo?.vipBenefits);
  const currentTime = Number((Date.now() / 1000).toFixed(0));

  // 升级建造队列
  const [currentQueue, setCurrentQueue] = React.useState([]);
  const repairBuildings = gridBuilds.filter(
    ({ propterty }) => propterty?.now_durability !== propterty?.max_durability,
  );

  // X, row, width 横
  // Y, col, height 竖
  const { width, height } = React.useMemo(() => {
    return {
      width: gridSize / rows,
      height: gridSize / cols,
    };
  }, [rows, cols, gridSize]);

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

  const getWorkQueue = React.useCallback(
    async (isSave?: boolean) => {
      try {
        const res = await refreshWorkQueue(planet_id);
        if (Api.isSuccess(res)) {
          const resWorkQueue = res.data.work_queue;
          let isQueue = [];
          if (isSave) {
            isQueue = currentQueue.filter((item: any) => !item.planet_id);
          }
          setCurrentQueue([...resWorkQueue, ...isQueue]);
          setServerDiffTime(
            res.data.time - currentTime > 0
              ? -(res.data.time - currentTime)
              : res.data.time - currentTime,
          );
          dispatch(fetchPlanetBuildingsAsync(planet_id));
          dispatch(fetchPlanetInfoAsync([planet_id]));
        }
      } catch (error) {
        console.log(error);
      }
    },
    [currentQueue, currentTime, dispatch, planet_id, refreshWorkQueue],
  );

  // 新建建筑队列放入格子;
  const refreshQueue = React.useCallback(
    async (data: any) => {
      const queueBuilding = currentQueue.filter(
        ({ work_type }) => work_type === 1,
      );
      const currentGridBuilds = data.filter(
        ({ _id, isbuilding, isqueue }) => _id && isbuilding && !isqueue,
      );

      if (queueBuilding.length > 0) {
        setGrid(pre => {
          const next = pre?.map((row: any, i: number) => {
            const currentRow = queueBuilding.find(
              ({ index }) => row.index === index,
            );
            if (currentRow?._id) {
              return {
                ...queueBuilding[i],
                ...row,
                pre: false,
                isbuilding: true,
              };
            }
            return { ...row, pre: false };
          });
          return [...next];
        });

        console.log(queueBuilding);

        setGridBuilds([...currentGridBuilds, ...queueBuilding]);
      }
    },
    [currentQueue],
  );

  const updateGrids = React.useCallback(
    propsData => {
      const currBuilds = propsData?.filter((row: any) => row.isbuilding);
      // const isactive = gridBuilds.filter((row: any) => row.isactive);
      setGrid(propsData);
      setGridBuilds(currBuilds);
      if (currentQueue.length > 0) {
        refreshQueue(currBuilds);
      }
    },
    [currentQueue.length, refreshQueue],
  );

  const onRefreshClick = React.useCallback(() => {
    dispatch(fetchPlanetBuildingsAsync(planet_id));
    dispatch(fetchPlanetInfoAsync([planet_id]));
    getWorkQueue();
  }, [planet_id, getWorkQueue, dispatch]);

  React.useEffect(() => {
    if (itemData.length > 0) {
      updateGrids(itemData);
    }
  }, [itemData, updateGrids]);

  React.useEffect(() => {
    if (planet_id) {
      getWorkQueue();
      getBuffer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 添加事件监听，用于更新状态
  React.useEffect(() => {
    eventBus.addEventListener('onRefresh', onRefreshClick);
    return () => {
      eventBus.removeEventListener('onRefresh', onRefreshClick);
    };
  }, [onRefreshClick]);

  // 获取坐标点
  const getMatrix = React.useCallback(
    (index: number, currentSize = 1) => {
      const currentAxis = itemData.find(item => item.index === Number(index));
      return [
        [{ x: currentAxis.x }, { y: currentAxis.y }],
        [
          { x: currentAxis.x + currentSize },
          { y: currentAxis.y + currentSize },
        ],
      ];
    },
    [itemData],
  );

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

          console.log(grid);
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

  // 创建格子到九宫格中
  const saveWorkQueue = React.useCallback(async () => {
    const params = currentQueue?.reduce((current, next, index): any => {
      const [from, to] = getMatrix(next?.index, next?.propterty?.size?.area_x);
      if (!next?.work_end_time) {
        if (next?.work_type === 1) {
          current.push({
            work_type: 1,
            building_create_param: {
              buildings_id: next._id,
              building_number: next.buildings_number,
              position: {
                from: { x: from[0].x, y: from[1].y },
                to: { x: to[0].x, y: to[1].y },
              },
              index: next.index,
            },
          });
        } else {
          current.push({
            work_type: 2,
            building_upgrade_param: {
              buildings_id: next._id,
              building_number: next.buildings_number,
            },
          });
        }
      }
      return current;
    }, []);

    try {
      const res = await Api.BuildingApi.createQueueBuilding({
        planet_id,
        work_queue_params: params,
      });
      if (Api.isSuccess(res)) {
        toastSuccess(t('planetTipsSaveSuccess'));
        getWorkQueue();
        dispatch(fetchPlanetBuildingsAsync(planet_id));
        dispatch(fetchPlanetInfoAsync([planet_id]));
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    currentQueue,
    dispatch,
    getMatrix,
    getWorkQueue,
    planet_id,
    t,
    toastSuccess,
  ]);

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
      let targetItem = {
        x: 0,
        y: 0,
      };
      try {
        draggedItem = JSON.parse(dragged?.dataset?.item) || {};
        targetItem = JSON.parse(afterTarget?.dataset?.item) || {};
      } catch (error) {
        console.error(error);
      }

      if (currentQueue.length >= userVipinfo?.building_queue_capacity) {
        toastError(t('planetTipsQueueCapacity'));
        return;
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
        const gridIndex =
          grid[grid.findIndex(row => row.index === startIndex)] || {};

        setCurrentQueue([
          ...currentQueue,
          {
            ...gridIndex,
            ...draggedItem,
            isbuilding: true,
            isqueue: true,
            work_type: 1,
            work_status: 3,
          },
        ]);

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
                  isqueue: false,
                },
              ];
              return next;
            });
            return;
          }
        }
      }
    },
    [currentQueue, getAbsolutePosition, grid, t, toastError, userVipinfo],
  );

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

  // 延迟请求
  const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // 取消建筑&&队列建筑
  const destroyBuilding = () => {
    setCurrentBuild({});
    // 如果删除升级中的建筑，则同个升级建筑全部销毁
    if (currentBuild?.work_type === 2) {
      const activeUpgrade = currentQueue.filter(
        item => item._id !== currentBuild._id,
      );
      setCurrentQueue(activeUpgrade);
    } else {
      setGrid(pre => {
        const next = pre?.map((row: any) => {
          if (row.index === currentBuild.index) {
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
      setCurrentQueue(r => {
        const next = r.filter((row: any) => row.index !== currentBuild?.index);
        return [...next];
      });
    }
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
                  />
                );
              })}
              {(gridBuilds ?? []).map((item, index) => {
                // 通过队列查找建筑
                let info: any = {};
                if (item?.buildings_id) {
                  info = buildings[1]?.find(
                    ({ _id }) => _id === item?.buildings_id,
                  );
                  info = {
                    ...info,
                    x: item?.position?.from?.x,
                    y: item?.position?.from?.y,
                  };
                }
                const basic = { ...info, ...item };
                return (
                  <BuildingBox
                    key={`${basic.index}_${basic?._id}_${index}`}
                    draggable={false}
                    data-id={basic.index}
                    data-item={JSON.stringify(basic)}
                    width={basic?.propterty?.size?.area_x * width}
                    height={basic?.propterty?.size?.area_y * height}
                    left={basic.x * width}
                    top={basic.y * height}
                    checked={currentBuild?.index === basic?.index}
                    opacity={basic?.work_add_time}
                    onClick={() => {
                      if (basic?.work_add_time) return;
                      setCurrentBuild({ ...basic, iscreate: true });
                      changeBuff(basic);
                    }}
                  >
                    <Building
                      planet_id={planet_id}
                      level={basic?.propterty?.levelEnergy}
                      src={basic?.picture}
                      itemData={item}
                    />
                  </BuildingBox>
                );
              })}
            </Container>
            <Flex
              ml='25px'
              flexDirection='column'
              justifyContent='space-between'
            >
              <BuffBonus currentBuff={currentBuffer} />
              <Flex flexDirection='column'>
                <ActionButton
                  disabled={repairBuildings.length <= 0}
                  onClick={() => {
                    if (userVipinfo.is_vip) {
                      setState({ ...state, repairVisible: true });
                    } else {
                      setState({ ...state, visible: true });
                    }
                  }}
                >
                  {t('One-clickRepair')} {repairBuildings.length}
                </ActionButton>
              </Flex>
            </Flex>
          </Flex>
          <GameInfo
            planet_id={planet_id}
            building_id={currentBuild?._id}
            currentBuild={currentBuild}
            currentQueue={currentQueue}
            gridBuilds={gridBuilds}
            diffTime={
              currentBuild?.work_end_time - (currentTime + serverDiffTime) || 0
            }
            onUpgradeLevel={data => {
              if (currentQueue.length >= userVipinfo?.building_queue_capacity) {
                toastError(t('planetTipsQueueCapacity'));
                return;
              }
              setCurrentQueue([
                ...currentQueue,
                {
                  ...currentBuild,
                  isqueue: true,
                  propterty: data?.propterty,
                  work_build_picture: data?.picture,
                  work_type: 2,
                  work_status: 4,
                },
              ]);
            }}
            onCancelQueue={destroyBuilding}
            callback={destroyBuilding}
          />
        </Flex>
        <BgCard variant='long' mt='12px' padding='40px'>
          <Flex className='buildings'>
            <Flex flexDirection='column' width='227px'>
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
              <Text bold mt='12px' textAlign='center' fontSize='15px'>
                {t('planetDragBuildingDesiredGrid')}
              </Text>
            </Flex>
            {state.currentTab === 1 ? (
              <BuildingsScroll ml='40px'>
                {(buildings[state?.currentTab] ?? []).map(
                  (row: Api.Building.Building, index: number) => (
                    <BuildingsItem
                      key={`${row.buildings_number}_${index}`}
                      className={classnames(
                        `building_${index}`,
                        row._id === currentBuild?._id && 'active',
                      )}
                    >
                      <GameThing
                        draggable
                        onClick={() => {
                          setCurrentBuild({
                            ...row,
                            isbuilding: false,
                            iscreate: false,
                          });
                        }}
                        onDragStart={e => dragStart(e, row)}
                        onDrop={event => event.preventDefault()}
                        onDragEnter={event => event.preventDefault()}
                        onDragOver={dragOver}
                        onDragEnd={dragEnd}
                        scale='sm'
                        round
                        itemData={row}
                        src={getBuilderSpriteRes(row.race, `${row.index}`)}
                        text={
                          getBuildingOfRaceAndIndex(row.race, `${row.index}`)
                            ?.name
                        }
                      />
                    </BuildingsItem>
                  ),
                )}
              </BuildingsScroll>
            ) : (
              <Queue
                serverTime={currentTime + serverDiffTime}
                currentQueue={currentQueue}
                onSelectCurrent={(item: any) => {
                  const currbuildings = buildings[1].find(
                    ({ _id }) => item?.buildings_id === _id,
                  );
                  setCurrentBuild({
                    ...currbuildings,
                    ...item,
                    iscreate: false,
                    work_queue_id: item?._id,
                  });
                }}
                onSave={saveWorkQueue}
                onComplete={debounce(async () => {
                  await sleep(1000);
                  console.log(
                    '刷新队列：',
                    dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                  );
                  await getWorkQueue(true);
                  setCurrentBuild({});
                }, 500)}
              />
            )}
          </Flex>
        </BgCard>

        <BuyVipModal
          tips={t(
            'One-click repair durability, you can repair the durability of all buildings on the planet faster',
          )}
          visible={state.visible}
          onClose={() => setState({ ...state, visible: false })}
        />

        {state.repairVisible && (
          <ThingRepairModal
            itemData={itemData}
            planet_id={[planet_id]}
            visible={state.repairVisible}
            onChange={async () => {
              const res = await setBatchRepair([planet_id]);
              if (res) {
                toastSuccess(t('planetQuickFixSuccessful'));
              }
              await dispatch(fetchPlanetBuildingsAsync(planet_id));
              dispatch(fetchPlanetInfoAsync([planet_id]));
              setState({ ...state, repairVisible: false });
            }}
            onClose={() => setState({ ...state, repairVisible: false })}
          />
        )}
      </Box>
    </>
  );
};
