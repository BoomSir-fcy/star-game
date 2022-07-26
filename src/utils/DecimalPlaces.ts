export const SubString_1 = (value, bit = 2) => {
  if (!value) return '';
  let str = value.toString();
  const strIndex = str.indexOf('.');
  if (strIndex === -1) return str;
  str = str.substring(0, strIndex + bit);
  return str;
};
