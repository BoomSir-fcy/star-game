import { bulletType, EffectConfig } from './types';

const effectConfig: EffectConfig = {
  effects: [
    {
      name: bulletType.ICE,
      resDir: '/assets/effect/ice/bindog.json',
      spriteRes: '/assets/effect/ice/ice.png',
    },
    {
      name: bulletType.ROCK,
      resDir: '/assets/effect/rock/yans.json',
      spriteRes: '/assets/effect/rock/rock.png',
    },
  ],
};

export default effectConfig;
