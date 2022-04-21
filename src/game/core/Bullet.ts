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
  BulletItemInfoOfConfig,
  descType,
  DescType,
  Skill,
} from 'game/types';
import type Combat from './Combat';
import {
  getDistanceBetweenTwoPoints,
  getEffectText,
  getSkillText,
} from './utils';
import Parabola from './Parabola';
import LinearMove from './LinearMove';

/**
 * 攻击特效
 *
 * 子弹类型 [冰块, 岩石, 导弹, 火球, 机械子弹, ]
 */

interface EffectInfo extends BulletItemInfoOfConfig {
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

// 初始化攻击特效
const initEffectInfo = ({
  name,
  bombSpriteSrc,
  bombSpineSrc,
  moveSpineSrc,
  moveSpriteSrc,
}: BulletItemInfoOfConfig) => {
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
/**
 * 子弹
 */
class Bullet extends EventTarget {
  constructor(combat: Combat) {
    super();
    this.combat = combat;
    this.text.anchor.set(0.5);
    this.container.addChild(this.text);
    const temp: Effects = {};
    effectConfig.bullet.forEach(item => {
      temp[item.name] = initEffectInfo(item);
    });
    this.effects = temp;
  }

  combat;

  moving = true;

  speed = 0.1; // 速度

  sprite = new Sprite();

  container = new Container();

  text = new Text('', { fill: 0xffffff, fontSize: 22 });

  attackTarget?: Combat;

  effect?: DescType;

  effects: Effects;

  loader = Loader.shared;

  // 生命周期, 开始
  onStart(attackTarget: Combat) {
    this.attackTarget = attackTarget;
    this.combat.container.parent.addChild(this.container);
    this.dispatchEvent(new Event('start'));
  }

  // 生命周期, 结束
  onEnd() {
    this.container.parent.removeChild(this.container);
    this.dispatchEvent(new Event('attackEnd'));
  }

  // 加载特效
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

  // 加载spine
  async loadSpine(name: BulletType) {
    return new Promise<void>((resolve, rej) => {
      try {
        const { bombSpineSrc, moveSpineSrc } = this.effects[name];

        // debugger;
        const moveKeyName = `${name}_moveSpineSrc`;
        const bombKeyName = `${name}_bombSpineSrc`;
        const tag1 = bombSpineSrc && this.loader.resources[bombKeyName];
        const tag2 = moveSpineSrc && this.loader.resources[moveKeyName];

        if (tag1 || tag2) {
          if (tag1) {
            this.loadBombSpine(this.loader.resources[bombKeyName], name);
          }
          if (tag2) {
            this.loadMoveSpine(this.loader.resources[bombKeyName], name);
          }
          resolve();
          console.log('21221');
          return;
        }
        const loader = Loader.shared;
        loader.reset();
        loader.load((_loader, res: Dict<LoaderResource>) => {
          console.log(3);
          this.effects[name].loaded = true;
          this.effects[name].res = res;
          const moveLoaderRes = res[moveKeyName];
          this.loadMoveSpine(moveLoaderRes, name);
          const bombLoaderRes = res[bombKeyName];
          this.loadBombSpine(bombLoaderRes, name);
          resolve();
        });
        console.log(bombKeyName, bombSpineSrc);
        console.log(moveKeyName, moveSpineSrc);
        if (bombSpineSrc) {
          console.log(1);
          loader.add(bombKeyName, bombSpineSrc);
        }

        if (moveSpineSrc) {
          console.log(2);
          loader.add(moveKeyName, moveSpineSrc);
        }
      } catch (error) {
        console.error('loadSpine error');
        rej(error);
      }
    });
  }

  /**
   * @dev 加载移动spine
   * @param loaderResource 资源
   * @param name 类型
   */
  loadMoveSpine(loaderResource: LoaderResource, name: BulletType) {
    if (loaderResource?.spineData) {
      const spine = new Spine(loaderResource.spineData);
      this.container.addChild(spine);
      this.effects[name].moveEffectSpine = spine;
      spine.visible = false;
      console.log('=loadMoveSpine=');
    }
  }

  /**
   * @dev 加载爆炸spine
   * @param loaderResource 资源
   * @param name 类型
   */
  loadBombSpine(loaderResource: LoaderResource, name: BulletType) {
    if (loaderResource?.spineData) {
      const spine = new Spine(loaderResource.spineData);
      this.container.addChild(spine);
      this.effects[name].bombEffectSpine = spine;
      spine.visible = false;
      spine.update(0);
      spine.autoUpdate = false;
      console.log('=loadBombSpine=');
      spine.state.addListener({
        complete: () => {
          this.onBombEnd(name);
        },
      });
    }
  }

  // 爆炸spine播放动画完成
  onComplete(name: BulletType) {
    this.effects[name].complete = true;
    this.dispatchEvent(new Event('complete'));
  }

  /**
   * @dev 直线攻击
   * @param name 类型
   * @param attackTarget 攻击目标
   */
  async linearAttack(name: BulletType, attackTarget: Combat) {
    this.attackTarget = attackTarget;
    const { moveEffectSpine, moveEffectSprite } = await this.loadEffect(name);

    if (this.combat.axisPoint && attackTarget.axisPoint) {
      const display = moveEffectSprite || moveEffectSpine;
      if (display) {
        display.position.set(this.combat.axisPoint.x, this.combat.axisPoint.y);
        if (display === moveEffectSpine) {
          display.state.setAnimation(0, 'play', true);
        }
        const { x, y } = this.flipTargetPointOrientation(
          display.scale.x,
          display.scale.y,
        );
        display.scale.x = x; // Orientation.TO_LEFT_UP;
        display.scale.y = y; // Orientation.TO_RIGHT_DOWN;
        const linearMove = new LinearMove(
          display,
          this.combat.axisPoint,
          attackTarget.axisPoint,
        );
        this.onMoveStart(
          name,
          new Point(display.position.x, display.position.y),
        );
        linearMove.addEventListener('end', () => {
          this.onMoveEnd(
            name,
            new Point(display.position.x, display.position.y),
          );
        });
        linearMove.move();
      }
    }
  }

  /**
   * @dev 子弹运动结束事件
   * @param name 类型
   * @param point 运动结束的终点
   */
  onMoveEnd(name: BulletType, point: Point) {
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
    this.dispatchEvent(new Event('moveEnd'));
    this.attackBomb(name, point);
  }

  /**
   * @dev 子弹运动开始事件
   * @param name 类型
   * @param point 运动结束的终点
   */
  onMoveStart(name: BulletType, point: Point) {
    this.dispatchEvent(new Event('moveStart'));
  }

  /**
   * @dev 子弹爆炸
   * @param name 类型
   * @param point 爆炸的终点
   */
  attackBomb(name: BulletType, point: Point) {
    const { bombEffectSpine, bombEffectSprite } = this.effects[name];
    if (bombEffectSpine) {
      this.effects[name].completeBomb = false;
      bombEffectSpine.position.set(point.x, point.y);
      bombEffectSpine.visible = true;
      bombEffectSpine.state.setAnimation(0, 'play', false);
      this.spineAnimation(name, bombEffectSpine);
    } else {
      this.onBombEnd(name);
    }
  }

  /**
   * @dev 子弹运动结束
   * @param name 类型
   */
  onBombEnd(name: BulletType) {
    this.effects[name].completeBomb = true;
    // this.dispatchEvent(new Event('attackEnd'));
    this.onEnd();
  }

  /**
   *
   * @param name 类型
   * @param spine 播放spine
   */
  spineAnimation(name: BulletType, spine: Spine) {
    if (spine && !this.effects[name].completeBomb) {
      spine.update(0.016666666666);
      requestAnimationFrame(() => this.spineAnimation(name, spine));
    }
  }

  /**
   * @dev 抛物线攻击
   * @param name 类型
   * @param attackTarget 攻击目标
   */
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
      parabola.addEventListener('end', () => {
        this.onMoveEnd(name, new Point(display.position.x, display.position.y));
      });
      parabola.position().move();
    }
  }

