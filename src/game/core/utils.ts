// import { Point, Container, Graphics } from 'pixi.js';
import { Container } from '@pixi/display';
import { Point } from '@pixi/math';
import { raceData } from 'config/raceConfig';
import { DescType, descType, Skill } from 'game/types';

export function onDragStart(this: any, event: any) {
  // store a reference to the data
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  this.data = event.data;
  this.alpha = 0.5;
  this.dragging = true;
  // this.filters = [outlineFilterRed];
}

export function onDragEnd(this: any) {
  this.alpha = 1;
  this.dragging = false;
  // set the interaction data to null
  this.data = null;

  // this.filters = [];
}

export function onDragMove(this: any) {
  if (this.dragging) {
    const newPosition = this?.data?.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;
  }
}

export function hitTestRectangle(r1: Container, r2: Container) {
  // Define the variables we'll need to calculate
  let hit = false;

  // hit will determine whether there's a collision
  hit = false;

  // Find the center points of each sprite
  const r1centerX = r1.x + r1.width / 2;
  const r1centerY = r1.y + r1.height / 2;
  const r2centerX = r2.x + r2.width / 2;
  const r2centerY = r2.y + r2.height / 2;

  // Find the half-widths and half-heights of each sprite
  const r1halfWidth = r1.width / 2;
  const r1halfHeight = r1.height / 2;
  const r2halfWidth = r2.width / 2;
  const r2halfHeight = r2.height / 2;

  // Calculate the distance vector between the sprites
  const vx = r1centerX - r2centerX;
  const vy = r1centerY - r2centerY;

  // Figure out the combined half-widths and half-heights
  const combinedHalfWidths = r1halfWidth + r2halfWidth;
  const combinedHalfHeights = r1halfHeight + r2halfHeight;

  // Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    // A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      // There's definitely a collision happening
      hit = true;
    } else {
      // There's no collision on the y axis
      hit = false;
    }
  } else {
    // There's no collision on the x axis
    hit = false;
  }

  // `hit` will be either `true` or `false`
  return hit;
}

export function hitTestPoint(r1: Point, r2: Container) {
  // Define the variables we'll need to calculate
  let hit = false;

  // hit will determine whether there's a collision
  hit = false;

  // Find the center points of each sprite
  const r1centerX = r1.x;
  const r1centerY = r1.y;
  const r2centerX = r2.x + r2.width / 2;
  const r2centerY = r2.y + r2.height / 2;

  // Find the half-widths and half-heights of each sprite
  const r1halfWidth = 1;
  const r1halfHeight = 1;
  const r2halfWidth = r2.width / 2;
  const r2halfHeight = r2.height / 2;

  // Calculate the distance vector between the sprites
  const vx = r1centerX - r2centerX;
  const vy = r1centerY - r2centerY;

  // Figure out the combined half-widths and half-heights
  const combinedHalfWidths = r1halfWidth + r2halfWidth;
  const combinedHalfHeights = r1halfHeight + r2halfHeight;

  // Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    // A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      // There's definitely a collision happening
      hit = true;
    } else {
      // There's no collision on the y axis
      hit = false;
    }
  } else {
    // There's no collision on the x axis
    hit = false;
  }

  // `hit` will be either `true` or `false`
  return hit;
}

/**
 * @dev 点和多边形的碰撞检测
 * @param point 检测的点的坐标
 * @param points 多边形的顶点坐标
 * @returns 是否碰撞
 */
export function checkPolygonPoint(point: Point, points: Point[]) {
  let collision = false;
  const pointsLen = points.length;
  const { x: px, y: py } = point;

  for (let index = 0; index < pointsLen; index++) {
    const currentPoint = points[index];
    const next = index === pointsLen - 1 ? 0 : index + 1;
    const nextPoint = points[next];
    const { x: cx, y: cy } = currentPoint;
    const { x: nx, y: ny } = nextPoint;
    const judgeX = px < ((nx - cx) * (py - cy)) / (ny - cy) + cx;
    const judgeY = (cy >= py && ny < py) || (cy < py && ny >= py);
    if (judgeX && judgeY) {
      collision = !collision;
    }
  }

  return collision;
}

