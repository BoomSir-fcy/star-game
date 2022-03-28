export enum CheckNickNameState {
  NULL_NAME,
  SHORT_NAME,
  LONG_NAME,
  BAD_NAME_WITH_CONTRACT, // 合约检测不通过
  EXACT_NAME, // 正确的名字
}