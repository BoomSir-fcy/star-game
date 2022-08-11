import { Point } from '@pixi/math';
import { Graphics } from '@pixi/graphics';
import { Container } from '@pixi/display';
import { InteractionEvent, InteractionData } from '@pixi/interaction';
import { Sprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';
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

// 格子偏移量 针对背景偏移
const CHEQUER_OFFSET_BY_BG = {
  x44: 76, // offsetStartX: 76, // 4
  y44: -344, // offsetStartY: -344, // 4

  x34: 132, // offsetStartX: 132, // 3
  y34: -290, // offsetStartY: -290, // 3

  x33: 58, // offsetStartX: 58, // 3
  y33: -260, // offsetStartY: -260, // 3

  x23: 112, // offsetStartX: 112, // 2
  y23: -201, // offsetStartY: -201, // 2

  x24: 187, // offsetStartX: 187, // 2
  y24: -230, // offsetStartY: -230, // 2

  x25: 264, // offsetStartX: 264, // 2
  y25: -258, // offsetStartY: -258, // 2
};
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

  containerChe = new Container();

  scale = 1;

  axis: AxisPoint[][] = []; // 坐标轴

  axisX = 0;

  axisY = 0;

  created = false; //

  enableDrag = true;

  private dragData: InteractionData = new InteractionData();

  private dragging = false;

  bg1 = new Sprite();

  init() {
    this.container.position.set(this.width / 2, this.height / 2);

    this.container.width = this.width;
    this.container.height = this.height;

    this.container.interactive = true;

    // this.containerChe.width = this.width;
    // this.containerChe.height = this.height;

    this.containerChe.interactive = true;
  }

  drawBg(row, col) {
    this.bg1.texture = Texture.from(`/assets/map/${col}-${row}.png`);
    // this.bg1.position.set(20, 34);
    this.bg1.position.set(0, 0);
    this.bg1.anchor.set(0.5);
    this.bg1.scale.set(1.02);
    // this.bg1.rotation = -Math.PI * 0.000001;
    this.container.zIndex = 0;
    this.containerChe.zIndex = 10;
    // this.containerChe.width = 100;
    // this.containerChe.height = 100;
    // this.containerChe.scale.set(1.37)
    // this.containerChe.position.set(50, 50)
    this.bg1.zIndex = 2;
    this.container.addChild(this.bg1);
    this.container.addChild(this.containerChe);
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
    // this.axisX = 4;
    // this.axisY = 4;
    this.drawBg(this.axisX, this.axisY);

    for (let row = 0; row < this.axisX; row++) {
      for (let col = 0; col < this.axisY; col++) {
        const chequer = new Chequer({
          type: terrains[`${row},${col}`]
            ? terrains[`${row},${col}`].terrain_type
            : mapType.MAP1,
          axisX: row,
          axisY: col,
          state: stateType.PREVIEW,

          offsetStartX: CHEQUER_OFFSET_BY_BG[`x${this.axisX}${this.axisY}`], // 4
          offsetStartY: CHEQUER_OFFSET_BY_BG[`y${this.axisX}${this.axisY}`], // 4

          // offsetStartX: 76, // 4
          // offsetStartY: -344, // 4

          // offsetStartX: 132, // 3
          // offsetStartY: -290, // 4

          // offsetStartX: 58, // 3
          // offsetStartY: -260, // 3

          // offsetStartX: 112, // 2
          // offsetStartY: -201, // 3

          // offsetStartX: 187, // 2
          // offsetStartY: -230, // 4

          // offsetStartX: 264, // 2
          // offsetStartY: -258, // 5
          // 160 0.5
          // 76 58
          // offsetStartX: -(this.axisX - this.axisY) * Chequer.WIDTH / 2 + Chequer.WIDTH * Chequer.X_RATIO * (this.axisX + this.axisY) / 16,
          // offsetStartY: -(this.axisX + this.axisY) * Chequer.HEIGHT / 4 + Chequer.HEIGHT * Chequer.Y_RATIO / 4,
        });
        chequer.displayState(false);
        this.chequers.push(chequer);
      }
    }
    this.chequers.forEach((s, index) => {
      this.containerChe.addChild(s.bunny);
    });
    this.chequers.forEach((s, index) => {
      const createGraphic = s.createGraphics();
      this.containerChe.addChild(createGraphic);
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
