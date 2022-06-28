import { Point } from '@pixi/math';
import Chequer, { StateType } from "./Chequer";
import { checkPolygonPoint } from './utils';

class Matrix4 {

  constructor(c1: Chequer, c2: Chequer, c3: Chequer, c4: Chequer) {
    this.chequers = [
      c1,
      c2,
      c3,
      c4,
    ]
    this.points = Matrix4.getPoints(this.chequers)
  }

  chequers: Chequer[];

  points: Point[] = [];

  static getPoints(chequers: Chequer[]) {
    const points: Point[] = [];
    chequers.forEach((item, index) => {
      const vertexData = item.graphics.getVertexData();
      if (vertexData) {
        points.push(new Point(vertexData[index * 2], vertexData[index * 2 + 1]));
      }
    })

    return points;
  }

  // 检测一个点是否在当前格子里
  checkCollisionPoint(point: Point) {
    if (!this.points.length) {
      const points = Matrix4.getPoints(this.chequers)
      if (points.length) {
        this.points = points;
      }
    }
    const collision = checkPolygonPoint(point, this.points);

    return collision;
  }

  setState(state: StateType) {
    this.chequers.forEach(item => {
      item.setState(state)
    })
  }

  displayState(visible: boolean) {
    this.chequers.forEach(item => {
      item.displayState(visible)
    })
  }

}

export default Matrix4;
