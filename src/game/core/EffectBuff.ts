import { Sprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import type Combat from './Combat';
import { EffectType } from '../types';
import effectConfig from '../effectConfig';

/**
 * buff效果 如冰冻 灼烧
 */
class EffectBuff extends EventTarget {
  constructor(combat: Combat) {
    super();
    this.combat = combat;
  }

  combat;

  container = new Container();

  added = false;

  [EffectType.BOMB] = {
    sprint: new Sprite(),
    sprint1: new Sprite(),
    scale: 0.7,
    load: false,
  };

  [EffectType.ICE] = {
    sprint: new Sprite(),
    sprint1: new Sprite(),
    scale: 0.7,
    load: false,
  };

  [EffectType.FIRING] = {
    sprint: new Sprite(),
    sprint1: new Sprite(),
    scale: 0.7,
    load: false,
  };

  [EffectType.STOP_MOVE] = {
    sprint: new Sprite(),
    sprint1: new Sprite(),
    scale: 0.7,
    load: false,
  };

  [EffectType.SHIELD] = {
    sprint: new Sprite(),
    sprint1: new Sprite(),
    scale: 0.7,
    load: false,
  };

  /**
   *
   * @param type 添加特效
   */
  addEffect(type: EffectType) {
    if (!this.added) {
      this.combat.container.addChild(this.container);
      this.added = true;
    }
    if (this.combat.container)
      if (this[type].load) {
        this[type].sprint.visible = true;
        this[type].sprint1.visible = true;
      } else {
        this.loadEffect(type);
      }
  }

  /**
   * @dev 加载特效
   * @param type
   */
  loadEffect(type: EffectType) {
    this[type].sprint.texture = Texture.from(
      effectConfig.effect[type].spriteSrc0,
    );
    this[type].sprint.anchor.set(0.5);
    this[type].sprint.position.set(0);
    this[type].sprint.scale.set(this[type].scale);
    this.container.addChild(this[type].sprint);
    const { spriteSrc1 } = effectConfig.effect[type];
    if (spriteSrc1) {
      this[type].sprint1.texture = Texture.from(spriteSrc1);
      this.container.addChild(this[type].sprint1);
      this[type].sprint1.anchor.set(0.5);
      this[type].sprint1.position.set(0, -20);
      this[type].sprint1.scale.set(this[type].scale);
    }
    this[type].load = true;
    this.addEffect(type);
  }

  /**
   * 移除特效
   * @param type
   */
  removeEffect(type: EffectType) {
    this[type].sprint.visible = false;
    this[type].sprint1.visible = false;
  }
}

export default EffectBuff;
