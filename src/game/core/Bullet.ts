import { Texture } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import Soldier from './Soldier';

/**
 * 攻击特效
 *
 * 子弹类型 [冰块, 岩石, 导弹, 火球, 机械子弹, ]
 */
class Bullet extends EventTarget {
  constructor(soldier: Soldier) {
    super();
    this.soldier = soldier;
  }

  soldier;

  moving = true;

  speedX = 0;

  speedY = 0;

  textureS = Texture.from('/assets/bunny.png');

  textureE = Texture.from('/assets/bunny_saturated.png');

  sprite = new Sprite();

  /**
   *
   * d
   */
}

export default Bullet;
