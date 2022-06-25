// import {
//   Application,
//   Sprite,
//   Container,
//   Loader,
//   InteractionData,
//   InteractionEvent,
// } from '@pixi/core';
import { Texture } from '@pixi/core';
import { Application } from '@pixi/app';
import { Sprite } from '@pixi/sprite';
import { ColorOverlayFilter } from '@pixi/filter-color-overlay';
import { Graphics } from '@pixi/graphics';
import { Container } from '@pixi/display';
import { Loader } from '@pixi/loaders';
import { InteractionEvent, InteractionData } from '@pixi/interaction';

import config from '../config';
import Chequer, { mapType, stateType } from './Chequer';
import AxisPoint from './AxisPoint';
import PixelateFilter from './PixelateFilter';

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

    console.log(width, height);

    this.width = width || config.WIDTH;
    this.height = height || config.HEIGHT;
    this.enableDrag = enableDrag || false;
    this.init();
  }

  startPoint: any;

  width;

  height;

  chequers: Chequer[] = []; // 棋盘格子

  container = new Container();

  scale = 1;

  axis: AxisPoint[][] = []; // 坐标轴

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

  createGraphics() {
    const path = [
      0,
      0,
      Chequer.WIDTH * Chequer.X_RATIO * 4,
      Chequer.HEIGHT * Chequer.Y_RATIO * 4,
      Chequer.WIDTH * Chequer.X_RATIO * 4,
      Chequer.HEIGHT * Chequer.Y_RATIO * 5 - 30,
      50,
      Chequer.HEIGHT * Chequer.Y_RATIO,
    ];
    const graphics = new Graphics();
    graphics.beginFill(0x4ffffb, 0.1);
    graphics.drawPolygon(path);
    graphics.endFill();
    // const { x } = this.bunny;
    // const y = this.bunny.y - 60;
    graphics.x = -Chequer.WIDTH * Chequer.Y_RATIO * 4;
    graphics.y = -0;

    graphics.interactive = true;
    graphics.zIndex = 10;
    // this.centerPoint.set(x, y + 30);
    this.container.addChild(graphics);
    return graphics;
  }

  createGraphics1() {
    const path = [
      Chequer.WIDTH * Chequer.X_RATIO * 8,
      0,
      Chequer.WIDTH * Chequer.X_RATIO * 4,
      Chequer.HEIGHT * Chequer.Y_RATIO * 4,
      Chequer.WIDTH * Chequer.X_RATIO * 4,
      Chequer.HEIGHT * Chequer.Y_RATIO * 5 - 30,
      Chequer.WIDTH * Chequer.X_RATIO * 8 - 50,
      Chequer.HEIGHT * Chequer.Y_RATIO,
    ];
    const graphics = new Graphics();
    graphics.beginFill(0x4ffffb, 0.15);
    graphics.drawPolygon(path);
    graphics.endFill();
    graphics.x = -Chequer.WIDTH * Chequer.Y_RATIO * 4;
    graphics.y = -0;

    graphics.interactive = true;
    graphics.zIndex = 10;

    this.container.addChild(graphics);
    return graphics;
  }

  // 绘制棋格
  drawChequers(test?: boolean) {
    // this.createGraphics();
    // this.createGraphics1();
    this.chequers = [];
    const terrains: {
      [axis: string]: Api.Game.TerrainInfo;
    } = {};

    for (let row = 0; row < config.BOARDS_ROW_COUNT; row++) {
      for (let col = 0; col < config.BOARDS_COL_COUNT; col++) {
        const chequer = new Chequer({
          type: terrains[`${row},${col}`]
            ? terrains[`${row},${col}`].terrain_type
            : mapType.MAP1,
          axisX: row,
          axisY: col,
          state: stateType.PREVIEW,
        });
        chequer.displayState(true);
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

    this.created = true;
  }
}

export default Boards;
