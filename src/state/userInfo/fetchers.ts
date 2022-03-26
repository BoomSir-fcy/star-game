import { Api } from "apis";
import { getUserAgentContract } from "utils/contractHelpers"

export const fetchUserView = async (account: string) => {
  try {
    const contract = getUserAgentContract();
    const res = await contract.getUserView(account);
    console.log(res, 'fetchUserView')
    return {}
  } catch (error) {
    console.error(error)
    return {}
  }
}

export const fetchInfoView = async () => {
  try {
    const contract = getUserAgentContract();
    const res = await contract.infoView();
    console.log(res, 'fetchInfoView')

    return {}
  } catch (error) {
    console.error(error);
    return {}
  }
}

export const fetchUserInfoById = async (uid: number) => {
  try {
  
    const res = await Api.UserApi.getUserInfo(uid);
    if (Api.isSuccess(res)) {
      return res.data;
    }
    return null
  } catch (error) {
    console.error(`fetch fetchUserInfoById error: ${error}`);
    return null
  }
}