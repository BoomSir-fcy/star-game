import { ThunkAction } from 'redux-thunk'
import { AnyAction } from '@reduxjs/toolkit'

// 性别
export enum Gender {
  MAN = 0,
  WOMAN = 1
}

export interface UserAgentInfoView {
  avatarNft_: string; // 头像nft的合约地址
  payToken_: string; // 要支付的token的合约地址
  userProfile_: string; // 用户信息合约地址
  price_: string; // 价格
  createdCount_: string; // 已创建数量
}

export interface UserInfoView {
  nickname: string;
  nftAddress: string;
  tokenId: number;
  isActive: boolean;
  superior: string;
  loading: boolean;
}
export interface UserInfoState {

  infoView: UserAgentInfoView;
  userInfoView: UserInfoView;
  userInfo: Api.User.UserInfo;

}



export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, AnyAction>

export interface State {
  userInfo: UserInfoState
}
