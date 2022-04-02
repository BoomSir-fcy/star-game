import { Graphics, Texture, Sprite, TilingSprite, TextStyle, Text, Container } from 'pixi.js';
// import { Stage, Layer, Group } from '@pixi/layers'
import config from 'game/config';

// const W = 800;
// const H = 600;
// const resolution = 1;
// const WIDTH = W / resolution;
// const HEIGHT = H / resolution;

// const app = new PIXI.Application({ width: WIDTH, height: HEIGHT, resolution });
// // document.body.appendChild(app.view);

// const stage = new Stage();
// app.stage = stage;

const mapType = {
  MAP1: 'map1',
  MAP2: 'map2',
  MAP3: 'map3',
  MAP4: 'map4',
  MAP5: 'map5',
  MAP6: 'map6',
} as const;

const stateType = {
  PREVIEW: 'state1',
  ACTIVE: 'state2',
  DISABLE: 'state3',
} as const;

export type MapType = typeof mapType[keyof typeof mapType];

export type StateType = typeof stateType[keyof typeof stateType];

const getRandomColor = () => {
  return parseInt(Math.floor(Math.random()*16777215).toString(16), 16); 
}

interface ChequerOptions {
  axisX: number; // X坐标轴
  axisY: number; // Y坐标轴
  type?: MapType
}
class Chequer {
  
  constructor(option: ChequerOptions) {
    this.init(option);
  }

  static Y_RATIO = 0.308;

  static X_RATIO = 0.48;

  src = '';

  bunny: Sprite = new Sprite();

  isDown = false;

  isOver = false;

   static [mapType.MAP1] = Texture.from('/assets/map/map1.png');

   static [mapType.MAP2] = Texture.from('/assets/map/map2.png');

   static [mapType.MAP3] = Texture.from('/assets/map/map3.png');

   static [mapType.MAP4] = Texture.from('/assets/map/map4.png');

   static [mapType.MAP5] = Texture.from('/assets/map/map5.png');

   static [mapType.MAP6] = Texture.from('/assets/map/map6.png');

   static [stateType.PREVIEW] = Texture.from('/assets/map/state1.png');

   static [stateType.ACTIVE] = Texture.from('/assets/map/state2.png');

   static [stateType.ACTIVE] = Texture.from('/assets/map/state3.png');


  textureButtonDown = Texture.from('/assets/map/map1.png');

  textureButtonOver = Texture.from('/assets/map/map2.png');

  textureButton = Texture.from('/assets/map/map4.png');

  stateSprite = new Sprite(Chequer[stateType.PREVIEW]);

  graphics = new Graphics();

  init({ axisX, axisY, type = mapType.MAP1 }: ChequerOptions) {

    // this.src = src;

    // const texture = Texture.from(src);

    this.bunny = new Sprite(Chequer[type]);
    this.bunny.anchor.set(0.5);
    this.bunny.width = 100;
    this.bunny.height = 125;
    const { x, y } = this.getXY(axisX, axisY)
    this.bunny.x = x;
    this.bunny.y = y;

    this.bunny.interactive = true;
    this.bunny.buttonMode = true;

    this.stateSprite.anchor.set(0.5);
    this.stateSprite.x = 0;
    this.stateSprite.y = -23;
    this.bunny.addChild(this.stateSprite)
    this.stateSprite.visible = false;

  }

  // 底色是不规则渲染 所以事件范围也不规则
  // 使用 Graphics 绑定事件 进行hack处理
  createGraphics() {
    const path =  [
        0, 0,
        this.bunny.width * Chequer.X_RATIO , this.bunny.height * Chequer.Y_RATIO ,
        0 , this.bunny.height * Chequer.Y_RATIO * 2 ,
        -this.bunny.width * Chequer.X_RATIO, this.bunny.height * Chequer.Y_RATIO,
    ]
    const color = getRandomColor()
    this.graphics.beginFill(color, 0.00001);
    this.graphics.drawPolygon(path);
    this.graphics.endFill();
    this.graphics.x = this.bunny.x
    this.graphics.y = this.bunny.y - 60
    // this.graphics.visible = false;
    // this.graphics.anchor.set(0.5);
    // this.graphics.addChild(new Text(`${color}`))

    this.graphics.interactive = true;
    this.graphics
    .on('pointerdown', () => this.onButtonDown())
    .on('pointerup', () => this.onButtonUp())
    .on('pointerupoutside', () => this.onButtonUp())
    .on('pointerover', (e) => this.onButtonOver(e))
    .on('pointerout', () => this.onButtonOut());


    return this.graphics;
  }

  getXY(axisX: number, axisY: number) {
    return {
      x: config.OFFSET_START_X + (axisX - axisY) * this.bunny.width * Chequer.X_RATIO,
      y: config.OFFSET_START_Y + (axisX + axisY) * this.bunny.height * Chequer.Y_RATIO,
    }

  }

  onButtonDown() {
    this.isDown = true;
    this.bunny.texture = this.textureButtonDown;
    this.bunny.alpha = 1;
  }

  onButtonUp() {
      this.isDown = false;
      if (this.isOver) {
          this.bunny.texture = this.textureButtonOver;
      } else {
          this.bunny.texture = this.textureButton;
      }
  }

  onButtonOver(event: any) {
      this.isOver = true;
      if (this.isDown) {
          return;
      }
      this.stateSprite.visible = true;
  }

  onButtonOut() {
      this.isOver = false;
      if (this.isDown) {
          return;
      }
      this.stateSprite.visible = false;

  }
  
}

export default Chequer;
