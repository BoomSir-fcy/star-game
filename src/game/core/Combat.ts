import {
  bulletType,
  BulletType,
  descType,
  DescType,
  EffectType,
  Orientation,
  RoundDesc,
  RoundDescAttack,
} from 'game/types';
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
import Bullet from './Bullet';
import LinearMove from './LinearMove';
import { getEffectText } from './utils';
import EffectBuff from './EffectBuff';
import { descOfEffect } from '../effectConfig';

export interface CombatOptions {
  // texture0: string;
  // texture1: string;
  srcId: string;
  race: number;
}

class Combat extends EventTarget {
  constructor(options: CombatOptions) {
    super();
    this.race = options.race;
    this.srcId = options.srcId;
    this.textureRes = Combat.getSpriteRes(options.race, options.srcId, 2);
    this.texture0 = Texture.from(this.textureRes);
    this.texture1 = Texture.from(
      Combat.getSpriteRes(options.race, options.srcId, 2),
    );

    this.effectBuff = new EffectBuff(this);
  }

  x = 0;

  targetX = 0;

  y = 0;

  targetY = 0;

  race = 1;

  srcId = '';

  textureRes = '';

  moving = false;

  attacking = false;

  running = false;

  hp = 0; // 总生命值

  activePh = 0; // 当前生命值

  hpGraphics = new Graphics();

  hpText = new Text('', { fill: 0xff0000, fontSize: 32 });

  isEnemy = false;

  displaySprite = new Sprite();

  texture0;

  texture1;

  container = new Container();

  bloodStartY = -20;

  bloodH = 10;

  bloodBorderW = 2;

  targetAxisPoint?: AxisPoint;

  startPoint = new Point();

  axisPoint?: AxisPoint;

  speedX = 0;

  speedY = 0;

  doubleSpeedX = 0;

  doubleSpeedY = 0;

  moveTime = 500;

  fps = 60;

  attackTarget?: Combat;

  attackInfo?: RoundDesc;

  bullet?: Bullet;

  attackEffect = new Text('', { fill: 0xffffff, fontSize: 32 });

  orientation = Orientation.TO_RIGHT_DOWN;

  effectBuff;

  renderPh() {
    this.container.addChild(this.hpGraphics);
    this.hpText.anchor.set(0.5);
    this.hpText.zIndex = 2;
    this.hpGraphics.zIndex = 2;
    this.hpGraphics.position.set(0, -80);
    this.hpText.position.set(0, -110);
    this.container.addChild(this.hpText);
    this.drawHp();
  }

  showEffectText(text: string) {
    this.attackEffect.text = text;
    this.attackEffect.visible = true;
  }

  hideEffectText() {
    this.attackEffect.visible = false;
  }

  setActiveHp(hp: number) {
    this.activePh = hp;
    this.drawHp();
  }

  drawHp(now = '') {
    const lineX = this.bloodH - this.bloodBorderW * 2;
    const lineStartX = -(config.BLOOD_WIDTH / 2) + this.bloodBorderW;
    const lineH = lineX / 2 + this.bloodBorderW;
    const lineY = this.bloodStartY + lineH;
    this.hpGraphics.clear();

    // 绘制血条底色
    this.hpGraphics.beginFill(config.BLOOD_COLOR_BACK);
    this.hpGraphics.drawRect(
      lineStartX,
      lineY,
      config.BLOOD_WIDTH,
      config.BLOOD_HEIGHT,
    );
    this.hpGraphics.endFill();

    // 绘制当前血量
    this.hpGraphics.beginFill(
      this.isEnemy ? config.BLOOD_COLOR_ENEMY : config.BLOOD_COLOR,
    );
    this.hpGraphics.drawRect(
      lineStartX,
      lineY,
      (this.activePh / this.hp) * config.BLOOD_WIDTH,
      config.BLOOD_HEIGHT,
    );
    this.hpGraphics.endFill();

    // 绘制格子
    const per = Math.ceil(this.hp / config.BLOOD_PER);
    const perW = (config.BLOOD_WIDTH / this.hp) * config.BLOOD_PER;
    const lineW = per > 30 ? 1 : 2;

    for (let i = 1; i < per; i++) {
      this.hpGraphics.beginFill(config.BLOOD_COLOR_BACK);
      this.hpGraphics.drawRect(
        lineStartX + perW * i,
        lineY,
        lineW,
        config.BLOOD_HEIGHT,
      );
      this.hpGraphics.endFill();
    }

    // this.hpGraphics.lineStyle(
    //   lineX,
    //   this.isEnemy ? config.BLOOD_COLOR_ENEMY : config.BLOOD_COLOR,
    // );
    // this.hpGraphics.moveTo(lineStartX, lineY);
    // this.hpGraphics.lineTo(
    //   (this.activePh / this.hp) * (config.BLOOD_WIDTH - this.bloodBorderW * 2) +
    //     lineStartX,
    //   lineY,
    // );
    this.hpText.style.fill = this.isEnemy
      ? config.BLOOD_COLOR_ENEMY
      : config.BLOOD_COLOR;
    this.hpText.text = `${this.activePh}`;
  }

