import { Sprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import { ColorOverlayFilter } from '@pixi/filter-color-overlay';
import { AnimatedSprite } from '@pixi/sprite-animated';
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
    sprint: new AnimatedSprite([
      Texture.from(effectConfig.effect.bomb.spriteSrc0),
      Texture.from(effectConfig.effect.bomb.spriteSrc0 as string),
    ]),
    // sprint: new Sprite(),
    sprint1: new Sprite(),
    scale: 1,
    positionY: -40,
    load: false,
  };

  [EffectType.ICE] = {
    sprint: new Sprite(),
    sprint1: new Sprite(),
    scale: 0.7,
    positionY: 0,
    load: false,
  };

  [EffectType.FIRING] = {
    sprint: new AnimatedSprite([
      Texture.from(effectConfig.effect.firing.spriteSrc0),
      Texture.from(effectConfig.effect.firing.spriteSrc1 as string),
    ]),
    sprint1: new Sprite(),
    scale: 1,
    positionY: -30,
    load: true,
  };

  [EffectType.ADD_FIRING] = {
    sprint: new AnimatedSprite([
      Texture.from(effectConfig.effect.firing.spriteSrc0),
      Texture.from(effectConfig.effect.firing.spriteSrc1 as string),
    ]),
    sprint1: new Sprite(),
    scale: 1,
    positionY: -30,
    load: false,
  };

  [EffectType.STOP_MOVE] = {
    sprint: new Sprite(),
    sprint1: new Sprite(),
    scale: 0.7,
    positionY: 0,
    load: false,
  };

  [EffectType.SHIELD] = {
    sprint: new Sprite(),
    sprint1: new Sprite(),
    scale: 0.7,
    positionY: 0,
    load: false,
  };

  [EffectType.VENOM] = {
    sprint: new AnimatedSprite([
      Texture.from(effectConfig.effect.venom.spriteSrc0),
      Texture.from(effectConfig.effect.venom.spriteSrc1 as string),
    ]),
    sprint1: new Sprite(),
    scale: 1,
    positionY: -150,
    load: false,
  };

  /**
   *
   * @param type 添加特效
   */
  addEffect(type: EffectType) {
    if (!this.added) {
      this.container.zIndex = this.combat.container.zIndex;
      this.combat.container.addChild(this.container);
      this.added = true;
    }
    if (type === EffectType.BOMB) {
      this.addBombEffect(type);
      return;
    }
    if (type === EffectType.FIRING) {
      this.firingEffect(type);
      return;
    }
    if (type === EffectType.ADD_FIRING) {
      this.addFiringEffect(type);
      return;
    }
    if (type === EffectType.VENOM) {
      this.addVenomEffect(type);
      return;
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
    if (
      type === EffectType.BOMB ||
      type === EffectType.VENOM ||
      type === EffectType.FIRING
    ) {
      this.removeAnimateEffect(type);
      return;
    }
    this[type].sprint.visible = false;
    this[type].sprint1.visible = false;
  }

  /**
   * 添加炸弹特效
   */
  addBombEffect(type: EffectType) {
    const sprite = this[type].sprint as AnimatedSprite;
    const { scale, positionY } = this[type];
    sprite.anchor.set(0.5);
    sprite.zIndex = 1;
    sprite.position.set(0, positionY);
    sprite.scale.set(scale);
    this.addAnimateEffect(type, 0.1, () => {
      if (sprite.scale.x === scale) {
        sprite.scale.set(scale * 1.3);
        sprite.position.set(0, positionY * 1.5);
      } else {
        sprite.scale.set(scale);
        sprite.position.set(0, positionY);
      }
    });
    this[type].load = true;
  }

  /**
   * 添加火焰特效
   */
  addFiringEffect(type: EffectType) {
    const sprite = this[type].sprint as AnimatedSprite;
    const { scale, positionY } = this[type];
    sprite.anchor.set(0.5);
    sprite.zIndex = 2;
    sprite.position.set(0, positionY);
    sprite.scale.set(scale);
    this.addAnimateEffect(type, 0.05);
    this[type].load = true;
  }

  /**
   * 添加火焰特效
   */
  firingEffect(type: EffectType) {
    this.combat.displaySprite.filters = [new ColorOverlayFilter(0xff0000, 0.3)];
    this[type].load = true;
    setTimeout(() => {
      this.combat.displaySprite.filters = [];
    }, 500);
  }

  /**
   * 添加毒液特效
   */
  addVenomEffect(type: EffectType) {
    const sprite = this[type].sprint as AnimatedSprite;
    const { scale, positionY } = this[type];
    sprite.anchor.set(0.5);
    sprite.zIndex = 2;
    sprite.position.set(0, positionY);
    sprite.scale.set(scale);
    this.addAnimateEffect(type, 0.2);

    this.combat.displaySprite.filters = [new ColorOverlayFilter(0x00ff00, 0.3)];
    this[type].load = true;
  }

  /**
   * 添加动画特效
   * @param type
   * @param speed
   */
  addAnimateEffect(type: EffectType, speed: number, animatedFn?: () => void) {
    const sprite = this[type].sprint as AnimatedSprite;
    sprite.animationSpeed = speed;
    sprite.play();
    sprite.onLoop = () => {
      if (animatedFn) animatedFn();
      sprite.play();
    };
    this.container.addChild(sprite);
    sprite.visible = true;
  }

  removeAnimateEffect(type: EffectType) {
    const sprite = this[type].sprint as AnimatedSprite;
    sprite.stop();
    this.combat.displaySprite.filters = null;
    sprite.visible = false;
  }
}

export default EffectBuff;
