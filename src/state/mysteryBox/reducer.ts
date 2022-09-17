import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, MysteryBoxState } from 'state/types';
import { fetchBoxView, fetchUserKeys } from './fetchers';

export const initialState: MysteryBoxState = {
  boxView: {
    priceBNB: [], // 三种盲盒对应的bnb价格
    seedBlocks: [], // 三种盲盒对应的预定区块, 与当前区块相差超过230个区块应让用户重新预定
    burnRatio: '0', // 销毁比例
    vdsgRatio: '0', // 给vdsg的比例
    dsgPoolRatio: '0', // 给dsg质押池的比例
    bnbPoolRatio: '0', // 给bnb质押池的比例
    superiorRatio: '0', // 给邀请人的比例
    defaultSuperior: '', // 默认邀请人
    miniDistributeAmount: '0', //
    totalBurnt: '0', // 总销毁量dsg
    totalVDsgDonated: '0', // 总给vdsg的量dsg
    totalPoolSent: '0', // 总给质押池的量dsg
    totalPoolSentBNB: '0', // 总给质押池的量bnb
    maxSales: '0', // 最大可销售量
    sold: '0', // 已销售量
    maxHeld: '0', // 每种盲盒最大可持有的数量
    boxCount: [], // 获取用户各盲盒持有的key数量
    loading: true,
  },
  openBlind: false, // 开启星球稀有度
  openBlindIds: [], // 已开启的星球id
};

export const fetchBoxViewAsync =
  (account: string): AppThunk =>
  async dispatch => {
    const infoView = await fetchBoxView(account);
    dispatch(setBoxView(infoView));
  };
export const fetchUserKeysAsync =
  (account: string): AppThunk =>
  async dispatch => {
    const infoView = await fetchUserKeys(account);
    dispatch(setUserKeys(infoView));
  };

export const EditOpenBlindModalAsync =
  (open: boolean): AppThunk =>
  async dispatch => {
    dispatch(setOpenBlind(open));
  };

export const mysteryBoxSlice = createSlice({
  name: 'mysteryBox',
  initialState,
  reducers: {
    setBoxView: (state, action) => {
      const { payload } = action;
      if (payload) {
        const { boxCount, ...rest } = payload;
        state.boxView = {
          ...state.boxView,
          ...rest,
          loading: false,
        };
      }
    },
    setUserKeys: (state, action) => {
      const { payload } = action;
      if (payload) {
        state.boxView = {
          ...state.boxView,
          ...payload,
        };
      }
    },
    setOpenBlind: (state, action) => {
      const { payload } = action;
      state.openBlind = payload;
    },
    setOpenBlindIds: (state, action) => {
      const { payload } = action;
      state.openBlindIds = [...state.openBlindIds, payload];
    },
    clearOpenBlindIds: state => {
      state.openBlindIds = [];
    },
  },
});

// Actions
export const {
  setBoxView,
  setUserKeys,
  setOpenBlind,
  setOpenBlindIds,
  clearOpenBlindIds,
} = mysteryBoxSlice.actions;

export default mysteryBoxSlice.reducer;
