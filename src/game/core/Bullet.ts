import { Texture } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import { Container } from '@pixi/display';
import { Text } from '@pixi/text';
import config from 'game/config';
import { EffectType, Skill } from 'game/types';
import type Combat from './Combat';
import { getEffectText, getSkillText } from './utils';

/**
 * 攻击特效
 *
 * 子弹类型 [冰块, 岩石, 导弹, 火球, 机械子弹, ]
 */
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

  /**
   *
   * d
   */
}

export default Bullet;
