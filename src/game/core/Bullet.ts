import { Texture } from '@pixi/core';
import { Loader, LoaderResource } from '@pixi/loaders';
import { Dict } from '@pixi/utils';
import { Sprite } from '@pixi/sprite';
import { Container } from '@pixi/display';
import { Text } from '@pixi/text';
import { Spine } from 'pixi-spine';
import config from 'game/config';
import effectConfig from 'game/effectConfig';
import {
  BulletType,
  EffectItemInfoOfConfig,
  EffectType,
  Skill,
} from 'game/types';
import type Combat from './Combat';
import { getEffectText, getSkillText } from './utils';
import Parabola from './Parabola';

/**
 * 攻击特效
 *
 * 子弹类型 [冰块, 岩石, 导弹, 火球, 机械子弹, ]
 */

interface EffectInfo extends EffectItemInfoOfConfig {
  loaded: boolean;
  await: boolean;
  spine: null | Spine;
  res: null | Dict<LoaderResource>;
  sprite: Sprite;
  complete: boolean;
}

type Effects = {
  [effect in BulletType]: EffectInfo;
};

const initEffectInfo = ({
  name,
  resDir,
  spriteRes,
}: EffectItemInfoOfConfig) => {
  return {
    loaded: false,
    await: false,
    spine: null,
    res: null,
    sprite: new Sprite(),
    complete: false,
    name,
    resDir,
    spriteRes,
  };
};
class Bullet extends EventTarget {
  constructor(combat: Combat) {
    super();
    this.combat = combat;
    this.text.anchor.set(0.5);
    this.container.addChild(this.text);
    const temp: Effects = {};
    effectConfig.effects.forEach(item => {
      temp[item.name] = initEffectInfo(item);
    });
    this.effects = temp;
  }

  combat;

  moving = true;

  speedX = 0;

  speedY = 0;

  doubleSpeedX = 0;

  doubleSpeedY = 0;

  textureS = Texture.from('/assets/bunny.png');

  textureE = Texture.from('/assets/bunny_saturated.png');

  sprite = new Sprite();

  container = new Container();

  text = new Text('', { fill: 0xffffff, fontSize: 22 });

  attackTarget?: Combat;

  effect?: EffectType;

  effects: Effects;

  bulletMove(attackTarget: Combat, effect: EffectType, moveTime?: number) {
    this.attackTarget = attackTarget;
    this.effect = effect;
    if (this.attackTarget) {
      const t = ((moveTime || this.combat.moveTime) / 1000) * 60;
      this.moving = true;
      if (this.combat.axisPoint && this.attackTarget?.axisPoint) {
        this.container.position.set(
          this.combat.axisPoint?.x,
          this.combat.axisPoint?.y,
        );
        this.container.visible = true;
        this.speedX =
          (this.attackTarget?.axisPoint?.x - this.combat.axisPoint?.x) / t;
        this.speedY =
          (this.attackTarget?.axisPoint?.y - this.combat.axisPoint?.y) / t;

        this.doubleSpeedX = Math.abs(this.speedX * 2);
        this.doubleSpeedY = Math.abs(this.speedY * 2);

        this.text.text = getEffectText(effect);
      }
    }
  }

  parabolaBullet(attackTarget: Combat, effect: EffectType) {
    const { name, resDir, spriteRes } = this.effects.ice;
    this.attackTarget = attackTarget;
    if (this.effects[name].loaded) {
      this.parabolaBulletRun(name);
    } else {
      this.loadSpine(name, resDir);
      this.effects[name].await = true;
      this.effects[name].sprite.anchor.set(0.5);
      this.effects[name].sprite.texture = Texture.from(spriteRes);
      this.container.addChild(this.effects[name].sprite);
    }
    this.container.visible = true;
  }

  parabolaBulletRun(name: BulletType) {
    this.effects[name].sprite.visible = true;
    if (this.combat.axisPoint && this.attackTarget?.axisPoint) {
      const parabola = new Parabola(
        this.effects[name].sprite,
        this.combat.axisPoint,
        this.attackTarget.axisPoint,
      );
      parabola.position().move();
      parabola.addEventListener('end', () => {
        // this.container.visible = false;
        console.log(this.effects[name].sprite);
        const { x, y } = this.effects[name].sprite;
        this.onAssetsLoadedSpine(name, x, y);
        this.effects[name].sprite.visible = false;
      });
    }
  }

