import { bulletType, EffectConfig, EffectType, descType } from './types';

const effectConfig: EffectConfig = {
  bullet: [
    {
      name: bulletType.ICE,
      bombSpine: bulletType.ICE,
      // moveSpine: ,
      bombSpineSrc: '/assets/bullet/ice/bindog.json',
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/ice/ice.png',
      label: '冰冻',
    },
    {
      name: bulletType.ROCK,
      bombSpineSrc: '/assets/bullet/rock/yans.json',
      bombSpine: bulletType.ROCK,
      // moveSpine: ,
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/rock/rock.png',
      label: '岩石',
      flip: true,
    },
    {
      name: bulletType.BULLET,
      // bombSpine: bulletType.ROCK,
      moveSpine: bulletType.BULLET,
      bombSpineSrc: '',
      bombSpriteSrc: '',
      moveSpineSrc: '/assets/bullet/bullet/zidan.json',
      moveSpriteSrc: '',
      label: '子弹',
    },
    {
      name: bulletType.CURVE_BULLET,
      // bombSpine: bulletType.ROCK,
      moveSpine: bulletType.CURVE_BULLET,
      bombSpineSrc: '',
      bombSpriteSrc: '',
      moveSpineSrc: '/assets/bullet/curve_bullet/quxian.json',
      moveSpriteSrc: '',
      label: '曲线子弹',
    },
    {
      name: bulletType.FIREBALL,
      bombSpine: bulletType.FIREBALL,
      // moveSpine: bulletType.CURVE_BULLET,
      bombSpineSrc: '/assets/bullet/fireball/huoqiu.json',
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/fireball/fireball.png',
      label: '火球',
      flip: true,
    },
    {
      name: bulletType.FIRING,
      bombSpineSrc: '',
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/fireball/fireball.png',
      label: '火焰灼烧',
    },
    {
      name: bulletType.MECHANICAL_BULLET,
      // resDir: '/assets/bullet/mechanical_bullet/jix.json',
      // spriteRes: '/assets/bullet/mechanical_bullet/mechanical_bullet.png',
      bombSpineSrc: '/assets/bullet/mechanical_bullet/jix.json',
      bombSpine: bulletType.MECHANICAL_BULLET,
      // moveSpine: bulletType.CURVE_BULLET,
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/mechanical_bullet/mechanical_bullet.png',
      label: '机械子弹',
    },
    {
      name: bulletType.ADD_BOMB,
      bombSpineSrc: '',
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/bomb/bomb.png',
      label: '炸弹',
    },
    {
      name: bulletType.BOMB,
      bombSpineSrc: '/assets/bullet/bomb/zhadan.json',
      bombSpine: bulletType.BOMB,
      // moveSpine: bulletType.CURVE_BULLET,
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '',
      label: '炸弹爆炸',
    },
    {
      name: bulletType.LEIDIAN,
      bombSpineSrc: '/assets/bullet/leidian/leidian.json',
      bombSpine: bulletType.LEIDIAN,
      moveSpine: bulletType.LEIDIAN,
      bombSpriteSrc: '',
      moveSpineSrc: '/assets/bullet/leidian/leidian.json',
      moveSpriteSrc: '',
      label: '闪电',
    },
    {
      name: bulletType.CHUANTOU,
      bombSpineSrc: '/assets/bullet/chuantou/chuantou.json',
      bombSpine: bulletType.CHUANTOU,
      moveSpine: bulletType.CHUANTOU,
      bombSpriteSrc: '',
      moveSpineSrc: '/assets/bullet/chuantou/chuantou.json',
      moveSpriteSrc: '',
      label: '穿透',
    },
    {
      name: bulletType.JINZHAN,
      bombSpineSrc: '/assets/bullet/leidian/leidian.json',
      bombSpine: bulletType.LEIDIAN,
      moveSpine: bulletType.JINZHAN,
      bombSpriteSrc: '',
      moveSpineSrc: '/assets/bullet/jinzhan/jinzhan.json',
      moveSpriteSrc: '',
      label: '近战',
    },
    {
      name: bulletType.MISSILE,
      // resDir: '/assets/bullet/missile/head/dangt.json',
      // spriteRes: '/assets/bullet/missile/head/dangt.png',
      bombSpineSrc: '/assets/bullet/missile/bom/daod.json',
      bombSpine: bulletType.MISSILE,
      moveSpine: bulletType.MISSILE_BOOM,
      bombSpriteSrc: '',
      moveSpineSrc: '/assets/bullet/missile/head/dangt.json',
      moveSpriteSrc: '',
      label: '导弹',
    },
    {
      name: bulletType.TEST,
      bombSpineSrc: '/assets/bullet/test/test.json',
      bombSpine: bulletType.TEST,
      moveSpine: bulletType.TEST,
      bombSpriteSrc: '',
      moveSpineSrc: '/assets/bullet/test/test.json',
      moveSpriteSrc: '',
      label: 'TEST',
    },
    {
      name: bulletType.STING,
      // resDir: '/assets/bullet/sting/jianc.json',
      // spriteRes: '/assets/bullet/sting/jianc.png',
      bombSpineSrc: '/assets/bullet/sting/jianc.json',
      bombSpine: bulletType.STING,
      // moveSpine: bulletType.MISSILE_BOOM,
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
      bombSpine: bulletType.VENOM,
      // moveSpine: bulletType.MISSILE_BOOM,
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/venom/venom.png',
      label: '毒液攻击',
    },
    {
      name: bulletType.FIGHT,
      // resDir: '/assets/bullet/fight/jinzhan.json',
      // spriteRes: '/assets/bullet/fight/jinzhan.png',
      // bombSpine: bulletType.VENOM,
      moveSpine: bulletType.FIGHT,
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
      bombSpine: bulletType.BUMP,
      // moveSpine: bulletType.FIGHT,
      bombSpriteSrc: '',
      moveSpineSrc: '',
      flip: true,
      moveSpriteSrc: '',
      label: '碰撞',
    },
    {
      name: bulletType.SHIELD,
      bombSpineSrc: '/assets/bullet/shield/hudun.json',
      bombSpine: bulletType.SHIELD,
      // moveSpine: bulletType.FIGHT,
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/shield/shield.png',
      label: '护盾',
    },
    {
      name: bulletType.STOP_MOVE,
      bombSpineSrc: '',
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/hold/hold.png',
      label: '禁锢',
    },
    {
      name: bulletType.RESTORE,
      bombSpineSrc: '',
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/restore/restore.png',
      label: '治疗',
    },
    {
      name: bulletType.PURIFY,
      bombSpineSrc: '/assets/bullet/purify/jinghua.json',
      bombSpine: bulletType.PURIFY,
      bombSpriteSrc: '',
      moveSpineSrc: '',
      moveSpriteSrc: '/assets/bullet/purify/purify.png',
      label: '净化',
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
      spriteSrc0: '/assets/effects/firing-animate-1.png',
      spriteSrc1: '/assets/effects/firing-animate-2.png',
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
    [EffectType.VENOM]: {
      type: EffectType.VENOM,
      spriteSrc0: '/assets/effects/venom-animate-1.png',
      spriteSrc1: '/assets/effects/venom-animate-2.png',
    },
    [EffectType.ADD_FIRING]: {
      type: EffectType.ADD_FIRING,
      spriteSrc0: '/assets/effects/firing-animate-1.png',
      spriteSrc1: '/assets/effects/firing-animate-2.png',
    },
    [EffectType.RESTORE]: {
      type: EffectType.RESTORE,
      spriteSrc0: '/assets/effects/restore.png',
      spriteSrc1: '',
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
    effect: EffectType.ADD_FIRING,
    add: true,
    remove: false,
  },
  [descType.ADD_SHIELD]: {
    effect: null,
    add: false,
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
    remove: true,
  },
  [descType.FIRING]: {
    effect: EffectType.FIRING,
    add: true,
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
    effect: EffectType.ADD_FIRING,
    add: false,
    remove: true,
  },
  [descType.REMOVE_SHIELD]: {
    effect: null,
    add: false,
    remove: false,
  },
  [descType.RESTORE]: {
    effect: EffectType.RESTORE,
    add: true,
    remove: false,
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
  [descType.ADD_TERRAIN_FIRING]: {
    effect: EffectType.ADD_FIRING,
    add: true,
    remove: false,
  },
  [descType.TERRAIN_FIRING]: {
    effect: EffectType.FIRING,
    add: true,
    remove: false,
  },
  [descType.ATTACK_DODGE]: {
    effect: null,
    add: false,
    remove: false,
  },
  [descType.ATTACK_MISS]: {
    effect: null,
    add: false,
    remove: false,
  },
};

export const spines = [
  {
    name: bulletType.ICE,
    src: '/assets/bullet/ice/bindog.json',
  },
  {
    name: bulletType.ROCK,
    src: '/assets/bullet/rock/yans.json',
  },
  {
    name: bulletType.BULLET,
    src: '/assets/bullet/bullet/zidan.json',
  },
  {
    name: bulletType.CURVE_BULLET,
    src: '/assets/bullet/curve_bullet/quxian.json',
  },
  {
    name: bulletType.FIREBALL,
    src: '/assets/bullet/fireball/huoqiu.json',
  },
  {
    name: bulletType.MECHANICAL_BULLET,
    src: '/assets/bullet/mechanical_bullet/jix.json',
  },
  {
    name: bulletType.BOMB,
    src: '/assets/bullet/bomb/zhadan.json',
  },
  {
    name: bulletType.MISSILE,
    src: '/assets/bullet/missile/bom/dangt.json',
  },
  {
    name: bulletType.MISSILE_BOOM,
    src: '/assets/bullet/missile/bom/daod.json',
  },
  {
    name: bulletType.STING,
    src: '/assets/bullet/sting/jianc.json',
  },
  {
    name: bulletType.VENOM,
    src: '/assets/bullet/venom/duye.json',
  },
  {
    name: bulletType.FIGHT,
    src: '/assets/bullet/fight/jinzhan.json',
  },
  {
    name: bulletType.BUMP,
    src: '/assets/bullet/yan/yans.json',
  },
  {
    name: bulletType.SHIELD,
    src: '/assets/bullet/shield/hudun.json',
  },
  {
    name: bulletType.PURIFY,
    src: '/assets/bullet/purify/jinghua.json',
  },
  {
    name: bulletType.LEIDIAN,
    src: '/assets/bullet/leidian/leidian.json',
  },
  {
    name: bulletType.CHUANTOU,
    src: '/assets/bullet/chuantou/chuantou.json',
  },
  {
    name: bulletType.JINZHAN,
    src: '/assets/bullet/jinzhan/jinzhan.json',
  },
  {
    name: bulletType.TEST,
    src: '/assets/bullet/test/test.json',
  },
];
