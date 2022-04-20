export enum ResponseCode {
  CUSTOM_SUCCESS = 1,
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  NOTFOUNTUSER = 403,
  INSUFFICIENT_BALANCE = 20110,
  SIGININVERIFY = 20108,
  USER_INSUFFICIENT_BALANCE = 30_011_002,
  TASK_SIGN_IN = 30_013_002,
  ADD_POST_VERIFY = 30_004_019,
  ADD_POST_VERIFY_ERROR = 30_004_020,
  TRIBE_FILE_MEMBER_ERROR = 30_016_020,
  PLANET_STRENGTHEN_NOT_RECORD = 200011,
  PLANET_UPGRADE_FAIL = 200012,
}
