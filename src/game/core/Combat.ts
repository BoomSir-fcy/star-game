import {
  bulletType,
  BulletType,
  commonSpineType,
  descType,
  DescType,
  bulletTypeIndex,
  EffectType,
  Orientation,
  RoundDesc,
  RoundDescAttack,
  SoldierMoveType,
  SpeederType,
  TipsTextType,
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
import { getEffectText, getTwoPointCenter, getSpriteRes } from './utils';
import EffectBuff from './EffectBuff';
import { descOfEffect, spines } from '../effectConfig';
import Loaders from './Loaders';
import TipsText from './TipsText';
import CommonEffect from './CommonEffect';

export interface CombatOptions {
  // texture0: string;
  // texture1: string;
  srcId: string;
  race: number;
  attackType?: number;
  skillType?: number;
}

/**
 * 士兵
 */
class Combat extends EventTarget {
  constructor(options: CombatOptions) {
    super();
    this.race = options.race;
    this.srcId = options.srcId;
    this.attackType = options.attackType;
    this.skillType = options.skillType;
    this.textureRes = getSpriteRes(options.race, options.srcId, 1);
    this.texture0 = Texture.from(this.textureRes);
    this.texture1 = Texture.from(getSpriteRes(options.race, options.srcId, 2));

    this.effectBuff = new EffectBuff(this);

    const shadow = Texture.from('/assets/map/shadow.png');
    this.spriteShadow = new Sprite();
    this.spriteShadow.texture = shadow;
    this.spriteShadow.anchor.set(0.5);
    this.spriteShadow.position.set(0, 88);
    this.spriteShadow.zIndex = -20;
    this.spriteShadow.visible = false;

    // this.shadowGraphics.beginFill(0xff0000);
    // this.shadowGraphics.drawEllipse(0, 0, 20, 10);
    // this.shadowGraphics.endFill();
    // this.shadowGraphics.zIndex = -10;
  }

  x = 0;

  y = 0;

  race = 1;

  srcId = '';

  textureRes = '';

  moving = false;

  attacking = false;

  running = false;

  sid?: string;

  hp = 0; // 总生命值

  activePh = 0; // 当前生命值

  lastHp = 0; // 扣血前的生命值

  shield = 0;

  hpGraphics = new Graphics();

  shadowGraphics = new Graphics();

  hpText = new Text('', { fill: 0xff0000, fontSize: 32 });

  isEnemy = false;

  displaySprite = new Sprite();

  spriteShadow = new Sprite();

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

  drawHpTimer = 0;

  orientation = Orientation.TO_RIGHT_DOWN;

  effectBuff;

  flying = true;

  attackType: bulletTypeIndex;

  skillType: bulletTypeIndex;

  renderPh() {
    this.container.addChild(this.hpGraphics);
    this.hpText.anchor.set(0.5);
    this.hpText.zIndex = 2;
    // this.hpGraphics.zIndex = 2;
    this.hpGraphics.position.set(0, -80);
    this.hpText.position.set(0, -110);
    this.container.addChild(this.hpText);
    this.drawHp();
  }

  setActiveHp(hp: number) {
    this.lastHp = this.activePh;
    this.activePh = hp;
    this.drawHp();
  }

  setActiveShield(shield: number) {
    this.shield = shield;
    this.drawHp();
  }

  setActiveHpWithShield(hp: number, shield: number) {
    this.lastHp = this.activePh;
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

    // 绘制扣除的血量
    if (this.lastHp - this.activePh > 0) {
      clearTimeout(this.drawHpTimer);
      this.hpGraphics.beginFill(
        this.isEnemy ? config.BLOOD_COLOR_ENEMY : config.BLOOD_COLOR,
        0.5,
      );
      this.hpGraphics.drawRect(
        lineStartX + (this.activePh / hpAndShield) * config.BLOOD_WIDTH,
        lineY,
        ((this.lastHp - this.activePh) / hpAndShield) * config.BLOOD_WIDTH,
        config.BLOOD_HEIGHT,
      );
      this.hpGraphics.endFill();
      this.drawHpTimer = window.setTimeout(() => {
        this.lastHp = this.activePh;
        this.drawHp();
      }, 200);
    }

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
      const height =
        i % 10 === 0 ? config.BLOOD_HEIGHT : config.BLOOD_HEIGHT * 0.6;
      this.hpGraphics.drawRect(lineStartX + perW * i, lineY, lineW, height);
      this.hpGraphics.endFill();
    }

    // this.hpText.style.fill = this.isEnemy
    //   ? config.BLOOD_COLOR_ENEMY
    //   : config.BLOOD_COLOR;
    // this.hpText.text = `${this.activePh}`;
  }

  /**
   *
   * @param axisPoint 目标坐标
   * @param moveTime 移动时间(ms)
   */
  moveTo(axisPoint: AxisPoint, moveType = SoldierMoveType.WALK) {
    this.targetAxisPoint = axisPoint;
    const _axisPoint = axisPoint.clone();
    const endAxisPoint = this.axisPoint.clone();
    if (this.axisPoint) {
      if (moveType === SoldierMoveType.WALK) {
        this.flipTargetPointOrientation(axisPoint);
      }
      if (moveType === SoldierMoveType.FLYING) {
        this.flipTargetPointOrientation(axisPoint);
        this.flyingStart();
        endAxisPoint.y -= 50;
        _axisPoint.y -= 50;
        this.spriteShadow.visible = true;
      }

      const linearMove = new LinearMove(
        this.container,
        endAxisPoint,
        _axisPoint,
        {
          speed: SpeederType.SOLDIER_MOVE,
        },
      );
      linearMove.addEventListener('end', () => {
        this.setPosition(axisPoint);
        this.dispatchEvent(new Event('moveEnd'));
        this.updateZIndex();
        if (
          moveType === SoldierMoveType.FLYING ||
          moveType === SoldierMoveType.SKY_FROM
        ) {
          this.flyingEnd();
          this.spriteShadow.visible = false;
        }
      });
      if (moveType === SoldierMoveType.FLYING) {
        this.flyingStart();
      }
      linearMove.move();
    }
  }

  // 更换方向
  flipTargetPointOrientation(axisPoint?: AxisPoint) {
    if (axisPoint && this.axisPoint) {
      if (axisPoint.axisX - this.axisPoint?.axisX > 0) {
        this.orientation = Orientation.TO_RIGHT_DOWN;
        this.displaySprite.texture = this.texture1;
        this.displaySprite.scale.x = -Math.abs(this.displaySprite.scale.x);
      } else if (axisPoint.axisX - this.axisPoint?.axisX < 0) {
        this.orientation = Orientation.TO_LEFT_UP;
        this.displaySprite.texture = this.texture0;
        this.displaySprite.scale.x = -Math.abs(this.displaySprite.scale.x);
      } else if (axisPoint.axisY - this.axisPoint?.axisY > 0) {
        this.orientation = Orientation.TO_LEFT_DOWN;
        this.displaySprite.texture = this.texture1;
        this.displaySprite.scale.x = Math.abs(this.displaySprite.scale.x);
      } else if (axisPoint.axisY - this.axisPoint?.axisY < 0) {
        this.orientation = Orientation.TO_RIGHT_UP;
        this.displaySprite.texture = this.texture0;
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

  flyingStart() {
    this.flying = true;
    // this.container.position.y -= 50;
  }

  flyingEnd() {
    this.flying = false;
    const effect = new CommonEffect(this.container.parent);
    effect.playSpine(commonSpineType.FLYING_END, this.axisPoint);
    effect.addEventListener('onPlayEnd', () => {
      console.log('onPlayEnd');
    });
    // this.container.position.y += 50;
  }

  // 碰撞
  beatCollision(target: Combat, attackInfo?: RoundDesc) {
    const point = this.axisPoint?.clone();
    // const bullet = new Bullet(this);
    // // bullet.addEventListener('moveEnd', () => {
    // //   this.dispatchEvent(new Event('collisionEnd'));
    // // });
    // bullet.addEventListener('attackEnd', () => {
    //   this.dispatchEvent(new Event('collisionEnd'));
    // });
    // bullet.attack(bulletType.BUMP, target);
    if (target.axisPoint && this.axisPoint) {
      const point1 = getTwoPointCenter(this.axisPoint, target.axisPoint);
      const linearMove = new LinearMove(
        this.container,
        this.axisPoint,
        point1,
        {
          speed: SpeederType.COLLECTION,
        },
      );
      linearMove.addEventListener('end', () => {
        if (point && point1) {
          const linearMove1 = new LinearMove(this.container, point1, point, {
            speed: SpeederType.COLLECTION,
          });
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
    this.flipTargetPointOrientation(target.axisPoint);

    const bullet = new Bullet(this);

    bullet.addEventListener('moveEnd', () => {
      // this.changeEffect(effect, target);

      // 暴击
      if (attackInfo?.attack_crit) {
        // console.log(attackInfo, '暴击');
        let hp = attackInfo?.receive_sub_hp;
        if (attackInfo?.around?.length) {
          hp = attackInfo.around[0].receive_sub_hp;
        }
        const tipsText = new TipsText(`${hp}`, {
          type: TipsTextType.CRIT,
        });
        const axisPointTarget = target.axisPoint.clone();
        axisPointTarget.y -= 70;
        tipsText.show(axisPointTarget);
      }

      // 治疗
      if (effect === descType.RESTORE) {
        const { add_hp } = attackInfo.around[0];
        const tipsText = new TipsText(`+${add_hp}`, {
          type: TipsTextType.RESTORE,
        });
        const axisPointTarget = target.axisPoint.clone();
        axisPointTarget.y -= 70;
        tipsText.show(axisPointTarget);
      }

      // 文字效果
      if (effect === descType.ATTACK_DODGE) {
        const tipsText = new TipsText('[DODGE]');
        tipsText.show(target.axisPoint);
      } else if (effect === descType.ATTACK_MISS) {
        const tipsText = new TipsText('[MISS]');
        tipsText.show(target.axisPoint);
      } else if (
        effect === descType.IMMUNITY_ICE ||
        effect === descType.IMMUNITY_LOCK_MOVE ||
        effect === descType.IMMUNITY_FIRING
      ) {
        const tipsText = new TipsText('[IMMUNITY]');
        tipsText.show(target.axisPoint);
      } else if (attackInfo) {
        let hp = attackInfo?.receive_sub_hp;
        if (attackInfo?.around?.length) {
          hp = attackInfo.around[0].receive_sub_hp;
        }
        if (hp) {
          const tipsText = new TipsText(`${hp}`);
          const axisPointTarget = target.axisPoint.clone();
          axisPointTarget.y -= 70;
          tipsText.show(axisPointTarget);
        }
      }
      this.onBulletMoveEnd();
    });

    bullet.addEventListener('attackEnd', () => {
      this.onAttackEnd();
    });

    // console.log('effect=========', effect);
    if (
      effect === descType.ATTACK ||
      descType.ATTACK_DODGE ||
      descType.ATTACK_MISS
    ) {
      bullet.attack(bulletType[this.attackType], target);
    } else {
      bullet.attack(bulletType[this.skillType], target);
    }

    // if (effect === descType.ADD_BOOM) {
    //   bullet.attack(bulletType.ADD_BOMB, target);
    // } else if (effect === descType.ADD_FIRING) {
    //   bullet.attack(bulletType.FIRING, target);
    // } else if (effect === descType.ATTACK) {
    //   bullet.attack(bulletType.BULLET, target);
    // } else if (effect === descType.ADD_SHIELD) {
    //   bullet.attack(bulletType.SHIELD, target);
    // } else if (effect === descType.BEAT) {
    //   bullet.attack(bulletType.ROCK, target);
    // } else if (effect === descType.BOOM) {
    //   bullet.attack(bulletType.BOMB, target);
    // } else if (effect === descType.FIRING) {
    //   bullet.attack(bulletType.FIRING, target);
    // } else if (effect === descType.ICE_END) {
    //   bullet.attack(bulletType.BULLET, target);
    // } else if (effect === descType.ICE_START) {
    //   bullet.attack(bulletType.ICE, target);
    // } else if (effect === descType.STOP_MOVE) {
    //   bullet.attack(bulletType.STOP_MOVE, target);
    // } else if (effect === descType.ATTACK_DODGE) {
    //   bullet.attack(bulletType.BULLET, target);
    // } else if (effect === descType.ATTACK_MISS) {
    //   bullet.attack(bulletType.BULLET, target);
    // } else if (effect === descType.RESTORE) {
    //   bullet.attack(bulletType.RESTORE, target);
    // } else if (effect === descType.PURIFY) {
    //   bullet.attack(bulletType.PURIFY, target);
    // } else if (
    //   effect === descType.IMMUNITY_ICE ||
    //   effect === descType.IMMUNITY_LOCK_MOVE ||
    //   effect === descType.IMMUNITY_FIRING
    // ) {
    //   bullet.attack(bulletType.BULLET, target);
    // }
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

  updateZIndex() {
    if (this.axisPoint?.axisX && this.axisPoint?.axisY) {
      this.container.zIndex = this.axisPoint?.axisX + this.axisPoint?.axisY;
    }
  }

  attackParabolaEffect(target: Combat, effect: BulletType) {
    // const loaders = new Loaders();

    // loaders.load(spines);
    const bullet = new Bullet(this);
    const { container } = bullet;
    this.container.parent.addChild(container);
    // bullet.addEventListener('attackEnd', () => {
    //   this.changeEffect(descType.RESTORE, target);
    // });

    console.log(effect, '===effect');
    bullet.attack(effect, target);
    // bullet.addEventListener('moveEnd', () => {
    //   // target.effectBuff.addEffect(effect);
    // });
    // bullet.addEventListener('attackEnd', () => {
    //   this.onAttackEnd();
    //   setTimeout(() => {
    //     target.effectBuff.removeEffect(EffectType.BOMB);
    //   }, 5 * 1000);
    // });
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

  // static getSpriteRes(race: number, resId: string, index: number) {
  //   const info = raceData[race].children.find(
  //     item => item.id === Number(resId),
  //   );
  //   const img = index === 1 ? info?.thumb1 : info?.thumb2;
  //   return img || `/assets/modal/${race}/${resId}-${index}.png`;
  //   // return `/assets/modal/${1}/${resId}-${index}.png`;
  // }
}

export default Combat;
