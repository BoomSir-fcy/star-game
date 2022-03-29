import { createSlice } from '@reduxjs/toolkit'
import { AppThunk, MysteryBoxState } from 'state/types'
import { fetchBoxView } from './fetchers'

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
    loading: true,
  },
}

export const fetchBoxViewAsync =
  (account: string): AppThunk =>
  async (dispatch) => {
    const infoView = await fetchBoxView(account);
    dispatch(setBoxView(infoView))
}

export const mysteryBoxSlice = createSlice({
  name: 'mysteryBox',
  initialState,
  reducers: {
    setBoxView: (state, action) => {
      const { payload } = action
      if (payload) {
        state.boxView = {
          ...state.boxView,
          ...payload,
          loading: false,
        }
      }
    },
  }
})

// Actions
export const {
  setBoxView,
} = mysteryBoxSlice.actions;

export default mysteryBoxSlice.reducer

