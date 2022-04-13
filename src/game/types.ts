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
export interface RoundDescMove {
  dest: RoundDescAxis[];
  id: string;
  starting_point: RoundDescAxis;
}

export interface RoundDescAttack {
  receive_df: number;
  receive_id: string;
  receive_point: RoundDescAxis;
  receive_sub_hp: number;
  sender_attack: number;
  sender_id: string;
  sender_point: RoundDescAxis;
}

// 添加炸弹
export interface RoundDescAddBoom {
  boom_hp: number;
  long_round: number;
  receive_id: string;
  receive_sub_hp: number;
  sender_id: string;
  sender_point: RoundDescAxis;
  receive_point: RoundDescAxis;
}
// 添加灼烧
export interface RoundDescAddFiring {
  long_round: number;
  receive_id: string;
  receive_sub_hp: number;
  sender_id: string;
  sender_point: RoundDescAxis;
  receive_point: RoundDescAxis;
}
// 正在灼烧
export interface RoundDescFiring {
  long_round: number;
  receive_id: string;
  sender_id: string;
  receive_sub_hp: number;
  sender_point: RoundDescAxis;
  receive_point: RoundDescAxis;
}
// 禁锢
export interface RoundDescStopMove {
  long_round: number;
  receive_id: string;
  sender_id: string;
  receive_sub_hp: number;
  sender_point: RoundDescAxis;
  receive_point: RoundDescAxis;
}
// 炸弹爆炸
export interface RoundDescBoom {
  receive_sub_hp: number;
  long_round: number;
  receive_id: string;
  sender_id: string;
  sender_point: RoundDescAxis;
  receive_point: RoundDescAxis;
}
// 冰冻
export interface RoundDescIceStart {
  long_round: number;
  sender_point: RoundDescAxis;
  receive_point: RoundDescAxis;
  receive_sub_hp: number;
  receive_id: string;
  sender_id: string;
}
// 冰冻结束
export interface RoundDescIceEnd {
  sender_point: RoundDescAxis;
  receive_point: RoundDescAxis;
  long_round: number;
  receive_sub_hp: number;
  receive_id: string;
  sender_id: string;
}

export type RoundDesc =
  | RoundDescAttack
  | RoundDescBoom
  | RoundDescAddBoom
  | RoundDescAddFiring
  | RoundDescFiring
  | RoundDescIceEnd
  | RoundDescStopMove
  | RoundDescIceStart;

export interface RoundInfo {
  desc_type: number;
  round: number;
  attack: RoundDescAttack;
  move: RoundDescMove;
  add_boom: RoundDescAddBoom;
  boom: RoundDescBoom;
  firing: RoundDescFiring;
  add_firing: RoundDescAddFiring;
  ice_end: RoundDescIceEnd;
  ice_start: RoundDescIceStart;
  stop_move: RoundDescStopMove;
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

export const effectType = {
  // 作战效果
  // INIT: 1, // 冰冻
  // BURN: 2, // 灼烧
  // REPEL: 3,
  INIT: 1, // 初始化棋子
  MOVE: 2, // 棋子移动
  ATTACK: 3, // 棋子攻击
  STOP_MOVE: 4, // 禁锢
  ICE_START: 5, // 冰冻开始
  ICE_END: 6, // 冰冻结束
  ADD_FIRING: 7, // 添加灼烧
  FIRING: 8, // 正在灼烧
  ADD_BOOM: 9, // 添加炸弹
  BOOM: 10, // 炸弹爆炸
};

// 技能
export enum Skill {
  HOLD = 1, // 禁锢
  FREEZE = 2, // 冰冻
  BURN = 3, // 灼烧
  BOMB = 4,
  SHIELD = 5,
}

export type EffectType = typeof effectType[keyof typeof effectType];
