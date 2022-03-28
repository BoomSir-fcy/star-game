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
  loading?: boolean
}

export interface UserInfoView {
  nickname: string;
  nftAddress: string;
  tokenId: number;
  isActive: boolean;
  superior: string;
  loading?: boolean;
}
export interface UserInfoState {

  infoView: UserAgentInfoView;
  userInfoView: UserInfoView;
  userInfo: Api.User.UserInfo;
  allowance: {
    allowance: string;
    loading: boolean;
  }
}

export interface MysteryBoxView {
  priceBNB: string[]; // 三种盲盒对应的bnb价格
  seedBlocks: number[]; // 三种盲盒对应的预定区块, 与当前区块相差超过230个区块应让用户重新预定
  burnRatio: string; // 销毁比例
  vdsgRatio: string; // 给vdsg的比例
  dsgPoolRatio: string; // 给dsg质押池的比例
  bnbPoolRatio: string; // 给bnb质押池的比例
  superiorRatio: string; // 给邀请人的比例
  defaultSuperior: string; // 默认邀请人
  miniDistributeAmount: string; // 
  totalBurnt: string; // 总销毁量dsg
  totalVDsgDonated: string; // 总给vdsg的量dsg
  totalPoolSent: string; // 总给质押池的量dsg
  totalPoolSentBNB: string; // 总给质押池的量bnb
  loading?: boolean
}

export interface MysteryBoxState {
  boxView: MysteryBoxView;

  
}


export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, AnyAction>

export interface State {
  userInfo: UserInfoState
  mysteryBox: MysteryBoxState
}