// // 1 禁锢， 2冰冻，3灼烧，4定时炸弹， 5护盾
// enum Skill {
//   HOLD = 1, // 禁锢
//   FREEZE = 2, // 冰冻
//   BURN = 3, // 灼烧
//   BOMB = 4,
//   SHIELD = 5,
// }
export const getSkillText = (skill?: Skill) => {
  if (skill === Skill.HOLD) return '禁锢';
  if (skill === Skill.FREEZE) return '冰冻';
  if (skill === Skill.BURN) return '灼烧';
  if (skill === Skill.BOMB) return '炸弹';
  if (skill === Skill.SHIELD) return '护盾';

  return '';
};

export const getEffectText = (effect?: DescType) => {
  if (effect === descType.ATTACK) return '攻击';
  if (effect === descType.STOP_MOVE) return '禁锢';
  if (effect === descType.ICE_END) return '冰冻结束';
  if (effect === descType.FIRING) return '灼烧中';
  if (effect === descType.BOOM) return '爆炸';
  if (effect === descType.ICE_START) return '冰冻';
  if (effect === descType.ADD_FIRING) return '灼烧';
  if (effect === descType.ADD_BOOM) return '炸弹';
  if (effect === descType.REMOVE_FIRING) return '灭火';
  if (effect === descType.ADD_SHIELD) return '护盾';
  if (effect === descType.REMOVE_SHIELD) return '减少护盾';
  if (effect === descType.REMOVE_STOP_MOVE) return '解除禁锢';
  if (effect === descType.ADD_TERRAIN_FIRING) return '地形灼烧';
  if (effect === descType.TERRAIN_FIRING) return '地形灼烧中';
  if (effect === descType.PURIFY) return '净化';
  if (effect === descType.RESTORE) return '治疗';
  if (effect === descType.ATTACK_DODGE) return '闪避';
  if (effect === descType.ATTACK_MISS) return '未命中';
  return '未知';
};

export const getEffectDescText = (effect?: DescType) => {
  if (effect === descType.ATTACK) return '攻击造成';
  if (effect === descType.STOP_MOVE) return '产生禁锢';
  if (effect === descType.ICE_END) return '解除冰冻';
  if (effect === descType.FIRING) return '被造成灼烧';
  if (effect === descType.BOOM) return '炸弹爆炸,造成';
  if (effect === descType.ICE_START) return '冰冻';
  if (effect === descType.ADD_FIRING) return '添加灼烧';
  if (effect === descType.ADD_BOOM) return '放置炸弹';
  if (effect === descType.REMOVE_FIRING) return '发动灭火';
  if (effect === descType.ADD_SHIELD) return '添加护盾';
  if (effect === descType.REMOVE_SHIELD) return '减少护盾';
  if (effect === descType.REMOVE_STOP_MOVE) return '解除禁锢';
  if (effect === descType.ADD_TERRAIN_FIRING) return '产生地形灼烧';
  if (effect === descType.TERRAIN_FIRING) return '灼烧造成';
  return '未知';
};
export const getEffectDescTypeText = (effect?: DescType) => {
  if (effect === descType.ATTACK) return '伤害';
  if (effect === descType.STOP_MOVE) return '效果';
  if (effect === descType.ICE_END) return '效果';
  if (effect === descType.FIRING) return '伤害';
  if (effect === descType.BOOM) return '伤害';
  if (effect === descType.ICE_START) return '效果';
  if (effect === descType.ADD_FIRING) return '效果';
  if (effect === descType.ADD_BOOM) return '伤害';
  if (effect === descType.REMOVE_FIRING) return '效果';
  if (effect === descType.ADD_SHIELD) return '';
  if (effect === descType.REMOVE_SHIELD) return '';
  if (effect === descType.REMOVE_STOP_MOVE) return '效果';
  if (effect === descType.ADD_TERRAIN_FIRING) return '效果';
  if (effect === descType.TERRAIN_FIRING) return '伤害';
  return '未知';
};

