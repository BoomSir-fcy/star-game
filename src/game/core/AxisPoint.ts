import { Point } from '@pixi/math';
import Chequer from './Chequer';

class AxisPoint extends Point {
  chequer = new Chequer({ axisX: 0, axisY: 0 });

  axisX = 0;

  axisY = 0;

  constructor(axisX: number, axisY: number, chequer: Chequer) {
    super();

    this.axisX = axisX;
    this.axisY = axisY;

    this.set(chequer.centerPoint.x, chequer.centerPoint.y);

    this.chequer = chequer;
  }

  clone() {
    return new AxisPoint(this.axisX, this.axisY, this.chequer);
  }
}

export default AxisPoint;
