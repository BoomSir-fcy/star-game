import { effectType, EffectType, RoundDescAttack } from 'game/types';
// import { Graphics, Sprite, Container, Point, Texture } from 'pixi.js';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';
import { Graphics } from '@pixi/graphics';
import { Point } from '@pixi/math';
import { Text } from '@pixi/text';
import config from '../config';
import AxisPoint from './AxisPoint';
import Chequer, { stateType } from './Chequer';

class Combat extends EventTarget {
  x = 0;

  targetX = 0;

  y = 0;

  targetY = 0;

  moving = false;

  attacking = false;

  running = false;

  hp = 0; // 总生命值

  activePh = 0; // 当前生命值

  hpGraphics = new Graphics();

  isEnemy = false;

  displaySprite = new Sprite();

  container = new Container();

  bloodStartY = -20;

  bloodH = 10;

  targetAxisPoint?: AxisPoint;

  startPoint = new Point();

  axisPoint?: AxisPoint;

  speedX = 0;

  speedY = 0;

  moveTime = 500;

  fps = 60;

  attackTarget?: Combat;

  attackInfo?: RoundDescAttack;

  attackEffect = new Text('');

  bullet = {
    moving: true,
    speedX: 0,
    speedY: 0,
    textureS: Texture.from('/assets/bunny.png'),
    textureE: Texture.from('/assets/bunny_saturated.png'),
    sprite: new Sprite(),
  };

  renderPh() {
    this.container.addChild(this.hpGraphics);
    this.drawHp();
  }

  drawHp() {
    const lineX = this.bloodH - 2;
    const lineStartX = -(config.BLOOD_WIDTH / 2) + 1;
    const lineH = lineX / 2 + 1;
    const lineY = this.bloodStartY + lineH;
    this.hpGraphics.clear();

    this.hpGraphics.lineStyle(1, 0xffffff, 1);
    this.hpGraphics.drawRect(
      -(config.BLOOD_WIDTH / 2),
      this.bloodStartY,
      config.BLOOD_WIDTH,
      this.bloodH,
    );
    this.hpGraphics.endFill();

    this.hpGraphics.lineStyle(
      lineX,
      this.isEnemy ? config.BLOOD_COLOR_ENEMY : config.BLOOD_COLOR,
      0.8,
    );
    this.hpGraphics.moveTo(lineStartX, lineY);
    this.hpGraphics.lineTo(
      (this.activePh / this.hp) * (config.BLOOD_WIDTH - 2) + lineStartX,
      lineY,
    );
  }

  drawAttackEffect() {
    this.attackEffect.visible = false;
    this.container.addChild(this.attackEffect);
  }

  updateAttackEffect(type: EffectType) {
    if (type === effectType.BURN) {
      this.attackEffect.text = '灼烧';
    } else if (type === effectType.FREEZE) {
      this.attackEffect.text = '冰冻';
    } else if (type === effectType.REPEL) {
      this.attackEffect.text = '击退';
    }
    this.attackEffect.visible = false;
  }

  renderBullet() {
    try {
      this.container.parent.getChildIndex(this.bullet.sprite);
    } catch (error) {
      this.bullet.sprite.anchor.set(1, 1);
      this.bullet.sprite.visible = false;
      this.container.parent.addChild(this.bullet.sprite);
    }
  }

  /**
   *
   * @param axisPoint 目标坐标
   * @param moveTime 移动时间(ms)
   */
  moveTo(axisPoint: AxisPoint, moveTime?: number) {
    const t = ((moveTime || this.moveTime) / 1000) * 60;

    this.moving = true;
    this.targetAxisPoint = axisPoint;
    axisPoint.chequer.setState(stateType.PREVIEW);
    axisPoint.chequer.displayState(true);
    if (this.axisPoint) {
      this.speedX = (axisPoint.x - this.axisPoint.x) / t;
      this.speedY = (axisPoint.y - this.axisPoint.y) / t;
    }
  }

