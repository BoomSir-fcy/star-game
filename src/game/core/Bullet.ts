import { Texture } from '@pixi/core';
import { Loader, LoaderResource } from '@pixi/loaders';
import { Dict } from '@pixi/utils';
import { Sprite } from '@pixi/sprite';
import { Point } from '@pixi/math';
import { Container, DisplayObject } from '@pixi/display';
import { Text } from '@pixi/text';
import { Spine } from 'pixi-spine';
import config from 'game/config';
import effectConfig from 'game/effectConfig';
import {
  bulletType,
  BulletType,
  EffectItemInfoOfConfig,
  effectType,
  EffectType,
  Skill,
} from 'game/types';
import type Combat from './Combat';
import {
  getDistanceBetweenTwoPoints,
  getEffectText,
  getSkillText,
} from './utils';
import Parabola from './Parabola';

/**
 * 攻击特效
 *
 * 子弹类型 [冰块, 岩石, 导弹, 火球, 机械子弹, ]
 */

interface EffectInfo extends EffectItemInfoOfConfig {
  loaded: boolean;
  await: boolean;
  res: null | Dict<LoaderResource>; // 爆炸资源地址
  moveEffectSprite: Sprite | null;
  moveEffectSpine: Spine | null;
  bombEffectSpine: Spine | null;
  bombEffectSprite: Sprite | null;
  complete: boolean; // 是否完成整个攻击
  completeMove: boolean; // 是否移动完成
  completeBomb: boolean; // 是否爆炸完成
}

type Effects = {
  [effect in BulletType]: EffectInfo;
};

