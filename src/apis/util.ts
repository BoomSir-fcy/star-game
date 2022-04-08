export const isSuccess = (res: Api.Error) => {
  return res && res.code === 0;
}
