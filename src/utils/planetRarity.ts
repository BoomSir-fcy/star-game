export const getPlanetRarity = (rarity: number) => {
  let myRarity = '';
  switch (rarity) {
    case 1:
      myRarity = '普通';
      break;
    case 2:
      myRarity = '良好';
      break;
    case 3:
      myRarity = '稀有';
      break;
    case 4:
      myRarity = '史诗';
      break;
    case 5:
      myRarity = '传说';
      break;
    case 6:
      myRarity = '神话';
      break;
    default:
      myRarity = '普通';
      break;
  }
  return myRarity;
};
