import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PlanetState } from 'state/types';
import { setActiveMaterialMap, setActivePlanet } from './actions';

import { fetchMePlanetAsync, fetchPlanetInfoAsync } from './fetchers';

export const initialState: PlanetState = {
  mePlanet: [],
  planetInfo: {},
  activePlanet: {
    id: 0,
    name: '', // 星球名
    owner: '', // 当前所有人
    oldOwner: '', // 上一个所有人
    rarity: 0, // 品质1-6
    level: 0, // 等级 从1开始
    strengthenLevel: 0, // 强化等级
    working: false, // 是否工作 1工作
    workTime: 0, // 工作开始时间
    areaX: 0, // x轴方向上的个数
    areaY: 0, // y轴方向上的格数
    oreYield: 0, // 矿石每秒产出
    oreConsumption: 0, // 矿石每秒总消耗
    energyYield: 0, // 能量每秒产出
    energyConsumption: 0, // 能量每秒总消耗
    populationYield: 0, // 人口每秒产出
    populationConsumption: 0, // 人口每秒消耗
    settleAt: 0, // 最后一次结算时间
    addTime: 0, // 添加时间
    update_finish_time: 0, // 升级结束时间
    strengthen_finish_time: 0, // 强化结束时间
    build_count: 0, // 建筑数量
    energy: 0, // 能量
    population: 0, // 人口
    plunder_speed: 0, // 掠夺速度
    race: 0, // 种族  1-神族 2-人族 3-虫族
    stone: 0, // 矿石
    defense: 0, // 防御加成
    attack: 0, // 攻击加成
    hp: 0, // hp加成
    product: 0, // 产能加成
    build: 0, // 建筑成本
    is_available: false,
  },
  activeMaterialMap: {},
};

export const planet = createSlice({
  name: 'planet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMePlanetAsync.fulfilled, (state, action) => {
        state.mePlanet = action.payload;
      })
      .addCase(setActivePlanet, (state, { payload }) => {
        state.activePlanet = payload;
      })
      .addCase(fetchPlanetInfoAsync.fulfilled, (state, action) => {
        const mapObject: { [x: number]: Api.Planet.PlanetInfo } = {};
        action.payload?.map(item => {
          mapObject[item.id] = item;
          return mapObject;
        });
        state.planetInfo = mapObject;
      })
      .addCase(setActiveMaterialMap, (state, { payload }) => {
        const map = { ...state.activeMaterialMap, ...payload };
        // 删除value为null的key
        Object.keys(map).forEach(
          key => map[Number(key)] === null && delete map[Number(key)],
        );
        state.activeMaterialMap = map;
      });
  },
});

export default planet.reducer;