  drawAttackEffect() {
    this.attackEffect.anchor.set(0.5);
    this.attackEffect.position.set(0, -20);
    this.attackEffect.visible = false;
    this.attackEffect.zIndex = 100;
    this.container.addChild(this.attackEffect);
  }

  renderBullet() {
    if (!this.bullet) {
      this.drawAttackEffect();
      this.bullet = new Bullet(this);
      this.bullet.container.visible = false;
      this.container.parent.addChild(this.bullet.container);
      this.bullet.addEventListener('attackEnd', () => {
        this.onAttackEnd();
      });
    }
  }

  /**
   *
   * @param axisPoint 目标坐标
   * @param moveTime 移动时间(ms)
   */
  moveTo(axisPoint: AxisPoint, moveTime?: number) {
    // const t = ((moveTime || this.moveTime) / 1000) * 60;

    // this.moving = true;
    // this.targetAxisPoint = axisPoint;
    // axisPoint.chequer.setState(stateType.PREVIEW);
    // axisPoint.chequer.displayState(true);
    // this.flipTargetPointOrientation();
    // if (this.axisPoint) {
    //   this.speedX = (axisPoint.x - this.axisPoint.x) / t;
    //   this.speedY = (axisPoint.y - this.axisPoint.y) / t;

    //   this.doubleSpeedX = Math.abs(this.speedX * 2);
    //   this.doubleSpeedY = Math.abs(this.speedY * 2);
    // }
    if (this.axisPoint) {
      const linearMove = new LinearMove(
        this.container,
        this.axisPoint,
        axisPoint,
      );
      linearMove.addEventListener('end', () => {
        this.setPosition(axisPoint);
        this.dispatchEvent(new Event('moveEnd'));
      });
      linearMove.move();
    }
  }

  flipTargetPointOrientation() {
    if (this.targetAxisPoint && this.axisPoint) {
      if (this.targetAxisPoint.axisX - this.axisPoint?.axisX > 0) {
        this.orientation = Orientation.TO_RIGHT_DOWN;
        this.displaySprite.texture = this.texture0;
        this.displaySprite.scale.x = Math.abs(this.displaySprite.scale.x);
      } else if (this.targetAxisPoint.axisX - this.axisPoint?.axisX < 0) {
        this.orientation = Orientation.TO_LEFT_UP;
        this.displaySprite.texture = this.texture1;
        this.displaySprite.scale.x = -Math.abs(this.displaySprite.scale.x);
      } else if (this.targetAxisPoint.axisY - this.axisPoint?.axisY > 0) {
        this.orientation = Orientation.TO_LEFT_DOWN;
        this.displaySprite.texture = this.texture0;
        this.displaySprite.scale.x = -Math.abs(this.displaySprite.scale.x);
      } else if (this.targetAxisPoint.axisY - this.axisPoint?.axisY < 0) {
        this.orientation = Orientation.TO_RIGHT_UP;
        this.displaySprite.texture = this.texture1;
        this.displaySprite.scale.x = Math.abs(this.displaySprite.scale.x);
      }
    }
    return this;
  }

