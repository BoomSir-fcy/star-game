import { BoardPositionSelf } from './types';

const config = {
  WIDTH: 900,
  HEIGHT: 900,
  resolution: 1,

  boardWidth: 100,
  boardHeight: 100,

  boardsWSize: 8,
  boardsHSize: 8,

  BOARDS_ROW_COUNT: 8,
  BOARDS_COL_COUNT: 8,

  OFFSET_START_X: 0, // (0, 0) 坐标X轴偏移量
  OFFSET_START_Y: -300, // (0, 0) 坐标Y轴偏移量

  BOARD_POSITION_SELF: BoardPositionSelf.TOP_LEFT, // 自己棋盘的位置
  
  SCALE_BASE: 0.2,
  MAX_SCALE: 1.5,
  MIN_SCALE: 0.5,

  BLOOD_PER: 100, // 每格血条代表多少血量
  BLOOD_COLOR: 0X32ff32, // 血条颜色
  BLOOD_COLOR_ENEMY: 0Xb22323, // 敌方血条颜色
  BLOOD_COLOR_BACK: 0X000000, // 空血的血条颜色
  BLOOD_WIDTH: 80,


}

export default config;
