import { Point } from '@pixi/math';
import { Graphics } from '@pixi/graphics';
import { Container } from '@pixi/display';
import { InteractionEvent, InteractionData } from '@pixi/interaction';

import config from '../config';
import Chequer, { mapType, stateType } from './Chequer';
import AxisPoint from './AxisPoint';
import Matrix4 from './Matrix4';

interface BoardsProps {
  width?: number;
  height?: number;
  test?: boolean;
  enableDrag?: boolean;
}
/**
 * 棋盘
 */
class Boards extends EventTarget {
  constructor(options?: BoardsProps) {
    super();
    // this.aaa = 1;
    const { width, height, test, enableDrag } = options || {};

    this.width = width || config.WIDTH;
    this.height = height || config.HEIGHT;
    this.enableDrag = enableDrag || false;
    this.init();
  }

  startPoint: any;

  width;

  height;

  chequers: Chequer[] = []; // 棋盘格子

  matrix4s: Matrix4[] = []; // 2*2的格子

  container = new Container();

  scale = 1;

  axis: AxisPoint[][] = []; // 坐标轴

  axisX = 0;

  axisY = 0;

  created = false; //

  enableDrag = true;

  private dragData: InteractionData = new InteractionData();

  private dragging = false;

  init() {
    this.container.position.set(this.width / 2, this.height / 2);

    this.container.width = this.width;
    this.container.height = this.height;

    this.container.interactive = true;
  }

  // 绘制棋格
  drawChequers(areaX: number, areaY: number) {
    // this.createGraphics();
    // this.createGraphics1();
    this.chequers = [];
    const terrains: {
      [axis: string]: Api.Game.TerrainInfo;
    } = {};

    this.axisX = areaX;
    this.axisY = areaY;

    for (let row = 0; row < areaX; row++) {
      for (let col = 0; col < areaY; col++) {
        const chequer = new Chequer({
          type: terrains[`${row},${col}`]
            ? terrains[`${row},${col}`].terrain_type
            : mapType.MAP1,
          axisX: row,
          axisY: col,
          state: stateType.PREVIEW,
          // offsetStartX: 100,
        });
        chequer.displayState(false);
        this.chequers.push(chequer);
      }
    }
    this.chequers.forEach((s, index) => {
      this.container.addChild(s.bunny);
    });
    this.chequers.forEach((s, index) => {
      const createGraphic = s.createGraphics();
      this.container.addChild(createGraphic);
      if (!this.axis[s.axisX]) {
        this.axis[s.axisX] = [];
      }
      this.axis[s.axisX][s.axisY] = new AxisPoint(s.axisX, s.axisY, s);
    });

    this.getAllTowArea();
    this.created = true;
  }

  // 找1*1建筑的碰撞检测
  checkCollisionPoint(event: InteractionEvent, dargEnd?: boolean) {
    let res: Chequer = null;

    this.chequers.forEach(item => {
      const point = new Point(
        event.data.global.x - 10,
        event.data.global.y + 5,
      );
      const collection = item.checkCollisionPoint(point);
      if (collection && item.state === stateType.PLACE) {
        res = item;
      } else if (collection && item.state === stateType.PREVIEW) {
        item.setState(stateType.PLACE);
      } else if (!collection && item.state === stateType.PLACE) {
        item.setState(stateType.PREVIEW);
      }
      if (dargEnd) {
        item.displayState(false);
      }
    });

    return res;
  }

  // 获取所有2*2的格子 2*2的格子由4个ss1*1的格子组成
  getAllTowArea() {
    this.chequers.forEach(item => {
      const { axisX, axisY } = item;
      if (axisX < this.axisX - 1 && axisY < this.axisY - 1) {
        this.matrix4s.push(
          new Matrix4(
            this.axis[axisX][axisY].chequer,
            this.axis[axisX + 1][axisY].chequer,
            this.axis[axisX + 1][axisY + 1].chequer,
            this.axis[axisX][axisY + 1].chequer,
          ),
        );
      }
    });
    // this.matrix4s[5].displayState(true)
  }

  // 找2*2建筑的碰撞检测
  checkCollisionPointOfTow(event: InteractionEvent, dargEnd?: boolean) {
    let res: Matrix4 = null;
    this.matrix4s.forEach(item => {
      const point = new Point(
        event.data.global.x - 10,
        event.data.global.y + 5,
      );
      const collection = item.checkCollisionPoint(point);

      if (dargEnd) {
        item.displayState(false);
      }

      item.chequers.forEach(chequer => {
        if (chequer.state === stateType.PLACE) {
          chequer.setState(stateType.PREVIEW);
        }
      });

      // if (item.chequers.every(chequer => chequer.state === stateType.PLACE)) {
      //   item.setState(stateType.PREVIEW);
      // }

      if (
        dargEnd &&
        collection &&
        item.chequers.every(chequer => chequer.state === stateType.PLACE)
      ) {
        res = item;
      } else if (
        collection &&
        item.chequers.every(chequer => chequer.state === stateType.PREVIEW)
      ) {
        // item.setState(stateType.PLACE);
        res = item;
      } else if (
        !collection &&
        item.chequers.every(chequer => chequer.state === stateType.PLACE)
      ) {
        // item.setState(stateType.PREVIEW);
      }
    });

    return res;
  }
}

export default Boards;
