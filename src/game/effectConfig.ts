import { bulletType } from './types';

const effectConfig = {
  // 冰冻
  [bulletType.ICE]: {
    name: bulletType.ICE,
    resDir: '/assets/effect/ice/bindog.json',
  },
  [bulletType.ROCK]: {
    name: bulletType.ROCK,
    resDir: '/assets/effect/rock/yans.json',
  },
};

export default effectConfig;
