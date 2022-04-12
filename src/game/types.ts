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

export interface RoundInfo {
  desc_type: number;
  round: number;
  attack: RoundDescAttack;
  move: RoundDescMove;
}