// INIT: 1, // 初始化棋子
// MOVE: 2, // 棋子移动
// ATTACK: 3, // 棋子攻击
// STOP_MOVE: 4, // 禁锢
// ICE_START: 5, // 冰冻开始
// ICE_END: 6, // 冰冻结束
// ADD_FIRING: 7, // 添加灼烧
// FIRING: 8, // 正在灼烧
// ADD_BOOM: 9, // 添加炸弹
// BOOM: 10, // 炸弹爆炸

export const getSkillKey = (skill?: Skill): 'firing' | 'boom' => {
  if (skill === Skill.HOLD) return 'firing';
  if (skill === Skill.FREEZE) return 'firing';
  if (skill === Skill.BURN) return 'firing';
  if (skill === Skill.BOMB) return 'boom';
  if (skill === Skill.SHIELD) return 'firing';

  return 'firing';
};

export const getDistanceBetweenTwoPoints = (point0: Point, point1: Point) => {
  const { x: x0, y: y0 } = point0;
  const { x: x1, y: y1 } = point1;

  const distance = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
  return distance;
};

/**
 * @desc 一阶贝塞尔
 * @param {number} t 当前百分比
 * @param {Array} p1 起点坐标
 * @param {Array} p2 终点坐标
 */
export const oneBezier = (t: number, p1: Point, p2: Point) => {
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;
  const x = x1 + (x2 - x1) * t;
  const y = y1 + (y2 - y1) * t;
  return new Point(x, y);
};

/**
 * @desc 二阶贝塞尔
 * @param {number} t 当前百分比
 * @param {Array} p1 起点坐标
 * @param {Array} p2 终点坐标
 * @param {Array} cp 控制点
 */
export const twoBezier = (t: number, p1: Point, p2: Point, cp: Point) => {
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;
  const { x: cx, y: cy } = cp;
  const x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
  const y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
  return new Point(x, y);
};

/**
 * @desc 三阶贝塞尔
 * @param {number} t 当前百分比
 * @param {Array} p1 起点坐标
 * @param {Array} p2 终点坐标
 * @param {Array} cp1 控制点1
 * @param {Array} cp2 控制点2
 */
export const threeBezier = (
  t: number,
  p1: Point,
  p2: Point,
  cp1: Point,
  cp2: Point,
) => {
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;
  const { x: cx1, y: cy1 } = cp1;
  const { x: cx2, y: cy2 } = cp2;
  const x =
    x1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cx1 * t * (1 - t) * (1 - t) +
    3 * cx2 * t * t * (1 - t) +
    x2 * t * t * t;
  const y =
    y1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cy1 * t * (1 - t) * (1 - t) +
    3 * cy2 * t * t * (1 - t) +
    y2 * t * t * t;
  return new Point(x, y);
};

/**
 * @dev 获取两个点直间的中心点
 * @param p1
 * @param p2
 * @returns
 */
export const getTwoPointCenter = (p1: Point, p2: Point): Point => {
  const x = (p1.x + p2.x) / 2;
  const y = (p1.y + p2.y) / 2;
  return new Point(x, y);
};

export const getSpriteRes = (race: number, resId: string, index: number) => {
  const info = raceData[race].children.find(item => item.id === Number(resId));
  const img = index === 1 ? info?.thumb1 : info?.thumb2;
  return img || `/assets/modal/${race}/${resId}-${index}.png`;
};

export const getSpriteName = (race: number, resId: string) => {
  // return raceData[race].children.find(item => item.id === Number(resId))?.name;
  return '';
};
