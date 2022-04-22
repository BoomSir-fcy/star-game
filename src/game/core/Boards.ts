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
}
/**
 * 棋盘
 */
class Boards extends EventTarget {
  constructor(options?: BoardsProps) {
    super();
    // this.aaa = 1;
    const { width, height, test } = options || {};

    this.width = width || config.WIDTH;
    this.height = height || config.HEIGHT;

    this.init({ test });
  }

  width;

  height;

  chequers: Chequer[] = []; // 棋盘格子

  container = new Container();

  scale = 1;

  axis: AxisPoint[][] = []; // 坐标轴

  created = false; //

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
      .on('pointermove', () => this.onDragMove());
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
        if (terrains[`${row},${col}`]) {
          const chequer = new Chequer({
            type: terrains[`${row},${col}`].terrain_type,
            axisX: row,
            axisY: col,
            state: stateType.PREVIEW,
            test,
          });
          this.chequers.push(chequer);
        } else {
          const chequer = new Chequer({
            type: mapType.MAP1,
            axisX: row,
            axisY: col,
            state: stateType.PREVIEW,
            test,
          });
          this.chequers.push(chequer);
        }
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
    this.dragData = event.data;
    this.dragging = true;
  }

  onDragEnd() {
    this.dragging = false;
  }

  onDragMove(event?: InteractionEvent) {
    this.dragData = event?.data || this.dragData;
    if (this.dragging) {
      const newPosition = this?.dragData?.getLocalPosition(
        this.container.parent,
      );
      if (newPosition) {
        this.container.x = newPosition.x;
        this.container.y = newPosition.y;
      }
    }
  }
}

export default Boards;
