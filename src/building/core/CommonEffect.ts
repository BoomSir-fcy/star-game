import { Texture } from '@pixi/core';
import { Loader, LoaderResource } from '@pixi/loaders';
import { Dict } from '@pixi/utils';
import { Sprite } from '@pixi/sprite';
import { Point } from '@pixi/math';
import { Container, DisplayObject } from '@pixi/display';
import { Text } from '@pixi/text';
import { Spine } from 'pixi-spine';
import config from '../config';
import effectConfig from '../effectConfig';
import {
  bulletType,
  CommonSpineType,
  CommonSpineItem,
  descType,
  DescType,
  Skill,
  SpeederType,
  commonSpineType,
} from '../types';
import type Combat from './Combat';
import {
  getDistanceBetweenTwoPoints,
  getEffectText,
  getSkillText,
} from './utils';
import Parabola from './Parabola';
import LinearMove from './LinearMove';
import loaders from './Loaders';
import speeder from './Speeder';

/**
 * 攻击特效
 *
 * 子弹类型 [冰块, 岩石, 导弹, 火球, 机械子弹, ]
 */

interface CommonSpineItemInfo extends CommonSpineItem {
  loaded: boolean;
  spine: Spine | null;
  complete: boolean; // 是否完成整个攻击
  flip: boolean;
}

type Effects = {
  [effect in CommonSpineType]: CommonSpineItemInfo;
};

/**
 * 最短执行时间
 * 比如子弹需要飞行1秒、爆炸1秒
 * 但是最短执行时间为3秒
 * 则在3秒后再触发attackEnd
 *
 * 如果子弹飞行2秒、爆炸2秒
 * 最短执行时间为3秒
 * 则在2+2=4秒后触发attackEnd
 *
 *
 */

// 初始化攻击特效
const initEffectInfo = (
  configOptions: CommonSpineItem,
): CommonSpineItemInfo => {
  return {
    loaded: false,
    spine: null,
    complete: false, // 是否完成整个攻击
    flip: false,
    // name,
    ...configOptions,
  };
};
/**
 * 子弹
 */
class CommonEffect extends EventTarget {
  constructor(parent: Container) {
    super();
    this.parent = parent;
    this.text.anchor.set(0.5);
    // this.container.zIndex = 9999;
    this.container.addChild(this.text);
    const temp: Effects = {};

    effectConfig.common.forEach(item => {
      temp[item.name] = initEffectInfo(item);
    });
    this.effects = temp;
  }

  parent;

  moving = true;

  speed = 0.1; // 速度

  minTime = 60 * 3; // 最小执行时间

  sprite = new Sprite();

  container = new Container();

  text = new Text('', { fill: 0xffffff, fontSize: 22 });

  effect?: DescType;

  effects: Effects;

  loader = Loader.shared;

  // 生命周期, 开始
  onStart(name: CommonSpineType) {
    this.parent?.addChild(this.container);
    this.dispatchEvent(new Event('start'));
    this.effects[name].complete = false;
    // this.timTricker(name);
  }

  // 生命周期, 结束
  onEnd(name: CommonSpineType) {
    const { complete } = this.effects[name];
    if (complete) {
      this.dispatchEvent(new Event('attackEnd'));
      // this.effects[name].complete = false;
    }
  }

  // 加载特效
  async loadEffect(name: CommonSpineType) {
    return new Promise<CommonSpineItemInfo>((res, rej) => {
      try {
        if (this.effects[name].loaded) {
          res(this.effects[name]);
          return;
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

  async loadSpine(name: CommonSpineType) {
    return new Promise<void>((resolve, rej) => {
      try {
        const bombLoaderRes = loaders.loader.resources[name];
        this.loadBombSpine(bombLoaderRes, name);

        this.effects[name].loaded = true;
        resolve();
      } catch (error) {
        console.error('loadSpine error');
        rej(error);
      }
    });
  }

  /**
   * @dev 加载爆炸spine
   * @param loaderResource 资源
   * @param name 类型
   */
  loadBombSpine(loaderResource: LoaderResource, name: CommonSpineType) {
    if (loaderResource?.spineData) {
      const spine = new Spine(loaderResource.spineData);
      this.container.addChild(spine);
      this.effects[name].spine = spine;
      spine.scale.set(0.45);
      spine.visible = false;
      spine.update(0);
      spine.autoUpdate = false;
      this.effects[name].loaded = true;
      spine.state.addListener({
        complete: () => {
          this.onPlayEnd(name);
        },
      });
    }
  }

  // 爆炸spine播放动画完成
  onComplete(name: CommonSpineType) {
    this.effects[name].complete = true;
    this.dispatchEvent(new Event('complete'));
  }

  /**
   * @dev 子弹爆炸
   * @param name 类型
   * @param point 爆炸的终点
   */
  async playSpine(name: CommonSpineType, point: Point) {
    const { spine, flip } = await this.loadEffect(name);
    this.onStart(name);
    if (spine) {
      this.effects[name].complete = false;
      spine.position.set(point.x, point.y);
      spine.visible = true;
      spine.state.setAnimation(0, 'play', false);

      // 需要改变效果方位
      // if (flip) {
      //   const { x, y } = this.flipTargetPointOrientation(
      //     spine.scale.x,
      //     spine.scale.y,
      //   );
      //   spine.scale.x = x; // Orientation.TO_LEFT_UP;
      //   spine.scale.y = y; // Orientation.TO_RIGHT_DOWN;
      // }
      this.spineAnimation(name, spine);
    } else {
      this.onPlayEnd(name);
    }
  }

  /**
   * @dev 切换子弹方位
   * @param x 子弹基础缩放x
   * @param y 子弹基础缩放y
   * @returns 子弹缩放基数
   */
  // flipTargetPointOrientation(x: number, y: number) {
  //   if (this.attackTarget?.axisPoint && this.combat.axisPoint) {
  //     const { axisX: x0, axisY: y0 } = this.attackTarget.axisPoint;
  //     const { axisX: x1, axisY: y1 } = this.combat.axisPoint;
  //     const rX = -Math.abs(x);
  //     const rY = -Math.abs(y);
  //     const aX = Math.abs(x);
  //     const aY = Math.abs(y);
  //     // Orientation.TO_RIGHT_DOWN;
  //     if (y0 - y1 > 0) return { x: aX, y: rY };
  //     // Orientation.TO_LEFT_UP;
  //     if (y0 - y1 < 0) return { x: rX, y: aY };
  //     // Orientation.TO_LEFT_DOWN;
  //     if (x0 - x1 > 0) return { x: rX, y: rY };
  //     // Orientation.TO_RIGHT_UP
  //     if (x0 - x1 < 0) return { x: aX, y: aY };
  //   }
  //   return { x, y };
  // }

  /**
   * @dev 子弹运动结束
   * @param name 类型
   */
  onPlayEnd(name: CommonSpineType) {
    this.effects[name].complete = true;
    // this.dispatchEvent(new Event('attackEnd'));
    this.container.parent?.removeChild(this.container);
    this.onEnd(name);
  }

  /**
   *
   * @param name 类型
   * @param spine 播放spine
   */
  spineAnimation(name: CommonSpineType, spine: Spine) {
    if (spine && !this.effects[name].complete) {
      spine?.update(speeder?.update);
      requestAnimationFrame(() => this.spineAnimation(name, spine));
    }
  }

  once(event: string, handle: any) {
    // const callback = () => {
    //   handle();
    //   this.removeEventListener(event, callback);
    // };
    this.addEventListener(event, handle, { once: true });
  }
}

export default CommonEffect;
