// import {
//   Application,
//   Sprite,
//   Container,
//   Loader,
//   InteractionData,
//   InteractionEvent,
// } from '@pixi/core';
import { Application } from '@pixi/app';
import { Sprite } from '@pixi/sprite';
import { Container } from '@pixi/display';
import { Loader } from '@pixi/loaders';
import { InteractionEvent, InteractionData } from '@pixi/interaction';

import config from 'game/config';
import Chequer, { mapType, stateType } from './Chequer';
import AxisPoint from './AxisPoint';

interface BoardsProps {
  width?: number;
  height?: number;
  test?: boolean;
  enableDrag?: boolean;
  offsetStartX?: number;
  offsetStartY?: number;
}
/**
 * 棋盘
 */
class Boards extends EventTarget {
  constructor(options?: BoardsProps) {
    super();
    // this.aaa = 1;
    const { width, height, test, enableDrag } = options || {};
    this.offsetStartX = options?.offsetStartX ?? config.OFFSET_START_X;
    this.offsetStartY = options?.offsetStartY ?? config.OFFSET_START_Y;

    this.width = width || config.WIDTH;
    this.height = height || config.HEIGHT;
    this.enableDrag = enableDrag || false;
    this.init({ test });
  }

  offsetStartX;

  offsetStartY;

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

  init({ test }: { test?: boolean }) {
    this.container.position.set(this.width / 2, this.height / 2);

    // this.drawChequers(test);

    this.container.interactive = true;
    this.container.on('wheel', e => {
      this.onHandleWheel(e);
    });

    this.container
      .on('pointerdown', e => this.onDragStart(e))
      .on('pointerup', () => this.onDragEnd())
      .on('pointerupoutside', () => {
        this.onDragEnd();
      })
      .on('pointermove', e => this.onDragMove(e));
  }

  // 滚轮事件 缩放
  onHandleWheel(e: any) {
    const { deltaY } = e;
    const down = deltaY > 0;

    this.scale = down
      ? this.scale - config.SCALE_BASE
      : this.scale + config.SCALE_BASE;
    if (this.scale > config.MAX_SCALE) {
      this.scale = config.MAX_SCALE;
    } else if (this.scale < config.MIN_SCALE) {
      this.scale = config.MIN_SCALE;
    }

    this.container.scale.set(this.scale);
    e.preventDefault();
  }

  // 绘制棋格
  drawChequers(test?: boolean, TerrainInfo?: Api.Game.TerrainInfo[]) {
    this.chequers = [];
    const terrains: {
      [axis: string]: Api.Game.TerrainInfo;
    } = {};
    TerrainInfo?.forEach(item => {
      item.terrain_areas.forEach(subItem => {
        terrains[`${subItem.x},${subItem.y}`] = item;
      });
    });

    for (let row = 0; row < config.BOARDS_ROW_COUNT; row++) {
      for (let col = 0; col < config.BOARDS_COL_COUNT; col++) {
        const chequer = new Chequer({
          type: terrains[`${row},${col}`]
            ? terrains[`${row},${col}`].terrain_type
            : mapType.MAP1,
          axisX: row,
          axisY: col,
          state: stateType.PREVIEW,
          test,
          offsetStartX: this.offsetStartX,
          offsetStartY: this.offsetStartY,
        });
        this.chequers.push(chequer);
      }
    }
    this.chequers.forEach(s => {
      this.container.addChild(s.bunny);
    });
    this.chequers.forEach(s => {
      const createGraphic = s.createGraphics();
      this.container.addChild(createGraphic);
      if (!this.axis[s.axisX]) {
        this.axis[s.axisX] = [];
      }
      this.axis[s.axisX][s.axisY] = new AxisPoint(s.axisX, s.axisY, s);
    });

    this.created = true;
  }

  onDragStart(event: InteractionEvent) {
    if (this.enableDrag) {
      this.dragData = event.data;
      this.startPoint = { x: event.data.global.x, y: event.data.global.y };
      this.dragging = true;
    }
  }

  onDragEnd() {
    this.dragging = false;
  }

  onDragMove(event?: InteractionEvent) {
    this.dragData = event?.data || this.dragData;
    if (this.dragging) {
      if (event?.data?.global?.x && event?.data?.global?.y) {
        const dx = event?.data?.global?.x - this.startPoint.x;
        const dy = event?.data?.global?.y - this.startPoint.y;
        if (
          this.container.position.x + dx < -50 ||
          this.container.position.x + dx > this.width + 50 ||
          this.container.position.y + dy < -50 ||
          this.container.position.y + dy > this.height + 50
        ) {
          return;
        }
        this.container.position.x += dx;
        this.container.position.y += dy;
        this.startPoint = { x: event.data.global.x, y: event.data.global.y };
      }
      // const newPosition = this?.dragData?.getLocalPosition(
      //   this.container.parent,
      // );
      // console.log(newPosition, this?.dragData, this.container.parent);
      // if (newPosition) {
      //   this.container.x = newPosition.x;
      //   this.container.y = newPosition.y;
      // }
    }
  }
}

export default Boards;
