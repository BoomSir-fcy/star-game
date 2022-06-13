export const events = {
  ATTACK: 'attack',
  ATTACK_END: 'attackEnd',
  MOVE: 'move',
  MOVING: 'moving',
  DEAD: 'dead',
} as const;

export type Event = typeof events[keyof typeof events];

export enum BoardState {
  DEFAULT = '#717171',
  DISABLE = '#FF0000',
  ACTIVE = '#65AEE6',
  PRE_ACTIVE = '#5EFF93',
}

export enum BoardPositionSelf {
  TOP_LEFT,
  BOTTOM_LEFT,
}

export interface RoundDescAxis {
  x: number;
  y: number;
}

export interface MapBaseUnits {
  [id: string]: Api.Game.UnitInfo;
}

export interface RoundDescMove {
  dest: RoundDescAxis[];
  id: string;
  starting_point?: RoundDescAxis;
  from?: RoundDescAxis;
}

export interface RoundDescTotalHp {
  blue_total_hp: number;
  red_total_hp: number;
}

export interface RoundS_HP {
  max_hp: number;
  max_shield: number;
  now_hp: number;
  now_shield: number;
}

export interface ReceiveChange {
  receive_id: string;
  receive_point: RoundDescAxis;
  receive_sub_hp: number;
  now_hp: number;
  now_shield: number;
  add_hp: number;
}

interface SlotBaseInfo {
  sender_id: string;
  sender_point: RoundDescAxis;
  receive_id: string;
  receive_sub_hp: number;
  now_hp: number;
  sub_shield: number;
  now_shield: number;
  max_shield: number;
  attack_crit?: boolean;
  receive_point: RoundDescAxis;
}

export interface RoundDescAttack extends SlotBaseInfo {
  receive_df: number;
  now_hp: number;
  receive_sub_hp: number;
  around: ReceiveChange[];
  sender_attack: number;
}

// 添加地形灼烧
export interface RoundDescAddTerrainFiring extends SlotBaseInfo {
  firing_hp: number;
  firing_point: RoundDescAxis;
  x: number;
  y: number;
  receive_id: string;
  receive_point: RoundDescAxis;
  sender_id: string;
  around: ReceiveChange[];
}

// 地形灼烧中
export interface RoundDescTerrainFiring extends SlotBaseInfo {
  long_round: number;
  max_hp: number;
  max_shield: number;
  now_hp: number;
  now_shield: number;
  receive_id: string;
  receive_point: RoundDescAxis;
  receive_sub_hp: number;
  terrain_firing_point: RoundDescAxis;
  around: ReceiveChange[];
}

// 添加炸弹
export interface RoundDescAddBoom extends SlotBaseInfo {
  boom_hp: number;
  long_round: number;
  around: ReceiveChange[];
  receive_sub_hp: number;
}
// 添加灼烧
export interface RoundDescAddFiring extends SlotBaseInfo {
  long_round: number;
  around: ReceiveChange[];
  receive_sub_hp: number;
}
// 正在灼烧
export interface RoundDescFiring extends SlotBaseInfo {
  long_round: number;
  around: ReceiveChange[];
  receive_sub_hp: number;
}
// 禁锢
export interface RoundDescStopMove extends SlotBaseInfo {
  long_round: number;
  receive_sub_hp: number;
  around: ReceiveChange[];
}
// 移除禁锢
export interface RoundDescRemoveStopMove extends SlotBaseInfo {
  long_round: number;
  receive_sub_hp: number;
  around: ReceiveChange[];
}
// 炸弹爆炸
export interface RoundDescBoom extends SlotBaseInfo {
  receive_sub_hp: number;
  around: ReceiveChange[];
  long_round: number;
}
// 冰冻
export interface RoundDescIceStart extends SlotBaseInfo {
  long_round: number;
  receive_sub_hp: number;
  around: ReceiveChange[];
}
// 冰冻结束
export interface RoundDescIceEnd extends SlotBaseInfo {
  long_round: number;
  receive_sub_hp: number;
  around: ReceiveChange[];
}
// 恢复
export interface RoundDescIceRestore extends SlotBaseInfo {
  long_round: number;
  receive_sub_hp: number;
  around: ReceiveChange[];
}
// 移除灼烧
export interface RoundDescRemoveFiring extends SlotBaseInfo {
  long_round: number;
  receive_sub_hp: number;
  around: ReceiveChange[];
}
// 碰撞AOE
export interface RoundDescBeat extends SlotBaseInfo {
  long_round: number;
  receive_sub_hp: number;
  detail: RoundInfo[];
}
// 净化
export interface RoundDescPurify extends SlotBaseInfo {
  long_round: number;
  receive_sub_hp: number;
  detail: RoundInfo[];
}

