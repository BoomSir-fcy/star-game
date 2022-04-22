import { bulletType, EffectConfig, EffectType, descType } from './types';

const effectConfig: EffectConfig = {
  bullet: [
    {
      name: bulletType.ICE,
      bombSpineSrc: '/assets/bullet/ice/bindog.json',
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/ice/ice.png',
      label: '冰冻',
    },
    {
      name: bulletType.ROCK,
      bombSpineSrc: '/assets/bullet/rock/yans.json',
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/rock/rock.png',
      label: '岩石',
    },
    {
      name: bulletType.BULLET,
      bombSpineSrc: '',
      bombSpriteSrc: '',
      moveSpineSrc: '/assets/bullet/bullet/zidan.json',
      moveSpriteSrc: '',
      label: '子弹',
    },
    {
      name: bulletType.CURVE_BULLET,
      bombSpineSrc: '',
      bombSpriteSrc: '',
      moveSpineSrc: '/assets/bullet/curve_bullet/quxian.json',
      moveSpriteSrc: '',
      label: '曲线子弹',
    },
    {
      name: bulletType.FIREBALL,
      // resDir: '/assets/bullet/fireball/huoqiu.json',
      // spriteRes: '/assets/bullet/fireball/fireball.png',
      bombSpineSrc: '/assets/bullet/fireball/huoqiu.json',
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/fireball/fireball.png',
      label: '火球',
    },
    {
      name: bulletType.MECHANICAL_BULLET,
      // resDir: '/assets/bullet/mechanical_bullet/jix.json',
      // spriteRes: '/assets/bullet/mechanical_bullet/mechanical_bullet.png',
      bombSpineSrc: '/assets/bullet/mechanical_bullet/jix.json',
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/mechanical_bullet/mechanical_bullet.png',
      label: '机械子弹',
    },
    {
      name: bulletType.MISSILE,
      // resDir: '/assets/bullet/missile/head/dangt.json',
      // spriteRes: '/assets/bullet/missile/head/dangt.png',
      bombSpineSrc: '/assets/bullet/missile/bom/daod.json',
      bombSpriteSrc: '',
      moveSpineSrc: '/assets/bullet/missile/head/dangt.json',
      moveSpriteSrc: '',
      label: '导弹',
    },
    {
      name: bulletType.STING,
      // resDir: '/assets/bullet/sting/jianc.json',
      // spriteRes: '/assets/bullet/sting/jianc.png',
      bombSpineSrc: '/assets/bullet/sting/jianc.json',
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '',
      label: '尖刺攻击',
    },
    {
      name: bulletType.VENOM,
      // resDir: '/assets/bullet/venom/duye.json',
      // spriteRes: '/assets/bullet/venom/venom.png',
      bombSpineSrc: '/assets/bullet/venom/duye.json',
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/venom/venom.png',
      label: '毒液攻击',
    },
    {
      name: bulletType.FIGHT,
      // resDir: '/assets/bullet/fight/jinzhan.json',
      // spriteRes: '/assets/bullet/fight/jinzhan.png',
      bombSpineSrc: '',
      bombSpriteSrc: '',
      moveSpineSrc: '/assets/bullet/fight/jinzhan.json',
      moveSpriteSrc: '',
      label: '肉搏',
    },
    {
      name: bulletType.BUMP,
      // resDir: '/assets/bullet/fight/jinzhan.json',
      // spriteRes: '/assets/bullet/fight/jinzhan.png',
      bombSpineSrc: '/assets/bullet/yan/yans.json',
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '',
      label: '碰撞',
    },
  ],

  effect: {
    [EffectType.BOMB]: {
      type: EffectType.BOMB,
      spriteSrc0: '/assets/effects/bomb.png',
      spriteSrc1: '',
    },
    [EffectType.FIRING]: {
      type: EffectType.FIRING,
      spriteSrc0: '/assets/effects/firing.png',
      spriteSrc1: '',
    },
    [EffectType.ICE]: {
      type: EffectType.ICE,
      spriteSrc0: '/assets/effects/ice.png',
      spriteSrc1: '',
    },
    [EffectType.SHIELD]: {
      type: EffectType.SHIELD,
      spriteSrc0: '/assets/effects/shield-top.png',
      spriteSrc1: '/assets/effects/shield-bottom.png',
    },
    [EffectType.STOP_MOVE]: {
      type: EffectType.STOP_MOVE,
      spriteSrc0: '/assets/effects/stop-move-bottom.png',
      spriteSrc1: '/assets/effects/stop-move-top.png',
    },
  },
};

export default effectConfig;

export const descOfEffect = {
  [descType.ADD_BOOM]: {
    effect: EffectType.BOMB,
    add: true,
    remove: false,
  },
  [descType.ADD_FIRING]: {
    effect: EffectType.FIRING,
    add: true,
    remove: false,
  },
  [descType.ADD_SHIELD]: {
    effect: EffectType.SHIELD,
    add: true,
    remove: false,
  },
  [descType.ATTACK]: {
    effect: null,
    add: false,
    remove: false,
  },
  [descType.BEAT]: {
    effect: null,
    add: false,
    remove: false,
  },
  [descType.BEAT_COLLISION]: {
    effect: null,
    add: false,
    remove: false,
  },
  [descType.BEAT_MOVE]: {
    effect: null,
    add: false,
    remove: false,
  },
  [descType.BOOM]: {
    effect: EffectType.BOMB,
    add: false,
    remove: false,
  },
  [descType.FIRING]: {
    effect: EffectType.FIRING,
    add: false,
    remove: false,
  },
  [descType.ICE_END]: {
    effect: EffectType.ICE,
    add: false,
    remove: true,
  },
  [descType.ICE_START]: {
    effect: EffectType.ICE,
    add: true,
    remove: false,
  },
  [descType.INIT]: {
    effect: null,
    add: false,
    remove: false,
  },
  [descType.MOVE]: {
    effect: null,
    add: false,
    remove: false,
  },
  [descType.REMOVE]: {
    effect: null,
    add: false,
    remove: false,
  },
  [descType.REMOVE_FIRING]: {
    effect: EffectType.FIRING,
    add: false,
    remove: true,
  },
  [descType.REMOVE_SHIELD]: {
    effect: EffectType.SHIELD,
    add: false,
    remove: true,
  },
  [descType.REMOVE_STOP_MOVE]: {
    effect: EffectType.STOP_MOVE,
    add: false,
    remove: true,
  },
  [descType.STOP_MOVE]: {
    effect: EffectType.STOP_MOVE,
    add: true,
    remove: false,
  },
};
