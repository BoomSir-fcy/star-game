export const sliceByLevels = (list = [], sliceLen = 10) => {
  const newList = [];
  const len = list.length;
  for (let i = 0; i < len; i += sliceLen) {
    const startIndex = i + 1;
    const endIndex = i + sliceLen > len ? len : i + sliceLen;
    newList.push({
      id: startIndex,
      label: `恒星:Lv${startIndex}~${endIndex}`,
      levels: list.slice(i, endIndex),
    });
  }

  return newList;
};