// 碰撞
export interface RoundDescCarshHarm extends SlotBaseInfo {
  long_round: number;
  receive_sub_hp: number;
  around: ReceiveChange[];
  receive_vhp: RoundS_HP;
  sender_vhp: RoundS_HP;
}

// 添加护盾
export interface RoundDescAddShield extends SlotBaseInfo {
  long_round: number;
  receive_sub_hp: number;
  around: ReceiveChange[];
}

// 移除护盾护盾
export interface RoundDescRemoveShield extends SlotBaseInfo {
  long_round: number;
  receive_sub_hp: number;
  around: ReceiveChange[];
}

export interface RoundDescRemove {
  receive_point: RoundDescAxis;
  receive_id: string;
}

export interface RoundDescInset {
  active_unit_pos: RoundDescAxis;
  active_unit_id: string;
  active_unit_unique_id: number;
}

export interface RoundDescBeatMove {
  move_unit: string;
  from: RoundDescAxis;
  dest: RoundDescAxis;
}

export interface RoundDescMiss {
  detail: RoundInfo[];
  receive_id: string;
  receive_point: RoundDescAxis;
  sender_id: string;
  sender_point: RoundDescAxis;
}

export type RoundDesc =
  | RoundDescAttack
  | RoundDescBoom
  | RoundDescAddBoom
  | RoundDescAddFiring
  | RoundDescFiring
  | RoundDescIceEnd
  | RoundDescStopMove
  | RoundDescIceStart
  | RoundDescCarshHarm
  | RoundDescRemoveStopMove
  | RoundDescAddTerrainFiring
  | RoundDescTerrainFiring;

export interface RoundInfo {
  desc_type: number;
  round: number;
  info: RoundDescTotalHp;
  attack: RoundDescAttack;
  move: RoundDescMove;
  add_boom: RoundDescAddBoom;
  boom: RoundDescBoom;
  firing: RoundDescFiring;
  add_firing: RoundDescAddFiring;
  ice_end: RoundDescIceEnd;
  ice_start: RoundDescIceStart;
  stop_move: RoundDescStopMove;
  remove_stop_move: RoundDescRemoveStopMove;
  unit_remove: RoundDescRemove;
  beat: RoundDescBeat;
  beat_move: RoundDescBeatMove;
  carsh_harm: RoundDescCarshHarm;
  remove_firing: RoundDescRemoveFiring;
  add_shield: RoundDescAddShield;
  sub_shield: RoundDescRemoveShield;
  add_terrain_firing: RoundDescAddTerrainFiring;
  terrain_firing: RoundDescTerrainFiring;
  unit_activing: RoundDescInset;
  purify: RoundDescPurify;
  restore: RoundDescIceRestore;
  attack_dodge: RoundDescMiss;
  attack_miss: RoundDescAttack;
}

export enum Orientation {
  TO_LEFT_DOWN,
  TO_RIGHT_UP,
  TO_LEFT_UP,
  TO_RIGHT_DOWN,
}

// DescUnitInit               // 初始化棋子
//  DescUnitMove               // 棋子移动
//  DescUnitAttack             // 棋子攻击
//  DescUnitStopMove           // 禁锢
//  DescUnitIceStart           // 冰冻开始
//  DescUnitIceEnd             // 冰冻结束
//  DescUnitAddFiring          // 添加灼烧
//  DescUnitFiring             // 正在灼烧
//  DescUnitAddBoom            // 添加炸弹
//  DescUnitBoom               // 炸弹爆炸

export const descType = {
  // 作战效果
  // INIT: 1, // 冰冻
  // BURN: 2, // 灼烧
  // REPEL: 3,
  COUNT_DOWN: -2, // 倒计时
  RUNNING_END: -1, // 运行结束
  INIT: 1, // 初始化棋子
  MOVE: 2, // 棋子移动
  ATTACK: 3, // 棋子攻击
  STOP_MOVE: 4, // 禁锢 红色方把蓝色方禁锢
  ICE_START: 5, // 冰冻开始  红色方发起攻击, 蓝色方被冰冻
  ICE_END: 6, // 冰冻结束 红色方冰冻效果解除
  ADD_FIRING: 7, // 添加灼烧 红色方向蓝色方添加灼烧效果
  FIRING: 8, // 正在灼烧 红色方被造成灼烧伤害
  ADD_BOOM: 9, // 添加炸弹 // 红色方向蓝色方
  BOOM: 10, // 炸弹爆炸
  REMOVE: 11, // 移除棋子
  BEAT: 12, // 击退
  BEAT_MOVE: 13, // 击退产生位移
  BEAT_COLLISION: 14, // 击退碰撞伤害
  REMOVE_FIRING: 15, // 解除灼烧
  REMOVE_STOP_MOVE: 16, // 解除灼烧
  ADD_SHIELD: 17, // 添加护盾
  REMOVE_SHIELD: 18, // 减少护盾
  ADD_TERRAIN_FIRING: 19, // 地形灼烧DescUnitAddTerrainFiring
  TERRAIN_FIRING: 20, // 地形引起正在灼烧DescUnitTerrainFiring
  TOTAL_INFO: 21, // 所有血量
  PURIFY: 22, // 净化
  REMOVE_BOMB: 23, // 移除炸弹
  RESTORE: 24, // 恢复生命值
  ATTACK_MISS: 25, // 攻击命中率
  ATTACK_DODGE: 26, // 攻击闪避
  INSERT_UNIT: 999, // 空降小人 被废弃
};

