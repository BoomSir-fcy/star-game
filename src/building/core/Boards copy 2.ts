import { Point } from '@pixi/math';
import { Graphics } from '@pixi/graphics';
import { Container } from '@pixi/display';
import { InteractionEvent, InteractionData } from '@pixi/interaction';
import { Sprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';
import { Sprite2d } from 'pixi-projection';

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

  bg1 = new Sprite(Texture.from('/assets/map/buiding-p1.png'));

  containerSprite = new Sprite2d(Texture.from('/assets/map/buiding-p1.png'));

  squares = [];

  quad = [];

  w = 0;

  h = 0;

  init() {
    this.w = this.width / 2;
    this.h = this.height / 2;

    this.container.position.set(0, 0);
    // this.container.position.set(this.w, this.h);

    this.container.width = this.width;
    this.container.height = this.height;

    this.container.interactive = true;
    // this.drawBg();

    const w = this.w;
    const h = this.h;
    this.squares = [
      Boards.createSquare(w - 150, h - 150),
      Boards.createSquare(w + 150, h - 150),
      Boards.createSquare(w + 150, h + 150),
      Boards.createSquare(w - 150, h + 150),
    ];
    this.quad = this.squares.map(s => s.position);

    this.containerSprite.anchor.set(0.5);
    this.containerSprite.tint = 0xfff000;
    this.containerSprite.position.set(this.w, this.h);
    this.containerSprite.width = 300;
    this.containerSprite.height = 300;

    this.container.addChild(this.containerSprite);

    this.squares.forEach(item => {
      this.container.addChild(item);
      this.addInteraction(item);
    });
    // this.renderStore();
  }

  static createSquare(x, y) {
    const square = new Sprite(Texture.WHITE);
    square.tint = 0xff0000;
    square.anchor.set(0.5);
    square.position.set(x, y);
    // square.width = 500;
    // square.height = 500;
    return square;
  }

  renderStore() {
    console.log(this.quad);
    this.containerSprite.proj.mapSprite(this.containerSprite, this.quad);
  }

  snap(obj) {
    console.log(this.width, obj.position.y);
    // eslint-disable-next-line
    obj.position.x = Math.min(Math.max(obj.position.x, 0), this.w);
    console.log(this.width, obj.position.y);

    // eslint-disable-next-line
    obj.position.y = Math.min(Math.max(obj.position.y, 0), this.h);
    console.log(this.width, obj.position.y);
  }

  addInteraction(obj) {
    // eslint-disable-next-line
    obj.interactive = true;
    obj
      .on('pointerdown', e => this.onDragStart(e))
      .on('pointerup', e => this.onDragEnd(e))
      .on('pointerupoutside', e => this.onDragEnd(e))
      .on('pointermove', e => this.onDragMove(e));
  }

  onDragStart(event) {
    const obj = event.currentTarget;
    obj.dragData = event.data;
    obj.dragging = 1;
    obj.dragPointerStart = event.data.getLocalPosition(obj.parent);
    obj.dragObjStart = new Point();
    obj.dragObjStart.copyFrom(obj.position);
    obj.dragGlobalStart = new Point();
    obj.dragGlobalStart.copyFrom(event.data.global);
    this.renderStore();
  }

  onDragEnd(event) {
    const obj = event.currentTarget;
    if (obj.dragging !== 1) {
      // this.snap(obj);
    }
    obj.dragging = 0;
    obj.dragData = null;
    this.renderStore();

    // set the interaction data to null
  }

  onDragMove(event) {
    const obj = event.currentTarget;
    if (!obj.dragging) return;
    const data = obj.dragData; // it can be different pointer!
    if (obj.dragging === 1) {
      // click or drag?
      if (
        Math.abs(data.global.x - obj.dragGlobalStart.x) +
          Math.abs(data.global.y - obj.dragGlobalStart.y) >=
        3
      ) {
        // DRAG
        obj.dragging = 2;
      }
    }
    if (obj.dragging === 2) {
      const dragPointerEnd = data.getLocalPosition(obj.parent);
      // DRAG
      obj.position.set(
        obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x),
        obj.dragObjStart.y + (dragPointerEnd.y - obj.dragPointerStart.y),
      );
    }
    this.renderStore();
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
      // this.container.addChild(s.bunny);
    });
    this.chequers.forEach((s, index) => {
      const createGraphic = s.createGraphics();
      // this.container.addChild(createGraphic);
      if (!this.axis[s.axisX]) {
        this.axis[s.axisX] = [];
      }
      this.axis[s.axisX][s.axisY] = new AxisPoint(s.axisX, s.axisY, s);
    });

    this.getAllTowArea();
    this.created = true;
  }

  drawBg() {
    this.bg1.position.set(0, 0);
    this.bg1.anchor.set(0.5);
    this.bg1.scale.set(1.4);
    // this.bg1.rotation = -Math.PI * 0.000001;
    this.container.addChild(this.bg1);
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
