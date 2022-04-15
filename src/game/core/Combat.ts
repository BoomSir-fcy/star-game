import {
  BulletType,
  effectType,
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

export interface CombatOptions {
  texture0: string;
  texture1: string;
}

class Combat extends EventTarget {
  constructor(options: CombatOptions) {
    super();
    this.texture0 = Texture.from(options.texture0);
    this.texture1 = Texture.from(options.texture1);
  }

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

  hpText = new Text('', { fill: 0xffffff, fontSize: 32 });

  isEnemy = false;

  displaySprite = new Sprite();

  texture0;

  texture1;

  container = new Container();

  bloodStartY = -20;

  bloodH = 20;

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

  renderPh() {
    this.container.addChild(this.hpGraphics);
    this.hpText.anchor.set(0.5);
    this.hpText.position.set(0, 20);
    this.hpText.zIndex = 2;
    this.hpGraphics.zIndex = 2;
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

  drawHp(now = '') {
    const lineX = this.bloodH - this.bloodBorderW * 2;
    const lineStartX = -(config.BLOOD_WIDTH / 2) + this.bloodBorderW;
    const lineH = lineX / 2 + this.bloodBorderW;
    const lineY = this.bloodStartY + lineH;
    this.hpGraphics.clear();

    this.hpGraphics.lineStyle(this.bloodBorderW, 0xffffff, 1);
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
      (this.activePh / this.hp) * (config.BLOOD_WIDTH - this.bloodBorderW * 2) +
        lineStartX,
      lineY,
    );
    this.hpText.text = `${this.activePh}/${now}`;
  }

  drawAttackEffect() {
    this.attackEffect.anchor.set(0.5);
    this.attackEffect.position.set(0, -50);
    // this.attackEffect.visible = false;
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
    const t = ((moveTime || this.moveTime) / 1000) * 60;

    this.moving = true;
    this.targetAxisPoint = axisPoint;
    axisPoint.chequer.setState(stateType.PREVIEW);
    axisPoint.chequer.displayState(true);
    this.flipTargetPointOrientation();
    if (this.axisPoint) {
      this.speedX = (axisPoint.x - this.axisPoint.x) / t;
      this.speedY = (axisPoint.y - this.axisPoint.y) / t;

      this.doubleSpeedX = Math.abs(this.speedX * 2);
      this.doubleSpeedY = Math.abs(this.speedY * 2);
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

  attack(
    target: Combat,
    effect: EffectType,
    attackInfo?: RoundDesc,
    time?: number,
  ) {
    this.attackTarget = target;
    this.attackInfo = attackInfo;
    console.log(this.attackInfo, effect);
    this.attacking = true;
    this.targetAxisPoint = target.axisPoint;
    this.flipTargetPointOrientation();

    this.renderBullet();
    if (this.bullet) {
      this.bullet.bulletMove(target, effect, time);
    }
  }

  attackParabola(target: Combat, effect: EffectType) {
    this.renderBullet();
    if (this.bullet) {
      this.bullet.parabolaBullet(target, effect);
    }
  }

  attackParabolaEffect(target: Combat, effect: BulletType) {
    this.renderBullet();
    if (this.bullet) {
      this.bullet.parabolaBulletEffect(target, effect);
    }
  }

  onAttackEnd() {
    this.dispatchEvent(new Event('attackEnd'));
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
        this.bullet.handleBulletMove();
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
      this.handleMove();
      this.handleAttack();
      requestAnimationFrame(() => this.handleRun());
    }
  }

  once(event: string, handle: any) {
    const callback = () => {
      handle();
      this.removeEventListener(event, callback);
    };
    this.addEventListener(event, callback);
  }
}

export default Combat;