  handleMove() {
    if (this.moving && this.targetAxisPoint) {
      this.container.position.x += this.speedX;
      this.container.position.y += this.speedY;
      // this.x += this.speedX;
      // this.y += this.speedY;
      if (
        Math.abs(this.container.position.y - (this.targetAxisPoint.y || 0)) <=
          this.doubleSpeedY &&
        Math.abs(this.container.position.x - (this.targetAxisPoint.x || 0)) <=
          this.doubleSpeedX
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

  // 碰撞
  beatCollision(target: Combat, attackInfo?: RoundDesc) {
    const point = this.axisPoint?.clone();
    if (target.axisPoint && this.axisPoint) {
      const linearMove = new LinearMove(
        this.container,
        this.axisPoint,
        target.axisPoint,
      );
      linearMove.addEventListener('end', () => {
        if (point && target.axisPoint) {
          const linearMove1 = new LinearMove(
            this.container,
            target.axisPoint,
            point,
          );
          linearMove1.addEventListener('end', () => {
            this.dispatchEvent(new Event('collisionEnd'));
          });
          linearMove1.move();
        }
      });
      linearMove.move();
      // this.once('moveEnd', () => {
      //   if (point) {
      //     this.moveTo(point);
      //   }
      //   this.dispatchEvent(new Event('collisionEnd'));
      // });
      // this.moveTo(target.axisPoint);
      // return;
    } else {
      this.dispatchEvent(new Event('collisionEnd'));
    }
  }

  attack(
    target: Combat,
    effect: DescType,
    attackInfo?: RoundDesc,
    time?: number,
  ) {
    this.attackTarget = target;
    this.attackInfo = attackInfo;
    this.attacking = true;
    this.targetAxisPoint = target.axisPoint;
    this.flipTargetPointOrientation();

    const bullet = new Bullet(this);

    bullet.addEventListener('moveEnd', () => {
      this.changeEffect(effect, target);
      this.onBulletMoveEnd();
    });

    bullet.addEventListener('attackEnd', () => {
      this.onAttackEnd();
    });

    bullet.attack(bulletType.BULLET, target, effect);
  }

  changeEffect(_effect: DescType, target?: Combat) {
    const soldier = target || this;
    const { effect, add, remove } = descOfEffect[_effect];
    if (effect) {
      if (add) {
        soldier.effectBuff.addEffect(effect);
      }
      if (remove) {
        soldier.effectBuff.removeEffect(effect);
      }
    }
    // if (config.showEffect.includes(effect)) {
    //   this.showEffectText(getEffectText(effect));
    // }
    // if (config.hideEffect.includes(effect)) {
    //   this.hideEffectText();
    // }
  }

  addEffect(effect: DescType) {
    if (config.showEffect.includes(effect)) {
      this.showEffectText(getEffectText(effect));
    }
    if (config.hideEffect.includes(effect)) {
      this.hideEffectText();
    }
  }

  attackAk47(target: Combat) {
    const bullet = new Bullet(this);
    const { container } = bullet;
    this.container.parent.addChild(container);
    bullet.attack(bulletType.BULLET, target);
  }

  attackParabola(target: Combat, effect: DescType) {
    this.renderBullet();
    // if (this.bullet) {
    //   this.bullet.parabolaBullet(target, effect);
    // }
  }

  attackParabolaEffect(target: Combat, effect: BulletType) {
    const bullet = new Bullet(this);
    const { container } = bullet;
    this.container.parent.addChild(container);
    bullet.attack(effect, target);
    bullet.addEventListener('moveEnd', () => {
      this.effectBuff.addEffect(EffectType.SHIELD);
    });
    bullet.addEventListener('attackEnd', () => {
      this.onAttackEnd();
    });
    // this.renderBullet();
    // if (this.bullet) {
    //   // this.bullet.testAttack(effect, target);
    //   this.attackAk47(target);
    //   bullet.attack(effect, target);

    //   // this.bullet.test();
    // }
  }

  onBulletMoveEnd() {
    this.dispatchEvent(new Event('bulletMoveEnd'));
  }

  onAttackEnd() {
    this.dispatchEvent(new Event('attackEnd'));
    this.attacking = false;
    // if ((this.attackInfo as any)?.now_hp && this.attackTarget) {
    //   this.attackTarget.drawHp(`${(this.attackInfo as any)?.now_hp}`);

    //   // this.attackTarget?.dispatchEvent(new Event('death'));
    // }
  }

  handleAttack() {
    if (this.attacking && this.attackTarget) {
      // 攻击
      // this.displaySprite.rotation += 0.1;
      if (this.bullet) {
        // this.bullet.handleBulletMove();
      }
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
      // this.handleMove();
      // this.handleAttack();
      // requestAnimationFrame(() => this.handleRun());
    }
  }

  once(event: string, handle: any) {
    const callback = () => {
      handle();
      this.removeEventListener(event, callback);
    };
    this.addEventListener(event, callback);
  }

  static getSpriteRes(race: number, resId: string, index: number) {
    return `/assets/modal/${1}/${resId}-${index}.png`;
  }
}

export default Combat;
