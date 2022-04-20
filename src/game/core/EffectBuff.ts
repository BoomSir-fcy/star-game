import { Sprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import type Combat from './Combat';
import { EffectType } from '../types';
import effectConfig from 'game/effectConfig';

class EffectBuff extends EventTarget {
  constructor(combat: Combat) {
    super();
    this.combat = combat;
    this.combat.container.parent.addChild(this.container);
  }

  combat;

  container = new Container();

  [EffectType.BOMB] = {
    sprint: new Sprite(),
    sprint1: new Sprite(),
    load: false,
  };

  [EffectType.ICE] = {
    sprint: new Sprite(),
    sprint1: new Sprite(),
    load: false,
  };

  [EffectType.FIRING] = {
    sprint: new Sprite(),
    sprint1: new Sprite(),
    load: false,
  };

  [EffectType.STOP_MOVE] = {
    sprint: new Sprite(),
    sprint1: new Sprite(),
    load: false,
  };

  [EffectType.SHIELD] = {
    sprint: new Sprite(),
    sprint1: new Sprite(),
    load: false,
  };

  addEffect(type: EffectType) {
    if (this[type].load) {
      this[type].sprint.visible = true;
      this[type].sprint1.visible = true;
    } else {
      this.loadEffect(type);
    }
  }

  loadEffect(type: EffectType) {
    this[type].sprint.texture = Texture.from(
      effectConfig.effect[type].spriteSrc0,
    );
    const { spriteSrc1 } = effectConfig.effect[type];
    if (spriteSrc1) {
      this[type].sprint1.texture = Texture.from(spriteSrc1);
    }
  }
}

export default EffectBuff;
