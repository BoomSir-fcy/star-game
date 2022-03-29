import { Api } from "apis";
import { UserAgentInfoView, UserInfoView } from "state/types";
import { getUserAgentAddress } from "utils/addressHelpers";
import { getBep20Contract, getUserAgentContract } from "utils/contractHelpers"

export const fetchUserView = async (account: string): Promise<UserInfoView|null> => {
  try {
    const contract = getUserAgentContract();
    const res = await contract.getUserView(account);
    return {
      nickname: res.nickname,
      nftAddress: res.nftAddress,
      tokenId: Number(res.tokenId.toJSON().hex),
      isActive: res.isAcctive,
      superior: res.superior,
    }
  } catch (error) {
    console.error(error)
    return null;
  }
}

export const fetchInfoView = async (account: string): Promise<UserAgentInfoView|null> => {
  try {
    const contract = getUserAgentContract();
    const res = await contract.infoView();

    return {
      avatarNft_: res.avatarNft_, // 头像nft的合约地址
      payToken_: res.payToken_, // 要支付的token的合约地址
      userProfile_: res.userProfile_, // 用户信息合约地址
      price_: res.price_.toJSON().hex, // 价格
      createdCount_: res.createdCount_.toJSON().hex, // 已创建数量
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const fetchUserInfoById = async (uid: number): Promise<Api.User.UserInfo|null> => {
  try {
  
    const res = await Api.UserApi.getUserInfo(uid);
    if (Api.isSuccess(res)) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error(`fetch fetchUserInfoById error: ${error}`);
    return null;
  }
}
export const fetchUserInfoByAccount = async (account: string): Promise<Api.User.UserInfo|null> => {
  try {
  
    const res = await Api.UserApi.getUserInfoByAccount(account);
    if (Api.isSuccess(res)) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error(`fetch fetchUserInfoById error: ${error}`);
    return null;
  }
}

export const fetchAllowance = async (account: string, token: string) => {
  try {
    const erc20Contract = getBep20Contract(token);
    const allowance = await erc20Contract.allowance(account, getUserAgentAddress());
    return allowance.toJSON().hex;
  } catch (error) {
    console.error(error)
    return '0';
  }
}
