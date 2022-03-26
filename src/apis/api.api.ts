import { UserApi } from './User';

const isSuccess = (res: Api.Error) => {
  return res && res.code === 1;
};

export const Api = {
  isSuccess,
  UserApi: new UserApi(),
};
