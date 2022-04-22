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

/**
 * 士兵
 */
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

  y = 0;

  race = 1;

  srcId = '';

  textureRes = '';

  moving = false;

  attacking = false;

  running = false;

  hp = 0; // 总生命值

  activePh = 0; // 当前生命值

  shield = 0;

  hpGraphics = new Graphics();

  hpText = new Text('', { fill: 0xff0000, fontSize: 32 });

  isEnemy = false;

  displaySprite = new Sprite();

  texture0;

  texture1;

  container = new Container();

  bloodStartY = -20; // 血条位置

  targetAxisPoint?: AxisPoint;

  startPoint = new Point();

  axisPoint?: AxisPoint;

  attackTarget?: Combat;

  attackInfo?: RoundDesc;

  bullet?: Bullet;

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

  setActiveHp(hp: number) {
    this.activePh = hp;
    this.drawHp();
  }

  setActiveShield(shield: number) {
    this.shield = shield;
    this.drawHp();
  }

  setActiveHpWithShield(hp: number, shield: number) {
    this.activePh = hp;
    this.shield = shield;
    this.drawHp();
  }

  drawHp(now = '') {
    const lineX = config.BLOOD_HEIGHT;
    const lineStartX = -(config.BLOOD_WIDTH / 2);
    const lineH = lineX / 2;
    const lineY = this.bloodStartY + lineH;
    const hpAndShield = this.hp + this.shield;

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
      (this.activePh / hpAndShield) * config.BLOOD_WIDTH,
      config.BLOOD_HEIGHT,
    );
    this.hpGraphics.endFill();

    // 绘制护盾
    this.hpGraphics.beginFill(config.BLOOD_COLOR_SHIELD);
    this.hpGraphics.drawRect(
      lineStartX + (this.activePh / hpAndShield) * config.BLOOD_WIDTH,
      lineY,
      (this.shield / hpAndShield) * config.BLOOD_WIDTH,
      config.BLOOD_HEIGHT,
    );
    this.hpGraphics.endFill();

    // 绘制血条格子
    const per = Math.ceil(hpAndShield / config.BLOOD_PER);
    const perW = (config.BLOOD_WIDTH / hpAndShield) * config.BLOOD_PER;
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

    this.hpText.style.fill = this.isEnemy
      ? config.BLOOD_COLOR_ENEMY
      : config.BLOOD_COLOR;
    this.hpText.text = `${this.activePh}`;
  }

  /**
   *
   * @param axisPoint 目标坐标
   * @param moveTime 移动时间(ms)
   */
  moveTo(axisPoint: AxisPoint, moveTime?: number) {
    this.targetAxisPoint = axisPoint;
    if (this.axisPoint) {
      this.flipTargetPointOrientation();
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

  // 更换方向
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

  // 重置位置 用于拖动的时候
  resetPosition() {
    const { x, y } = this.startPoint;

    this.container.position.set(x, y);
  }

  // 设置位置
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
          const bullet = new Bullet(this);
          bullet.attack(bulletType.BUMP, target);
          linearMove1.addEventListener('end', () => {
            this.dispatchEvent(new Event('collisionEnd'));
          });
          linearMove1.move();
        }
      });
      linearMove.move();
    } else {
      this.dispatchEvent(new Event('collisionEnd'));
    }
  }

  /**
   * @dev 攻击
   * @param target 攻击目标
   * @param effect 攻击类型
   * @param attackInfo 攻击详情
   * @param time
   */
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
      // this.changeEffect(effect, target);
      this.onBulletMoveEnd();
    });

    bullet.addEventListener('attackEnd', () => {
      this.onAttackEnd();
    });

    if (effect === descType.ADD_BOOM) {
      bullet.attack(bulletType.FIREBALL, target);
    } else if (effect === descType.ADD_FIRING) {
      bullet.attack(bulletType.FIREBALL, target);
    } else if (effect === descType.ATTACK) {
      bullet.attack(bulletType.BULLET, target);
    } else if (effect === descType.ADD_SHIELD) {
      bullet.attack(bulletType.ROCK, target);
    } else if (effect === descType.BEAT) {
      bullet.attack(bulletType.ROCK, target);
    } else if (effect === descType.BOOM) {
      bullet.attack(bulletType.BUMP, target);
    } else if (effect === descType.FIRING) {
      bullet.attack(bulletType.FIREBALL, target);
    } else if (effect === descType.ICE_END) {
      bullet.attack(bulletType.FIREBALL, target);
    } else if (effect === descType.ICE_START) {
      bullet.attack(bulletType.ICE, target);
    } else {
      bullet.attack(bulletType.ICE, target, effect);
    }
  }

  /**
   * @dev 更改特效
   * @param _effect 攻击类型
   * @param target 目标士兵
   */
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
  }

  attackParabolaEffect(target: Combat, effect: BulletType) {
    const bullet = new Bullet(this);
    const { container } = bullet;
    this.container.parent.addChild(container);
    bullet.attack(effect, target);
    bullet.addEventListener('moveEnd', () => {
      // this.effectBuff.addEffect(EffectType.SHIELD);
    });
    bullet.addEventListener('attackEnd', () => {
      this.onAttackEnd();
    });
  }

  onBulletMoveEnd() {
    this.dispatchEvent(new Event('bulletMoveEnd'));
  }

  onAttackEnd() {
    this.dispatchEvent(new Event('attackEnd'));
    this.attacking = false;
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
