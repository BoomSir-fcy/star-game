// import { Graphics, Texture, Sprite, Text, Point } from 'pixi.js';
import { Sprite } from '@pixi/sprite';
import { Text } from '@pixi/text';
import { Texture } from '@pixi/core';
import { Graphics } from '@pixi/graphics';
import { Point } from '@pixi/math';
import config from 'game/config';
import { BoardPositionSelf } from '../types';
import { checkPolygonPoint } from './utils';

export const mapType = {
  MAP1: 'map1',
  MAP2: 'map2',
  MAP3: 'map3',
  MAP4: 'map4',
  MAP5: 'map5',
  MAP6: 'map6',
} as const;

export const stateType = {
  PREVIEW: 1,
  ACTIVE: 2,
  DISABLE: 3,
  PLACE: 4,
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
}
class Chequer {
  constructor(option: ChequerOptions) {
    this.init(option);
  }

  static Y_RATIO = 0.308;

  static X_RATIO = 0.48;

  axisX = 0;

  axisY = 0;

  src = '';

  bunny: Sprite = new Sprite();

  isDown = false;

  isOver = false;

  state: StateType = stateType.PREVIEW;

  static [mapType.MAP1] = Texture.from('/assets/map/map1.png');

  static [mapType.MAP2] = Texture.from('/assets/map/map2.png');

  static [mapType.MAP3] = Texture.from('/assets/map/map3.png');

  static [mapType.MAP4] = Texture.from('/assets/map/map4.png');

  static [mapType.MAP5] = Texture.from('/assets/map/map5.png');

  static [mapType.MAP6] = Texture.from('/assets/map/map6.png');

  static [stateType.PREVIEW] = Texture.from('/assets/map/state1.png');

  static [stateType.ACTIVE] = Texture.from('/assets/map/state2.png');

  static [stateType.DISABLE] = Texture.from('/assets/map/state3.png');

  static [stateType.PLACE] = Texture.from('/assets/map/state4.png');

  textureButtonDown = Texture.from('/assets/map/map1.png');

  textureButtonOver = Texture.from('/assets/map/map2.png');

  textureButton = Texture.from('/assets/map/map4.png');

  stateSprite = new Sprite(Chequer[stateType.PREVIEW]);

  graphics = new MyGraphics();

  centerPoint = new Point();

  init({
    axisX,
    axisY,
    type = mapType.MAP1,
    state = stateType.DISABLE,
    test,
  }: ChequerOptions) {
    // this.src = src;

    // const texture = Texture.from(src);

    this.axisX = axisX;
    this.axisY = axisY;

    this.bunny = new Sprite(Chequer[type]);
    this.bunny.anchor.set(0.5);
    this.bunny.width = 100;
    this.bunny.height = 125;
    const { x, y, enemy } = this.getXY(axisX, axisY);
    this.bunny.x = x;
    this.bunny.y = y;

    this.bunny.interactive = true;
    this.bunny.buttonMode = true;

    if (test) {
      this.setState(state);
    } else {
      this.setState(enemy ? stateType.DISABLE : state);
    }

    this.stateSprite.anchor.set(0.5);
    this.stateSprite.x = 0;
    this.stateSprite.y = -23;
    this.bunny.addChild(this.stateSprite);
    this.stateSprite.visible = false;

    const text = new Text(`x${axisX}, ${axisY}`, {
      fill: 0xffffff,
      fontSize: 16,
    });
    text.x = -30;
    text.y = -28;
    this.bunny.addChild(text);
  }

  // 底色是不规则渲染 所以事件范围也不规则
  // 使用 Graphics 绑定事件 进行hack处理
  createGraphics() {
    const path = [
      0,
      0,
      this.bunny.width * Chequer.X_RATIO,
      this.bunny.height * Chequer.Y_RATIO,
      0,
      this.bunny.height * Chequer.Y_RATIO * 2,
      -this.bunny.width * Chequer.X_RATIO,
      this.bunny.height * Chequer.Y_RATIO,
    ];
    const color = getRandomColor();
    this.graphics.beginFill(color, 0.00001);
    this.graphics.drawPolygon(path);
    this.graphics.endFill();
    const { x } = this.bunny;
    const y = this.bunny.y - 60;
    this.graphics.x = x;
    this.graphics.y = y;

    this.graphics.interactive = true;

    this.centerPoint.set(x, y + 30);

    return this.graphics;
  }

  getXY(axisX: number, axisY: number) {
    // 把两个棋盘分成2份
    let excessOffsetA = 0;
    let excessOffsetB = 0;
    let enemy = false;
    if (
      axisY >= config.BOARDS_COL_COUNT / 2 &&
      config.BOARD_POSITION_SELF === BoardPositionSelf.BOTTOM_LEFT
    ) {
      excessOffsetA = 16;
      enemy = true;
    }
    if (
      axisX >= config.BOARDS_COL_COUNT / 2 &&
      config.BOARD_POSITION_SELF === BoardPositionSelf.TOP_LEFT
    ) {
      excessOffsetB = 16;
      enemy = true;
    }
    return {
      x:
        config.OFFSET_START_X -
        excessOffsetA +
        excessOffsetB +
        (axisX - axisY) * this.bunny.width * Chequer.X_RATIO,
      y:
        config.OFFSET_START_Y +
        excessOffsetA +
        excessOffsetB +
        (axisX + axisY) * this.bunny.height * Chequer.Y_RATIO,
      enemy,
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
