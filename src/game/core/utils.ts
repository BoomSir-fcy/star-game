// import { GlowFilter } from 'pixi-filters';

import { Point, Container, Graphics } from 'pixi.js';

// const outlineFilterRed = new GlowFilter({
//   outerStrength: 3,
//   innerStrength: 0,
//   color: 0x99ff99,
//   quality: 1,
// });

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
  console.log(r1, r2);

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
