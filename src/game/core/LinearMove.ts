import { DisplayObject } from '@pixi/display';
import { Orientation, SpeederType } from 'game/types';
import { Point } from 'pixi.js';
import AxisPoint from './AxisPoint';
import {
  getDistanceBetweenTwoPoints,
  getTwoPointCenter,
  oneBezier,
  threeBezier,
  twoBezier,
} from './utils';
import speeder from './Speeder';

interface LinearMoveOptions {
  /**
   *  当同时出现@param time @param speed 时 优先使用 @param time
   */
  speed: SpeederType; // 速度
  time?: number; // 运动总时间
}

const defaultOptions = {
  speed: SpeederType.BULLET_LINEAR,
  time: 0,
};
// 使用贝塞尔曲线函数移动目标
class LinearMove extends EventTarget {
  /**
   *
   * @param display 移动对象
   * @param point0 移动起始点
   * @param point1 移动终点
   */
  constructor(
    display: DisplayObject,
    point0: Point,
    point1: Point,
    options?: LinearMoveOptions,
  ) {
    super();
    this.display = display;
    this.point0 = point0;
    this.point1 = point1;
    const option = {
      ...defaultOptions,
      ...options,
    };
    this.speed = option.speed;
    this.time = option.time;
  }

  display;

  point0;

  point1;

  moving = false;

  speed;

  timeStep = 0;

  time = 0;

  cPoint0 = new Point();

  cPoint1 = new Point();

  coordTarget = {
    x: 0,
    y: 0,
  };

  // 开始移动
  move() {
    if (this.moving) return this;
    this.moving = true;
    // 两点直接的距离
    const distance = getDistanceBetweenTwoPoints(this.point0, this.point1);
    this.time = this.time || distance / speeder[this.speed];
    if (!this.time) {
      this.onMoveEnd();
      return this;
    }
    this.timeStep = 1 / this.time;

    // this.cPoint1.x = this.point1.x - this.point0.x;
    // this.cPoint1.y = this.point1.y - this.point0.y;

    this.cPoint0 = this.point0.clone();
    this.cPoint1 = this.point1.clone();
    this.step(this.timeStep);

    return this;
  }

  step(t: number) {
    const { x, y } = oneBezier(
      t,
      this.point0,
      this.point1,
      // this.cPoint0,
      // this.cPoint1,
    );
    this.display?.position?.set(x, y);
    if (t >= 1) {
      this.onMoveEnd();
    } else {
      requestAnimationFrame(() => this.step(t + this.timeStep));
    }
  }

  // 移动完成生命周期
  onMoveEnd() {
    this.moving = false;
    this.dispatchEvent(new Event('end'));
  }

  // 移动时转向
  static flipTargetPointOrientation(
    currentAxisPoint: AxisPoint,
    targetAxisPoint: AxisPoint,
    x: number,
    y: number,
  ) {
    if (currentAxisPoint && targetAxisPoint) {
      const { axisX: x0, axisY: y0 } = currentAxisPoint;
      const { axisX: x1, axisY: y1 } = targetAxisPoint;
      const rX = -Math.abs(x);
      const rY = -Math.abs(y);
      const aX = Math.abs(x);
      const aY = Math.abs(y);
      // Orientation.TO_RIGHT_DOWN;
      if (y0 - y1 > 0) return { x: aX, y: rY };
      // Orientation.TO_LEFT_UP;
      if (y0 - y1 < 0) return { x: rX, y: aY };
      // Orientation.TO_LEFT_DOWN;
      if (x0 - x1 > 0) return { x: rX, y: rY };
      // Orientation.TO_RIGHT_UP
      if (x0 - x1 < 0) return { x: aX, y: aY };
    }
    return { x, y };
  }
}

export default LinearMove;
