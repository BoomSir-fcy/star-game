import { Texture } from '@pixi/core';
import { Sprite } from '@pixi/sprite';

class Bullet extends EventTarget {
  constructor() {
    super();
  }

  moving = true;
  speedX = 0;
  speedY = 0;
  textureS = Texture.from('/assets/bunny.png');
  textureE = Texture.from('/assets/bunny_saturated.png');
  sprite = new Sprite();
}

export default Bullet;
