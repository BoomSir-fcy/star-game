export const getPlanetRarity = (rarity: number) => {
  let myRarity = '';
  switch (rarity) {
    case 1:
      myRarity = 'rarity-1';
      break;
    case 2:
      myRarity = 'rarity-2';
      break;
    case 3:
      myRarity = 'rarity-3';
      break;
    case 4:
      myRarity = 'rarity-4';
      break;
    case 5:
      myRarity = 'rarity-5';
      break;
    case 6:
      myRarity = 'rarity-6';
      break;
    default:
      myRarity = 'rarity-1';
      break;
  }
  return myRarity;
};
