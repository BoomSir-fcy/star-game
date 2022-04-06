import { Sprite, Texture } from 'pixi.js';
import Combat from './Combat';

interface SoldierOptions {
  textureRes: string;
  x: number;
  y: number;
}
class Soldier extends Combat {

  constructor(options: SoldierOptions) {
    super();
    this.init(options)
  }

  type = 0; // 什么类型的士兵

  init({ textureRes, x, y }: SoldierOptions) {
    this.displaySprite.texture = Texture.from(textureRes);
    this.displaySprite.anchor.set(0.5);
    this.container.x = x;
    this.container.y = y;
    this.displaySprite.width = 60;
    this.displaySprite.height = 60;
    this.container.addChild(this.displaySprite)
  }
}

export default Soldier;
