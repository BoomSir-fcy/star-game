// import {
//   Application,
//   Sprite,
//   Container,
//   Loader,
//   InteractionData,
//   InteractionEvent,
// } from '@pixi/core';
import { Application } from '@pixi/app';
import { Texture } from '@pixi/core';
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
    console.log(this.offsetStartX, this.offsetStartY);

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

  row = config.BOARDS_ROW_COUNT;

  col = config.BOARDS_COL_COUNT;

  chequers: Chequer[] = []; // 棋盘格子

  container = new Container();

  solderContainer = new Container();

  scale = 1;

  axis: AxisPoint[][] = []; // 坐标轴

  created = false; //

  enableDrag = true;

  bg1 = new Sprite(Texture.from('/assets/map/p1.png'));

  bg2 = new Sprite(Texture.from('/assets/map/p1.png'));

  private dragData: InteractionData = new InteractionData();

  private dragging = false;

  init({ test }: { test?: boolean }) {
    this.container.position.set(this.width / 2, this.height / 2);

    // this.container.position.set(this.height / 2, this.width / 2);
    // this.container.position.set(this.width, this.height);
    this.container.width = this.width;
    this.container.height = this.height;

    this.solderContainer.width = this.width;
    this.solderContainer.height = this.height;
    // this.drawChequers(test);
    // this.container.scale.set(0.5);
    this.container.interactive = true;
    this.container.sortableChildren = true;
    this.solderContainer.interactive = true;
    this.solderContainer.zIndex = 9999;
    this.container.addChild(this.solderContainer);
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

  // 重新设置中心点
  setPosiotion(x: number, y: number) {
    this.container.position.set(this.width / 2 + x, this.height / 2 + y);
  }

  // 绘制棋格
  drawChequers(_col?: number, _row?: number) {
    if (_col) {
      this.col = _col;
    }
    if (_row) {
      this.row = _row;
    }
    this.chequers = [];
    this.drawBg();

    for (let row = 0; row < this.row; row++) {
      for (let col = 0; col < this.col; col++) {
        const chequer = new Chequer({
          type: mapType.MAP1,
          axisX: row,
          axisY: col,
          state: stateType.PREVIEW,
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

  drawBg() {
    const chequer = new Chequer({
      axisX: 6,
      axisY: 4,
    });
    const chequer1 = new Chequer({
      axisX: 6,
      axisY: 2,
    });
    this.bg1.position.set(
      chequer.centerPoint.x + this.offsetStartX - config.TWO_BOARDS_OFFSET,
      chequer.centerPoint.y + this.offsetStartY - 5,
    );
    this.bg1.anchor.set(0.5);
    this.bg1.scale.set(0.559);
    // this.bg1.rotation = -Math.PI * 0.000001;
    this.container.addChild(this.bg1);

    if (this.col === 8) {
      this.bg2.position.set(
        chequer1.centerPoint.x + this.offsetStartX + config.TWO_BOARDS_OFFSET,
        chequer1.centerPoint.y + this.offsetStartY,
      );
      // this.bg2.anchor.set(0.5);
      this.bg2.scale.set(0.559);
      this.container.addChild(this.bg2);
    }
  }

  onDragStart(event: InteractionEvent) {
    if (this.enableDrag) {
      this.startPoint = { x: event.data.global.x, y: event.data.global.y };
      this.dragData = event.data;
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
    }
  }
}

export default Boards;
