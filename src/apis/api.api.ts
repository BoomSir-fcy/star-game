import { UserApi } from './User';
import { GalaxyApi } from './Galaxy';
import { BalanceApi } from './balance';

const isSuccess = (res: Api.Error) => {
  return res && res.code === 0;
};

export const Api = {
  isSuccess,
  UserApi: new UserApi(),
  GalaxyApi: new GalaxyApi(),
  BalanceApi: new BalanceApi(),
};
