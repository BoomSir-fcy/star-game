import { createReducer, createSlice } from '@reduxjs/toolkit';
import { AppThunk, UserInfoState } from 'state/types';
import {
  fetchInfoView,
  fetchUserInfoById,
  fetchUserView,
  fetchAllowance,
  fetchUserBalance,
  fetchUserInfoByAccount,
  fetchUserProduct,
  fetchUserInviteInfo,
} from './fetchers';

const currentTimestamp = () => new Date().getTime();

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
    avatarNft_: '', // 头像nft的合约地址
    payToken_: '', // 要支付的token的合约地址
    userProfile_: '', // 用户信息合约地址
    price_: '0', // 价格
    createdCount_: '0', // 已创建数量
    priceBnb_: '0', // BNB价格
  },

  userInfo: {
    id: 0,
    nickname: '',
    address: '',
    nft: '',
    avatar: '',
    firstLoginAt: 0,
    addTime: 0,
    updatedAt: '',
    vipBenefits: {},
  },

  allowance: {
    allowance: '0',
    loading: false,
  },

  userBalance: [],

  userProduct: {
    planet_num: 0,
    stone_product: 0,
    energy_product: 0,
    population_product: 0,
    stone: 0,
    energy: 0,
    population: 0,
    power: 0,
  },
  zIndex: true,
  userInviteInfo: {
    bnb_income: '0',
    invite_reward: {},
    invite_user_num: 0,
    page: 1,
    page_size: 10,
  },
  InviteInfoEnd: false,
  InviteInfoLoading: true,
};

export const fetchInfoViewAsync =
  (account: string): AppThunk =>
  async dispatch => {
    const infoView = await fetchInfoView(account);
    dispatch(setInfoView(infoView));
  };

export const fetchUserViewAsync =
  (account: string): AppThunk =>
  async dispatch => {
    const userInfo = await fetchUserView(account);
    dispatch(setUserInfoView(userInfo));
  };

export const fetchUserInfoByIdAsync =
  (uid: number): AppThunk =>
  async dispatch => {
    const userInfo = await fetchUserInfoById(uid);
    dispatch(setUserInfo(userInfo));
  };

export const fetchUserInfoByAccountAsync =
  (account: string): AppThunk =>
  async dispatch => {
    const userInfo = await fetchUserInfoByAccount(account);
    dispatch(setUserInfo(userInfo));
  };

export const fetchAllowanceAsync =
  ({ account, token }: { account: string; token: string }): AppThunk =>
  async dispatch => {
    dispatch(setAllowance({ loading: true }));
    const allowance = await fetchAllowance(account, token);
    dispatch(setAllowance({ allowance, loading: false }));
  };

export const fetchUserBalanceAsync = (): AppThunk => async dispatch => {
  const Balance = await fetchUserBalance();
  dispatch(setBalance(Balance));
};

export const fetchUserProductAsync = (): AppThunk => async dispatch => {
  const Product = await fetchUserProduct();
  dispatch(setProduct(Product));
};

export const fetchInviteInfoViewAsync =
  (params: Api.User.InviteParams): AppThunk =>
  async dispatch => {
    const infoView = await fetchUserInviteInfo(params);
    dispatch(setUserInviteInfo(infoView));
  };

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setNavZIndex: (state, action) => {
      const { payload } = action;
      state.zIndex = payload;
    },
    setInfoView: (state, action) => {
      const { payload } = action;
      if (payload) {
        state.infoView = {
          ...state.infoView,
          ...payload,
          loading: true,
        };
      }
    },
    setUserInfoView: (state, action) => {
      const { payload } = action;
      state.userInfoView = {
        ...state.userInfoView,
        ...payload,
        loading: false,
      };
    },
    setUserInfo: (state, action) => {
      const { payload } = action;
      state.userInfo = {
        ...state.userInfo,
        ...payload,
      };
    },

    setAllowance: (state, action) => {
      const { payload } = action;
      state.allowance = {
        ...state.allowance,
        ...payload,
      };
    },
    setBalance: (state, action) => {
      const { payload } = action;
      if (payload) {
        state.userBalance = payload;
      }
    },
    setProduct: (state, action) => {
      const { payload } = action;
      if (payload) {
        state.userProduct = payload;
      }
    },
    setUserInviteInfo: (state, action) => {
      const { payload } = action;
      if (payload) {
        const { invite_reward, invite_user_num, page, page_size } = payload;
        if (page > 1) {
          state.userInviteInfo.invite_reward = {
            ...state.userInviteInfo.invite_reward,
            ...invite_reward,
          };
        } else {
          state.userInviteInfo.invite_reward = invite_reward;
        }
        if (page * page_size >= invite_user_num) {
          state.InviteInfoEnd = true;
        } else {
          state.InviteInfoEnd = false;
        }
        state.InviteInfoLoading = false;
      }
    },
  },
});

// Actions
export const {
  setNavZIndex,
  setInfoView,
  setUserInfo,
  setUserInfoView,
  setAllowance,
  setBalance,
  setProduct,
  setUserInviteInfo,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