  // 空间魔法攻击 (就是没有弹道能直接对敌方释放技能)
  async spaceAttack(name: BulletType, attackTarget: Combat) {
    this.attackTarget = attackTarget;
    const { loaded } = await this.loadEffect(name);
    if (attackTarget.axisPoint && loaded) {
      this.onMoveEnd(name, attackTarget.axisPoint);
      // this.attackBomb(name, attackTarget.axisPoint);
    }
  }

  /**
   * @dev 切换子弹方位
   * @param x 子弹基础缩放x
   * @param y 子弹基础缩放y
   * @returns 子弹缩放基数
   */
  flipTargetPointOrientation(x: number, y: number) {
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

  testAttack(name: BulletType, attackTarget: Combat, effect: DescType) {
    const text = new Text('', { fill: 0xffffff, fontSize: 22 });
    text.text = getEffectText(effect);
    this.container.addChild(text);
    if (this.combat.axisPoint && attackTarget.axisPoint) {
      text.position.set(this.combat.axisPoint.x, this.combat.axisPoint.y);
      const linearMove = new LinearMove(
        text,
        this.combat.axisPoint,
        attackTarget.axisPoint,
      );
      linearMove.addEventListener('end', () => {
        this.onMoveEnd(name, new Point(text.position.x, text.position.y));
      });
      this.onMoveStart(name, new Point(text.position.x, text.position.y));
      linearMove.move();
    }
  }

  /**
   *
   * @param name 类型
   * @param attackTarget 攻击目标
   * @param effect 攻击特效
   * @returns void
   */
  attack(name: BulletType, attackTarget: Combat, effect?: DescType) {
    const parabolas = [
      bulletType.ICE,
      bulletType.ROCK,
      bulletType.CURVE_BULLET,
      bulletType.FIREBALL,
      bulletType.MISSILE,
    ];

    this.onStart(attackTarget);
    if (effect) {
      this.testAttack(name, attackTarget, effect);
      return;
    }
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
