import { UserApi } from './User';
import { PlanetApi } from './Planet';

const isSuccess = (res: Api.Error) => {
  return res && res.code === 0;
};

export const Api = {
  isSuccess,
  UserApi: new UserApi(),
  PlanetApi: new PlanetApi(),
};
