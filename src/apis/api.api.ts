import { UserApi } from './User';
import { BalanceApi } from './balance';
import { PlanetApi } from './Planet';

const isSuccess = (res: Api.Error) => {
  return res && res.code === 0;
};

export const Api = {
  isSuccess,
  UserApi: new UserApi(),
  BalanceApi: new BalanceApi(),
  PlanetApi: new PlanetApi(),
};