  handleMove() {
    if (this.moving && this.targetAxisPoint) {
      this.container.position.x += this.speedX;
      this.container.position.y += this.speedY;
      // this.x += this.speedX;
      // this.y += this.speedY;
      if (
        Math.abs(this.container.position.y - (this.targetAxisPoint.y || 0)) <=
          1 &&
        Math.abs(this.container.position.x - (this.targetAxisPoint.x || 0)) <= 1
      ) {
        this.moving = false;
        this.speedX = 0;
        this.speedY = 0;
        this.setPosition(this.targetAxisPoint);
        this.dispatchEvent(new Event('moveEnd'));
      }
    }
  }

  resetPosition() {
    const { x, y } = this.startPoint;

    this.container.position.set(x, y);
  }

  setPosition(point: AxisPoint) {
    this.container.position.set(point.x, point.y);
    this.startPoint.set(point.x, point.y);
    this.axisPoint?.chequer?.setState(stateType.PREVIEW);

    this.axisPoint = point;
    this.axisPoint?.chequer?.setState(stateType.DISABLE);
    this.axisPoint?.chequer?.displayState(false);
  }

  attack(target: Combat, attackInfo?: RoundDescAttack, time?: number) {
    this.attackTarget = target;
    this.attackInfo = attackInfo;
    this.attacking = true;
    this.bulletMove(time);
  }

  bulletMove(moveTime?: number) {
    if (this.attackTarget) {
      const t = ((moveTime || this.moveTime) / 1000) * 60;
      this.renderBullet();
      this.bullet.sprite.scale.set(1);
      this.bullet.moving = true;
      if (this.axisPoint && this.attackTarget?.axisPoint) {
        this.bullet.sprite.position.set(this.axisPoint?.x, this.axisPoint?.y);
        this.bullet.sprite.visible = true;
        this.bullet.speedX =
          (this.attackTarget?.axisPoint?.x - this.axisPoint?.x) / t;
        this.bullet.speedY =
          (this.attackTarget?.axisPoint?.y - this.axisPoint?.y) / t;
        this.bullet.sprite.texture = this.bullet.textureS;
      }
    }
  }

  handleBulletMove() {
    if (this.bullet.moving && this.attackTarget) {
      this.bullet.sprite.position.x += this.bullet.speedX;
      this.bullet.sprite.position.y += this.bullet.speedY;
      // this.x += this.speedX;
      // this.y += this.speedY;
      if (
        Math.abs(
          this.bullet.sprite.position.y -
            (this.attackTarget?.axisPoint?.y || 0),
        ) <= 15 &&
        Math.abs(
          this.bullet.sprite.position.x -
            (this.attackTarget?.axisPoint?.x || 0),
        ) <= 15
      ) {
        this.bullet.sprite.texture = this.bullet.textureE;
        this.bullet.sprite.scale.x += 0.05;
        this.bullet.sprite.scale.y += 0.05;
      }

      if (
        Math.abs(
          this.bullet.sprite.position.y -
            (this.attackTarget?.axisPoint?.y || 0),
        ) <= 1 &&
        Math.abs(
          this.bullet.sprite.position.x -
            (this.attackTarget?.axisPoint?.x || 0),
        ) <= 1
      ) {
        this.bullet.moving = false;
        this.bullet.speedX = 0;
        this.bullet.speedY = 0;
        this.bullet.sprite.visible = false;
        this.attackTarget.activePh += this.attackInfo?.receive_sub_hp || 0;
        this.attackTarget.drawHp();
        this.attacking = false;
      }
    }
  }

  handleAttack() {
    if (this.attacking && this.attackTarget) {
      // 攻击
      // this.displaySprite.rotation += 0.1;
      this.handleBulletMove();
    }
  }

  run() {
    if (!this.running) {
      this.running = true;
      this.handleRun();
    }
  }

  stop() {
    this.running = false;
  }

  handleRun() {
    if (this.running) {
      this.handleMove();
      this.handleAttack();
      requestAnimationFrame(() => this.handleRun());
    }
  }
}

export default Combat;
