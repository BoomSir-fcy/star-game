import { Point } from '@pixi/math';
import Chequer from './Chequer';

class AxisPoint extends Point {
  chequer = new Chequer({ axisX: 0, axisY: 0 });

  axisX = 0;

  axisY = 0;

  constructor(x: number, y: number, chequer: Chequer) {
    super();

    this.axisX = x;
    this.axisY = y;

    this.set(chequer.centerPoint.x, chequer.centerPoint.y);

    this.chequer = chequer;
  }
}

export default AxisPoint;
