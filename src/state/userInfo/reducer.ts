import { createReducer, createSlice } from '@reduxjs/toolkit'
import { AppThunk, UserInfoState } from 'state/types'
import { fetchInfoView, fetchUserInfoById, fetchUserView } from './fetchers'

const currentTimestamp = () => new Date().getTime()

export const initialState: UserInfoState = {
  userInfoView: {
    nickname: '',
    nftAddress: '',
    tokenId: 0,
    isActive: false,
    superior: '',
    loading: true,
  },

  infoView: {
    avatarNft_: '0', // 头像nft的合约地址
    payToken_: '0', // 要支付的token的合约地址
    userProfile_: '0', // 用户信息合约地址
    price_: '0', // 价格
    createdCount_: '0', // 已创建数量
  },

  userInfo: {
    id: 0,
    nickname: "",
    address: "",
    nft: "",
    avatar: "",
    firstLoginAt: 0,
    addTime: 0,
    updatedAt: ""
  },
}

export const fetchInfoViewAsync =
  (): AppThunk =>
  async (dispatch) => {
    const infoView = await fetchInfoView();
    dispatch(setInfoView(infoView))
}

export const fetchUserViewAsync = (account: string): AppThunk => async (dispatch) => {
  const userInfo = await fetchUserView(account);
  dispatch(setUserInfoView(userInfo))
}

export const fetchUserInfoByIdAsync = (uid: number): AppThunk => async (dispatch) => {
  const userInfo = await fetchUserInfoById(uid);
  dispatch(setUserInfo(userInfo))

}

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setInfoView: (state, action) => {
      const { payload } = action
      state.infoView = payload
    },
    setUserInfoView: (state, action) => {
      const { payload } = action
      state.userInfoView = {
        ...payload,
        loading: false,
      }
    },
    setUserInfo: (state, action) => {
      const { payload } = action
      state.userInfo = payload
    },
  }
})

// Actions
export const {
  setInfoView,
  setUserInfo,
  setUserInfoView,
} = userInfoSlice.actions;

export default userInfoSlice.reducer

