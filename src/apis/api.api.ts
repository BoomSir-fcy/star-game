import { UserApi } from './User';
import { GalaxyApi } from './Galaxy';
import { BalanceApi } from './balance';
import { PlanetApi } from './Planet';
import { AllianceApi } from './alliance';

const isSuccess = (res: Api.Error) => {
  return res && res.code === 0;
};

export const Api = {
  isSuccess,
  UserApi: new UserApi(),
  GalaxyApi: new GalaxyApi(),
  BalanceApi: new BalanceApi(),
  PlanetApi: new PlanetApi(),
  AllianceApi: new AllianceApi(),
};