// 技能
export enum Skill {
  HOLD = 1, // 禁锢
  FREEZE = 2, // 冰冻
  BURN = 3, // 灼烧
  BOMB = 4,
  SHIELD = 5,
}

export const bulletType = {
  ICE: 'ice', // 冰块
  ROCK: 'rock', // 岩石
  BULLET: 'bullet', // 子弹
  CURVE_BULLET: 'curve_bullet', // 曲线子弹
  FIREBALL: 'fireball', // 火球
  FIRING: 'firing', // 火焰灼烧
  MECHANICAL_BULLET: 'mechanical_bullet', // 机械子弹
  MISSILE: 'missile', // 导弹
  MISSILE_BOOM: 'missile_boom', // 导弹爆炸
  STING: 'sting', // 尖刺攻击
  VENOM: 'venom', // 毒液攻击
  FIGHT: 'fight', // 肉搏
  DRAGON: 'dragon', // 岩石
  BUMP: 'bump', // 碰撞
  SHIELD: 'shield', // 护盾
  STOP_MOVE: 'stop_move', // 禁锢
  BOMB: 'bomb', // 炸弹
  ADD_BOMB: 'add_bomb', // 添加炸弹
  ADD_TERRAIN_FIRING: 'add_terrain_firing', // 添加地形灼烧
  TERRAIN_FIRING: 'terrain_firing', // 地形灼烧中
  RESTORE: 'restore', // 治疗
  PURIFY: 'purify', // 净化
  LEIDIAN: 'leidian', // 雷电
  CHUANTOU: 'chuantou', // 穿透
  JINZHAN: 'jinzhan', // 穿透
  TEST: 'test', // 穿透
  THROUGH: 'through', // 穿透
  DAODAN: 'daodan', // 导弹
  FENG: 'feng', // 水桶
  V_ATTACK: 'vAttack', // v 字形攻击
  V_ATTACK_2: 'vAttack2', // v 字形攻击
};
export type BulletType = typeof bulletType[keyof typeof bulletType];

export interface BulletItemInfoOfConfig {
  name: BulletType;
  bombSpriteSrc?: string;
  bombSpineSrc?: string;
  startSpineSrc?: string;
  bombSpine?: BulletType;
  moveSpine?: BulletType;
  moveSpriteSrc?: string;
  moveSpineSrc?: string;
  label?: string;
  flip?: boolean;
}

// 技能
export enum EffectType {
  STOP_MOVE = 'stopMove', // 禁锢
  ICE = 'ice', // 冰冻
  FIRING = 'firing', // 灼烧
  ADD_FIRING = 'addFiring', // 添加灼烧
  BOMB = 'bomb', // 炸弹
  SHIELD = 'shield', // 护盾
  VENOM = 'venom', // 毒液
  RESTORE = 'restore', // 治疗
}

export interface EffectItemInfoOfConfig {
  type: EffectType;
  spriteSrc0: string;
  spriteSrc1?: string;
}

export interface EffectConfig {
  bullet: BulletItemInfoOfConfig[];
  effect: {
    [key in EffectType]: EffectItemInfoOfConfig;
  };
}

export type DescType = typeof descType[keyof typeof descType];

// get soldierMove(): number {
//   return this._soldierMove * this.base;
// }

// private _bulletLinear = 3;

// get bulletLinear() {
//   return this._bulletLinear * this.base;
// }

// private _bulletParabola = 60;

// get bulletParabola() {
//   return this._bulletParabola * this.base;
// }

// private _update = 0.016666666666;

// get update() {
//   return this._update * this.base;
// }

// private _collision = 10;

// get collision() {
//   return this._collision * this.base;
// }
export enum SpeederType {
  SOLDIER_MOVE = 'soldierMove',
  BULLET_LINEAR = 'bulletLinear',
  BULLET_PARABOLA = 'bulletParabola',
  UPDATE = 'update',
  COLLECTION = 'collision',
  SOLDIER_CREATE = 'soldierCreated',
}

export enum TipsTextType {
  NORMAL, // 普通
  CRIT, // 暴击
  RESTORE, // 治疗
}

export enum SoldierMoveType {
  WALK, // 步行
  FLYING, // 飞飞
  BE_MOVED, // 被迫移动 如击退等
}