  handleBulletMove() {
    if (this.moving && this.attackTarget) {
      this.container.position.x += this.speedX;
      this.container.position.y += this.speedY;
      // this.x += this.speedX;
      // this.y += this.speedY;
      // if (
      //   Math.abs(
      //     this.container.position.y -
      //       (this.attackTarget?.axisPoint?.y || 0),
      //   ) <= 15 &&
      //   Math.abs(
      //     this.container.position.x -
      //       (this.attackTarget?.axisPoint?.x || 0),
      //   ) <= 15
      // ) {
      //   this.container.texture = this.bullet.textureE;
      //   this.container.scale.x += 0.05;
      //   this.container.scale.y += 0.05;
      // }
      if (
        Math.abs(
          this.container.position.y - (this.attackTarget?.axisPoint?.y || 0),
        ) <= this.doubleSpeedX &&
        Math.abs(
          this.container.position.x - (this.attackTarget?.axisPoint?.x || 0),
        ) <= this.doubleSpeedY
      ) {
        this.onEnd();
      }
    }
  }

  onEnd() {
    this.moving = false;
    this.speedX = 0;
    this.speedY = 0;
    this.container.visible = false;
    if (this.attackTarget) {
      this.attackTarget.activePh -= this.combat.attackInfo?.receive_sub_hp || 0;
      console.log(
        this.effect,
        this.combat.attackInfo?.receive_sub_hp || 0,
        this.combat.attackInfo,
      );
      console.log('===================');
      if ((this.combat.attackInfo as any)?.now_hp) {
        this.attackTarget.drawHp(`${(this.combat.attackInfo as any).now_hp}`);
      }

      this.combat.attacking = false;
      // if (this.effect) {
      //   this.attackTarget.showEffectText(getEffectText(this.effect));
      // }
      if (this.effect && config.showEffect.includes(this.effect)) {
        this.attackTarget.showEffectText(getEffectText(this.effect));
      }
      if (this.effect && config.hideEffect.includes(this.effect)) {
        this.attackTarget.hideEffectText();
      }
    }
    this.dispatchEvent(new Event('attackEnd'));
  }

  loadSpine(name: BulletType, src: string) {
    console.log(this.effects[name].loaded, '===');
    if (this.effects[name].loaded) return;
    const loader = Loader.shared;
    // loader.reset();

    loader.add(name, src).load((_loader, res: Dict<LoaderResource>) => {
      this.effects[name].loaded = true;
      this.effects[name].res = res;
      const loaderRes = res[name];
      console.log(loaderRes.spineData);
      if (loaderRes.spineData) {
        const spine = new Spine(loaderRes.spineData);
        this.container.addChild(spine);
        console.log(this.container);
        this.effects[name].spine = spine;
        // spine.anchor.set(0.5);
        spine.position.set(
          // this.attackTarget.axisPoint.x,
          // this.attackTarget.axisPoint.y,
          0,
          0,
        );
        if (this.attackTarget?.axisPoint) {
          spine.position.set(
            // this.attackTarget.axisPoint.x,
            // this.attackTarget.axisPoint.y,
            200,
            200,
          );
        }
        spine.update(0);
        spine.autoUpdate = false;
        // spine.state = true;
        console.log(12112);
      }
      if (this.effects[name].await) {
        this.parabolaBulletRun(name);
      }
    });
  }

  onAssetsLoadedSpine(name: BulletType, x?: number, y?: number) {
    this.container.visible = true;
    const { spine } = this.effects[name];
    if (spine) {
      spine.position.set(x, y);
      spine.state.setAnimation(0, 'play', false);
      this.effects[name].complete = false;
      spine.state.addListener({
        complete: entry => {
          this.onComplete(name);
        },
      });
      this.spineAnimation(spine, name);
    }
  }

  onComplete(name: BulletType) {
    this.effects[name].complete = true;
    this.dispatchEvent(new Event('complete'));
  }

  spineAnimation(spine: Spine, name: BulletType) {
    if (spine && !this.effects[name].complete) {
      console.log(21121);
      this.container.visible = true;
      spine.update(0.01666666666667);
      requestAnimationFrame(() => this.spineAnimation(spine, name));
    }
  }

  /**
   *
   * d
   */
}

export default Bullet;
