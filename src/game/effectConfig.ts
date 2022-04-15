import { bulletType, EffectConfig } from './types';

const effectConfig: EffectConfig = {
  effects: [
    {
      name: bulletType.ICE,
      resDir: '/assets/effect/ice/bindog.json',
      spriteRes: '/assets/effect/ice/ice.png',
      label: '冰冻',
    },
    {
      name: bulletType.ROCK,
      resDir: '/assets/effect/rock/yans.json',
      spriteRes: '/assets/effect/rock/rock.png',
      label: '岩石',
    },
    {
      name: bulletType.BULLET,
      resDir: '/assets/effect/bullet/zidan.json',
      spriteRes: '/assets/effect/bullet/zidan.png',
      label: '子弹',
    },
    {
      name: bulletType.CURVE_BULLET,
      resDir: '/assets/effect/curve_bullet/quxian.json',
      spriteRes: '/assets/effect/curve_bullet/quxian.png',
      label: '曲线子弹',
    },
    {
      name: bulletType.FIREBALL,
      resDir: '/assets/effect/fireball/huoqiu.json',
      spriteRes: '/assets/effect/fireball/fireball.png',
      label: '火球',
    },
    {
      name: bulletType.MECHANICAL_BULLET,
      resDir: '/assets/effect/mechanical_bullet/jix.json',
      spriteRes: '/assets/effect/mechanical_bullet/jx.png',
      label: '机械子弹',
    },
    {
      name: bulletType.MISSILE,
      resDir: '/assets/effect/missile/head/dangt.json',
      spriteRes: '/assets/effect/missile/head/dangt.png',
      label: '导弹',
    },
    {
      name: bulletType.MISSILE_BOOM,
      resDir: '/assets/effect/missile/bom/daod.json',
      spriteRes: '/assets/effect/missile/bom/daod.png',
      label: '导弹爆炸',
    },
    {
      name: bulletType.STING,
      resDir: '/assets/effect/sting/jianc.json',
      spriteRes: '/assets/effect/sting/jianc.png',
      label: '尖刺攻击',
    },
    {
      name: bulletType.VENOM,
      resDir: '/assets/effect/venom/duye.json',
      spriteRes: '/assets/effect/venom/venom.png',
      label: '毒液攻击',
    },
    {
      name: bulletType.FIGHT,
      resDir: '/assets/effect/fight/jinzhan.json',
      spriteRes: '/assets/effect/fight/jinzhan.png',
      label: '肉搏',
    },
  ],
};

export default effectConfig;
