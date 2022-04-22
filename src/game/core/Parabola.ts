import { DisplayObject } from '@pixi/display';
import AxisPoint from './AxisPoint';

/**
 * 抛物线运动
 */
class Parabola extends EventTarget {
  /**
   *
   * @param display 移动对象
   * @param point0 起始坐标
   * @param point1 结束坐标
   */
  constructor(display: DisplayObject, point0: AxisPoint, point1: AxisPoint) {
    super();
    this.display = display;
    this.point0 = point0;
    this.point1 = point1;
  }

  display;

  point0;

  point1;

  curvature = 0.002; // 曲率， 实际指焦点到准线的距离，你可以抽象成曲率，这里模拟扔物体的抛物线，因此是开口向下的

  b = 0;

  moving = false;

  startX = 0;

  rate = 1;

  // scale = 1;

  speed = 60;

  // endScale = 1;

  // 转换成相对坐标位置
  coordElement = {
    x: 0,
    y: 0,
  };

  coordTarget = {
    x: 0,
    y: 0,
  };

  // 初始化位置
  position() {
    // this.coordTarget.x = this.point1.x - this.point0.x;
    // this.coordTarget.y = this.point1.y - this.point0.y;

    this.coordTarget.x = this.point1.x - this.point0.x + Math.random(); // 加随机数防止x轴坐标相等
    this.coordTarget.y = this.point1.y - this.point0.y + Math.random(); // 加随机数防止y轴坐标相等
    // this.coordTarget.x = this.point1.x;
    // this.coordTarget.y = this.point1.y;
    // this.coordElement.x = this.point0.x;
    // this.coordElement.y = this.point0.y;
    this.b =
      (this.coordTarget.y -
        this.curvature * this.coordTarget.x * this.coordTarget.x) /
      this.coordTarget.x;
    return this;
  }

  // 开始移动
  move() {
    if (this.moving) return this;
    this.moving = true;
    this.rate = this.coordTarget.x > 0 ? 1 : -1;
    this.step();
    return this;
  }

  step() {
    const tangent = 2 * this.curvature * this.startX + this.b;
    const sx = Math.sqrt(this.speed / (tangent * tangent + 1));
    const stepMoveX = this.rate * sx;
    this.startX += stepMoveX;

    // const r =
    //   ((1 - this.endScale * 1) * sx) /
    //   Math.abs(this.coordElement.x - this.coordTarget.x);
    // this.scale -= r;

    const x = this.startX;
    const realX = x + this.point0.x;

    // 防止过界
    if (
      (this.rate === 1 && x > this.coordTarget.x) ||
      (this.rate === -1 && x < this.coordTarget.x)
    ) {
      this.startX = this.coordTarget.x;
    }
    const y = this.curvature * x * x + this.b * x;

    const realY = y + this.point0.y;

    this.display.position.set(realX, realY);
    // this.display.scale.set(this.scale);
    // 根据切线 调整子弹角度
    this.display.rotation = tangent / 2 + (0.5 * this.rate - 0.25) * Math.PI;

    if (Math.abs(x - this.coordTarget.x) < Math.abs(stepMoveX)) {
      this.onMoveEnd();
    } else {
      requestAnimationFrame(() => this.step());
    }
  }

  // 移动结束周期
  onMoveEnd() {
    this.moving = false;
    this.dispatchEvent(new Event('end'));
  }
}

export default Parabola;
