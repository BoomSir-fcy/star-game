// import { Graphics, Texture, Sprite, Text, Point } from 'pixi.js';
import { Sprite } from '@pixi/sprite';
import { Text } from '@pixi/text';
import { Texture } from '@pixi/core';
import { Graphics } from '@pixi/graphics';
import { Container } from '@pixi/display';
import { Point } from '@pixi/math';
import config from '../config';
import { BoardPositionSelf } from '../types';
import { checkPolygonPoint } from './utils';

export const mapType = {
  MAP1: 0,
  MAP2: 1,
  MAP3: 2,
  MAP4: 3,
  MAP5: 4,
  MAP6: 5,
} as const;

export const stateType = {
  PREVIEW: 'PREVIEW',
  ACTIVE: 'ACTIVE',
  DISABLE: 'DISABLE',
  PLACE: 'PLACE',
  HOVER: 'HOVER',
  MOVED: 'MOVED', // 走过的路径
} as const;

export type MapType = typeof mapType[keyof typeof mapType];

export type StateType = typeof stateType[keyof typeof stateType];

const getRandomColor = () => {
  return parseInt(Math.floor(Math.random() * 16777215).toString(16), 16);
};

class MyGraphics extends Graphics {
  getVertexData() {
    return this.vertexData;
  }
}

interface ChequerOptions {
  axisX: number; // X坐标轴
  axisY: number; // Y坐标轴
  type?: MapType;
  state?: StateType;
  test?: boolean;
  offsetStartX?: number;
  offsetStartY?: number;
}
class Chequer {
  constructor(option: ChequerOptions) {
    this.offsetStartX = option.offsetStartX ?? config.OFFSET_START_X;
    this.offsetStartY = option.offsetStartY ?? config.OFFSET_START_Y;
    this.init(option);
  }

  static Y_RATIO = 0.5;

  static X_RATIO = 0.5;

  static WIDTH = 100 * 2;

  static HEIGHT = 79 * 2;

  offsetStartX;

  offsetStartY;

  axisX = 0;

  axisY = 0;

  src = '';

  // bunny: Sprite;
  bunny: Container = new Container();

  isDown = false;

  isOver = false;

  state: StateType = stateType.PREVIEW;

  static [stateType.PREVIEW] = Texture.from('/assets/map/state1.png');

  static [stateType.ACTIVE] = Texture.from('/assets/map/state2.png');

  static [stateType.DISABLE] = Texture.from('/assets/map/state3.png');

  static [stateType.PLACE] = Texture.from('/assets/map/state4.png');

  static [stateType.HOVER] = Texture.from('/assets/map/state5.png');

  static [stateType.MOVED] = Texture.from('/assets/map/state6.png');

  stateSprite = new Sprite(Chequer[stateType.PREVIEW]);

  graphics = new MyGraphics();

  centerPoint = new Point();

  init({ axisX, axisY, state = stateType.DISABLE, test }: ChequerOptions) {
    this.axisX = axisX;
    this.axisY = axisY;

    this.bunny = new Container();
    this.bunny.width = Chequer.WIDTH;
    this.bunny.height = Chequer.HEIGHT;
    const { x, y } = this.getXY(this.axisY, this.axisX);
    this.bunny.x = x;
    this.bunny.y = y;

    this.bunny.interactive = true;
    this.bunny.buttonMode = true;
    this.setState(state);

    this.stateSprite.anchor.set(0.5);
    this.stateSprite.x = 0;
    this.stateSprite.y = (Chequer.HEIGHT * Chequer.Y_RATIO) / 2;
    this.stateSprite.width = Chequer.WIDTH + 3;
    this.stateSprite.height = Chequer.HEIGHT + 3;
    this.bunny.addChild(this.stateSprite);
    this.stateSprite.visible = false;

    this.centerPoint.set(x, y);
    // this.centerPoint.set(x, y - (Chequer.HEIGHT * Chequer.Y_RATIO) / 2);

    const text = new Text(`x${this.axisX}, ${this.axisY}`, {
      fill: 0xffffff,
      fontSize: 16,
    });
    text.x = -30;
    text.y = 28;
    this.bunny.addChild(text);
  }

  // 底色是不规则渲染 所以事件范围也不规则
  // 使用 Graphics 绑定事件 进行hack处理
  createGraphics() {
    const path = [
      0,
      0,
      Chequer.WIDTH * Chequer.X_RATIO,
      Chequer.HEIGHT * Chequer.Y_RATIO,
      0,
      Chequer.HEIGHT * Chequer.Y_RATIO * 2,
      -Chequer.WIDTH * Chequer.X_RATIO,
      Chequer.HEIGHT * Chequer.Y_RATIO,
    ];
    this.graphics.lineStyle(1, 0x4ffffb, 0.7);
    this.graphics.beginFill(0x4ffffb, 0.2);
    this.graphics.drawPolygon(path);
    this.graphics.endFill();
    const { x } = this.bunny;
    const y = this.bunny.y - (Chequer.HEIGHT * Chequer.Y_RATIO) / 2;
    this.graphics.x = x;
    this.graphics.y = y;

    this.graphics.interactive = true;

    // this.centerPoint.set(x, y);

    return this.graphics;
  }

  getXY(axisX: number, axisY: number) {
    // 把两个棋盘分成2份
    let excessOffsetA = 0;
    let excessOffsetB = 0;
    if (
      axisY >= config.BOARDS_COL_COUNT / 2 &&
      config.BOARD_POSITION_SELF === BoardPositionSelf.BOTTOM_LEFT
    ) {
      excessOffsetA = config.TWO_BOARDS_OFFSET;
    }
    if (
      axisX >= config.BOARDS_COL_COUNT / 2 &&
      config.BOARD_POSITION_SELF === BoardPositionSelf.TOP_LEFT
    ) {
      excessOffsetB = config.TWO_BOARDS_OFFSET;
    }
    const { width, height } = this.bunny.getBounds();
    return {
      x:
        this.offsetStartX -
        excessOffsetA +
        excessOffsetB +
        (axisX - axisY) * Chequer.WIDTH * Chequer.X_RATIO,
      y:
        this.offsetStartY +
        excessOffsetA +
        excessOffsetB +
        (axisX + axisY) * Chequer.HEIGHT * Chequer.Y_RATIO,
    };
  }

  setState(state: StateType) {
    this.state = state;
    this.stateSprite.texture = Chequer[state];
  }

  displayState(visible: boolean) {
    this.stateSprite.visible = visible;
  }

  // 检测一个点是否在当前格子里
  checkCollisionPoint(point: Point) {
    const vertexData = this.graphics.getVertexData();
    const points = [
      new Point(vertexData[0], vertexData[1]),
      new Point(vertexData[2], vertexData[3]),
      new Point(vertexData[4], vertexData[5]),
      new Point(vertexData[6], vertexData[7]),
    ];

    const collision = checkPolygonPoint(point, points);

    return collision;
  }
}

export default Chequer;