const initEffectInfo = ({
  name,
  bombSpriteSrc,
  bombSpineSrc,
  moveSpineSrc,
  moveSpriteSrc,
}: EffectItemInfoOfConfig) => {
  return {
    loaded: false,
    await: false,
    res: null,
    moveEffectSprite: null,
    moveEffectSpine: null,
    bombEffectSpine: null,
    bombEffectSprite: null,
    complete: false, // 是否完成整个攻击
    completeMove: false, // 是否移动完成
    completeBomb: false, // 是否爆炸完成
    name,
    bombSpriteSrc,
    bombSpineSrc,
    moveSpineSrc,
    moveSpriteSrc,
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

  // speed = 1; // 速度

  speed = 8; // 速度

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

  parabolaBulletEffect(attackTarget: Combat, effect: BulletType) {
    console.log(this);
    // const { name, resDir, spriteRes } = this.effects[effect];
    // this.attackTarget = attackTarget;
    // if (this.effects[name].loaded) {
    //   this.parabolaBulletRun(name);
    // } else {
    //   this.loadSpine(name, resDir);
    //   this.effects[name].await = true;
    //   // this.effects[name].sprite.anchor.set(0.5);
    //   // this.effects[name].sprite.texture = Texture.from(spriteRes);
    //   // this.effects[name].sprite.visible = false;
    //   // this.container.addChild(this.effects[name].sprite);
    // }
    // this.container.visible = true;
  }

  parabolaBullet(attackTarget: Combat, effect: EffectType) {
    console.log(this);
    // const { name, resDir, spriteRes } = this.effects.ice;
    // this.attackTarget = attackTarget;
    // if (this.effects[name].loaded) {
    //   this.parabolaBulletRun(name);
    // } else {
    //   this.loadSpine(name, resDir);
    //   this.effects[name].await = true;
    //   // this.effects[name].sprite.anchor.set(0.5);
    //   // this.effects[name].sprite.texture = Texture.from(spriteRes);
    //   // this.effects[name].sprite.visible = false;
    //   // this.container.addChild(this.effects[name].sprite);
    // }
    // this.container.visible = true;
  }

  parabolaBulletRun(name: BulletType) {
    if (this.combat.axisPoint && this.attackTarget?.axisPoint) {
      // const parabola = new Parabola(
      //   this.effects[name].sprite,
      //   this.combat.axisPoint,
      //   this.attackTarget.axisPoint,
      // );
      // this.effects[name].sprite.visible = true;
      // parabola.position().move();
      // parabola.addEventListener('end', () => {
      //   // this.container.visible = false;
      //   const { x, y } = this.effects[name].sprite;
      //   this.onAssetsLoadedSpine(name, x, y);
      //   this.effects[name].sprite.visible = false;
      // });
    }
  }

  handleBulletMove() {
    if (this.moving && this.attackTarget) {
      this.container.position.x += this.speedX;
      this.container.position.y += this.speedY;
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
      if ((this.combat.attackInfo as any)?.now_hp) {
        this.attackTarget.drawHp(`${(this.combat.attackInfo as any).now_hp}`);
      }

      this.combat.attacking = false;
      if (this.effect && config.showEffect.includes(this.effect)) {
        this.attackTarget.showEffectText(getEffectText(this.effect));
      }
      if (this.effect && config.hideEffect.includes(this.effect)) {
        this.attackTarget.hideEffectText();
      }
    }
    this.dispatchEvent(new Event('attackEnd'));
  }

  async loadEffect(name: BulletType) {
    return new Promise<EffectInfo>((res, rej) => {
      try {
        if (this.effects[name].loaded) {
          res(this.effects[name]);
          return;
        }
        const { bombSpriteSrc, moveSpriteSrc } = this.effects[name];
        if (bombSpriteSrc) {
          const bombEffectSprite = new Sprite(Texture.from(bombSpriteSrc));
          bombEffectSprite.anchor.set(0.5);
          bombEffectSprite.visible = false;
          this.container.addChild(bombEffectSprite);
          this.effects[name].bombEffectSprite = bombEffectSprite;
        }
        if (moveSpriteSrc) {
          const moveEffectSprite = new Sprite(Texture.from(moveSpriteSrc));
          moveEffectSprite.visible = false;
          moveEffectSprite.anchor.set(0.5);
          this.container.addChild(moveEffectSprite);
          this.effects[name].moveEffectSprite = moveEffectSprite;
        }
        this.loadSpine(name).then(() => {
          res(this.effects[name]);
        });
      } catch (error) {
        console.error('loadEffect error');
        rej(error);
      }
    });
  }

  async loadSpine(name: BulletType) {
    return new Promise<void>((resolve, rej) => {
      try {
        const { bombSpineSrc, moveSpineSrc } = this.effects[name];
        const loader = Loader.shared;

        if (bombSpineSrc) {
          loader.add(`${name}_bombSpineSrc`, bombSpineSrc);
        }

        if (moveSpineSrc) {
          loader.add(`${name}_moveSpineSrc`, moveSpineSrc);
        }
        loader.load((_loader, res: Dict<LoaderResource>) => {
          this.effects[name].loaded = true;
          this.effects[name].res = res;
          const moveLoaderRes = res[`${name}_moveSpineSrc`];
          if (moveLoaderRes?.spineData) {
            const spine = new Spine(moveLoaderRes.spineData);
            this.container.addChild(spine);
            this.effects[name].moveEffectSpine = spine;
            spine.visible = false;
            // spine.update(0);
            // spine.autoUpdate = false;
          }
          const bombLoaderRes = res[`${name}_bombSpineSrc`];
          if (bombLoaderRes?.spineData) {
            const spine = new Spine(bombLoaderRes.spineData);
            this.container.addChild(spine);
            this.effects[name].bombEffectSpine = spine;
            spine.visible = false;
            spine.update(0);
            spine.autoUpdate = false;
            spine.state.addListener({
              complete: () => {
                this.onBombEnd(name);
              },
            });
          }
          resolve();
        });
      } catch (error) {
        console.error('loadSpine error');
        rej(error);
      }
    });
  }

  onAssetsLoadedSpine(name: BulletType, x?: number, y?: number) {
    this.container.visible = true;
    // const { spine } = this.effects[name];
    // if (spine) {
    //   spine.visible = true;
    //   spine.position.set(x, y);
    //   spine.state.setAnimation(0, 'play', false);
    //   this.effects[name].complete = false;
    //   spine.state.addListener({
    //     complete: entry => {
    //       this.onComplete(name);
    //     },
    //   });
    //   this.spineAnimation(spine, name);
    // }
  }

  onComplete(name: BulletType) {
    this.effects[name].complete = true;
    this.dispatchEvent(new Event('complete'));
  }

  // 直线子弹攻击
  async linearAttack(name: BulletType, attackTarget: Combat) {
    this.attackTarget = attackTarget;
    const { moveEffectSpine, moveEffectSprite } = await this.loadEffect(name);

    if (this.combat.axisPoint && attackTarget.axisPoint) {
      // 两点直接的距离
      const distance = getDistanceBetweenTwoPoints(
        this.combat.axisPoint,
        attackTarget.axisPoint,
      );
      const t = distance / this.speed;
      this.moving = true;
      this.effects[name].completeMove = false;
      this.container.visible = true;
      this.speedX = (attackTarget.axisPoint?.x - this.combat.axisPoint?.x) / t;
      this.speedY = (attackTarget.axisPoint?.y - this.combat.axisPoint?.y) / t;

      this.doubleSpeedX = Math.abs(this.speedX * 2);
      this.doubleSpeedY = Math.abs(this.speedY * 2);
      const display = moveEffectSprite || moveEffectSpine;
      if (display) {
        display.position.set(
          this.combat.axisPoint?.x,
          this.combat.axisPoint?.y,
        );
        const { x, y } = this.flipTargetPointOrientation(
          display.scale.x,
          display.scale.y,
        );
        console.log(x, y);
        display.scale.x = x;
        display.scale.y = y;
        display.visible = true;
        if (display === moveEffectSpine) {
          display.state.setAnimation(0, 'play', true);
        }
        this.onMoveStart(
          name,
          new Point(display.position.x, display.position.y),
        );
        this.linearMoveTemp(name, display);
      }
    }
  }

  linearMoveTemp(name: BulletType, display: DisplayObject) {
    if (!this.effects[name].completeMove && display) {
      const x = display.position.x + this.speedX;
      const y = display.position.y + this.speedY;
      display.position.set(x, y);
      if (
        Math.abs(y - (this.attackTarget?.axisPoint?.y || 0)) <=
          this.doubleSpeedY &&
        Math.abs(x - (this.attackTarget?.axisPoint?.x || 0)) <=
          this.doubleSpeedX
      ) {
        this.onMoveEnd(name, new Point(display.position.x, display.position.y));
      }
      requestAnimationFrame(() => this.linearMoveTemp(name, display));
    }
  }

  onMoveEnd(name: BulletType, point: Point) {
    console.timeEnd(name);
    this.effects[name].completeMove = true;
    const {
      moveEffectSpine,
      moveEffectSprite,
      bombEffectSpine,
      bombEffectSprite,
    } = this.effects[name];
    if (moveEffectSpine) {
      moveEffectSpine.visible = false;
    }
    if (moveEffectSprite) {
      moveEffectSprite.visible = false;
    }
    this.attackBomb(name, point);
  }

  onMoveStart(name: BulletType, point: Point) {
    console.time(name);
    this.dispatchEvent(new Event('moveStart'));
  }

  attackBomb(name: BulletType, point: Point) {
    const { bombEffectSpine, bombEffectSprite } = this.effects[name];
    if (bombEffectSpine) {
      console.log(point.x, point.y);
      this.effects[name].completeBomb = false;
      bombEffectSpine.position.set(point.x, point.y);
      bombEffectSpine.visible = true;
      bombEffectSpine.state.setAnimation(0, 'play', false);
      this.spineAnimation(name, bombEffectSpine);
    } else {
      this.onBombEnd(name);
    }
  }

  onBombEnd(name: BulletType) {
    this.effects[name].completeBomb = true;
  }

  spineAnimation(name: BulletType, spine: Spine) {
    if (spine && !this.effects[name].completeBomb) {
      spine.update(0.01666666666667);
      requestAnimationFrame(() => this.spineAnimation(name, spine));
    }
  }

  // 曲线子弹攻击
  async parabolaAttack(name: BulletType, attackTarget: Combat) {
    this.attackTarget = attackTarget;
    const { moveEffectSpine, moveEffectSprite } = await this.loadEffect(name);
    const display = moveEffectSpine || moveEffectSprite;
    if (this.combat.axisPoint && attackTarget.axisPoint && display) {
      display.position.set(this.combat.axisPoint.x, this.combat.axisPoint.y);
      this.container.visible = true;
      display.visible = true;
      if (display === moveEffectSpine) {
        display.state.setAnimation(0, 'play', true);
      }
      const parabola = new Parabola(
        display,
        this.combat.axisPoint,
        attackTarget.axisPoint,
      );
      this.onMoveStart(name, new Point(display.position.x, display.position.y));
      parabola.position().move();
      parabola.addEventListener('end', () => {
        this.onMoveEnd(name, new Point(display.position.x, display.position.y));
      });
    }
  }

  // 肉搏攻击 (感觉肉搏就是直线子弹)
  // fightMove() {
  //   console.log(this);
  // }

  // 空间魔法攻击 (就是没有弹道能直接对敌方释放技能)
  async spaceAttack(name: BulletType, attackTarget: Combat) {
    this.attackTarget = attackTarget;
    const { loaded } = await this.loadEffect(name);
    if (attackTarget.axisPoint && loaded) {
      this.onMoveEnd(name, attackTarget.axisPoint);
      // this.attackBomb(name, attackTarget.axisPoint);
    }
  }

  async test() {
    const { moveEffectSpine } = await this.loadEffect('bullet');
    if (moveEffectSpine) {
      this.container.visible = true;
      moveEffectSpine.visible = true;
      moveEffectSpine.state.setAnimation(0, 'play', true);
      const { x, y } = this.flipTargetPointOrientation(
        moveEffectSpine.scale.x,
        moveEffectSpine.scale.y,
      );
      moveEffectSpine.scale.x = x; // Orientation.TO_LEFT_UP;
      moveEffectSpine.scale.y = y; // Orientation.TO_RIGHT_DOWN;

      this.spineAnimation('bullet', moveEffectSpine);
    }
  }

  flipTargetPointOrientation(x: number, y: number) {
    console.log(this.attackTarget?.axisPoint, this.combat.axisPoint);
    if (this.attackTarget?.axisPoint && this.combat.axisPoint) {
      const { axisX: x0, axisY: y0 } = this.attackTarget.axisPoint;
      const { axisX: x1, axisY: y1 } = this.combat.axisPoint;
      const rX = -Math.abs(x);
      const rY = -Math.abs(y);
      const aX = Math.abs(x);
      const aY = Math.abs(y);
      // Orientation.TO_RIGHT_DOWN;
      if (x0 - x1 > 0) return { x: aX, y: rY };
      // Orientation.TO_LEFT_UP;
      if (x0 - x1 < 0) return { x: rX, y: aY };
      // Orientation.TO_LEFT_DOWN;
      if (y0 - y1 > 0) return { x: rX, y: rY };
      // Orientation.TO_RIGHT_UP
      if (y0 - y1 < 0) return { x: aX, y: aY };
    }
    return { x, y };
  }

  // 冰块攻击
  iceAttack(attackTarget: Combat) {
    this.parabolaAttack(bulletType.ICE, attackTarget);
  }

  // 岩石攻击
  rockAttack(attackTarget: Combat) {
    this.parabolaAttack(bulletType.ROCK, attackTarget);
  }

  // 曲线攻击
  curveAttack(attackTarget: Combat) {
    this.parabolaAttack(bulletType.CURVE_BULLET, attackTarget);
  }

  // 子弹
  async bulletAttack(attackTarget: Combat) {
    // const { moveEffectSpine } = await this.loadEffect(bulletType.BULLET);
    this.linearAttack(bulletType.BULLET, attackTarget);
  }

  testAttack(name: BulletType, attackTarget: Combat) {
    const parabolas = [
      bulletType.ICE,
      bulletType.ROCK,
      bulletType.CURVE_BULLET,
      bulletType.FIREBALL,
      bulletType.MISSILE,
    ];
    if (parabolas.includes(name)) {
      this.parabolaAttack(name, attackTarget);
      return;
    }

    const linear = [
      bulletType.BULLET,
      bulletType.MECHANICAL_BULLET,
      bulletType.VENOM,
      bulletType.FIGHT,
    ];
    if (linear.includes(name)) {
      this.linearAttack(name, attackTarget);
      return;
    }

    const space = [bulletType.STING];
    if (space.includes(name)) {
      this.spaceAttack(name, attackTarget);
    }
  }
}

export default Bullet;
