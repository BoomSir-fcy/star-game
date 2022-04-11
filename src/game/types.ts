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
