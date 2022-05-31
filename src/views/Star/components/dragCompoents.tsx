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

import { GameInfo, GameThing, Building } from './gameModel';
import { BuffBonus } from './buff';
import { useBuffer } from './hooks';

polyfill({
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
});

const Container = styled(Flex)`
  position: relative;
  border: 1px solid #30343d;
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
  border: 1px solid #30343d;
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
      border: 1px solid #fff;
      box-shadow: 0 0 5px 2px #41b7ff;
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
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 0;
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
      // {
      //   index: 2,
      //   title: `${t('planetBuildingTypeCombatClass')}`,
      // },
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
    (index: number) => {
      const row = Math.floor(index / cols);
      const col = Math.floor(index % rows);
      // 计算相邻的格子坐标
      const bottomRow = row + 1;
      const bottomCol = col;
      // 当前格子右边坐标
      const rightRow = row;
      const rightCol = col + 1;
      if (bottomRow > rows - 1 || rightCol > cols - 1) {
        return [];
      }
      // 斜角点坐标
      const bottomRightRow = bottomRow - row + (rightRow - row) + row;
      const bottomRightCol = bottomCol - col + (rightCol - col) + col;
      const bevelIndex = bottomRightRow * rows + bottomRightCol;
      return [Number(index), Number(index) + 1, bevelIndex - 1, bevelIndex];
    },
    [cols, rows],
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
        console.log(error);
      }
      const area = draggedItem?.propterty?.size?.area_x;
      // 获取当前点的正方形下标
      const currentSize = area >= 2 ? getAbsolutePosition(to) : [Number(to)];
      if (area >= 2 && currentSize.length < 4) {
        toastError(t('planetTipsFail1'));
        return;
      }
      const canSave = currentSize?.every(item => !grid[item]?.isbuilding);
      setGrid(pre => {
        const next = pre?.map((row: any) => {
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
        return [...next];
      });

      if (canSave) {
        for (let i = grid.length - 1; i >= 0; i--) {
          if (i === Number(to)) {
            setGridBuilds((prev: any) => {
              return [
                ...prev,
                {
                  ...grid[i],
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
    [getAbsolutePosition, grid, t, toastError],
  );

  const dragStart = (e: any) => {
    if (isApp()) {
      const img = new Image();
      img.src = e.target.getElementsByTagName('img')[0]?.src;
      img.style.transform = 'rotate(90deg)';
      img.style.width = '100px';
      img.style.height = '100px';
      e.dataTransfer.setDragImage(img, 0, 0);
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
      console.log(error);
    }

    const index = event.target?.dataset?.id;
    const area = draggedTarget?.propterty?.size?.area_x;
    const currentSize =
      area >= 2 ? getAbsolutePosition(index) : [Number(index)];
    // 查看所有点位是否被占领
    const canSave = currentSize?.every(item => !grid[item]?.isbuilding);
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
      console.log(grid, currentBuild);

      // const index = gridBuilds.findIndex(r => r.index === currentBuild?.index);
      // gridBuilds.splice(index, 1);
      // setGridBuilds([...gridBuilds]);
      // setCurrentBuild({});
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
                    className={`energy_tank_${index}`}
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
              {(gridBuilds ?? []).map((item, index) => {
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
                (row: any, index: number) => (
                  <BuildingsItem
                    key={`${row.buildings_number}_${index}`}
                    className={`building_${index}`}
                  >
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
                ),
              )}
            </BuildingsScroll>
          </Flex>
        </BgCard>
      </Box>
    </>
  );
};
