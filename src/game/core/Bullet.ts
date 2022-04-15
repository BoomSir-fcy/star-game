import { Texture } from '@pixi/core';
import { Loader, LoaderResource } from '@pixi/loaders';
import { Dict } from '@pixi/utils';
import { Sprite } from '@pixi/sprite';
import { Container } from '@pixi/display';
import { Text } from '@pixi/text';
import { Spine } from 'pixi-spine';
import config from 'game/config';
import effectConfig from 'game/effectConfig';
import { BulletType, EffectType, Skill } from 'game/types';
import type Combat from './Combat';
import { getEffectText, getSkillText } from './utils';
import Parabola from './Parabola';

/**
 * 攻击特效
 *
 * 子弹类型 [冰块, 岩石, 导弹, 火球, 机械子弹, ]
 */

interface EffectInfo {
  loaded: boolean;
  await: boolean;
  spine: null | Spine;
  res: null | Dict<LoaderResource>;
}

type Effects = {
  [effect in BulletType]: EffectInfo;
};
class Bullet extends EventTarget {
  constructor(combat: Combat) {
    super();
    this.combat = combat;
    this.text.anchor.set(0.5);
    this.container.addChild(this.text);
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

  effects: Effects = {
    ice: {
      loaded: false,
      await: false,
      spine: null,
      res: null,
    },
    rock: {
      loaded: false,
      await: false,
      spine: null,
      res: null,
    },
  };

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
    this.loadSpine(effectConfig.ice.name, effectConfig.ice.resDir);
    this.effects[effectConfig.ice.name].await = true;
    this.container.visible = true;

    this.text.text = getEffectText(effect);
    if (this.combat.axisPoint && attackTarget?.axisPoint) {
      const parabola = new Parabola(
        this.text,
        this.combat.axisPoint,
        attackTarget.axisPoint,
      );
      parabola.position().move();
      parabola.addEventListener('end', () => {
        this.container.visible = false;
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
    loader.reset();

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
        console.log(12112);
      }
      if (this.effects[name].await) {
        this.onAssetsLoadedSpine(name);
      }
    });
  }

  onAssetsLoadedSpine(name: BulletType) {
    console.log(this, name);
    this.container.visible = true;
    const { spine } = this.effects[name];
    console.log(spine);
    if (spine) {
      spine.state.setAnimation(5, 'play', true);
      // this.spineAnimation(spine);
    }
    // if (loaderRes.spineData) {
    //   const dragon = new Spine(loaderRes.spineData);
    //   dragon.update(0);
    //   dragon.autoUpdate = false;
    //   dragon.position.set(300, 300);
    //   dragon.state.setAnimation(8, 'play', true);
    //   dragon.update(0.01666666666667); // HARDCODED FRAMERATE!
    //   console.log(this);
    // }
  }

  spineAnimation(spine: Spine) {
    if (spine) {
      // console.log(121221);
      this.container.visible = true;
      // spine.state.setAnimation(0, 'play', true);
      spine.update(0.01666666666667);
      requestAnimationFrame(() => this.spineAnimation(spine));
    }
  }

  /**
   *
   * d
   */
}

export default Bullet;
