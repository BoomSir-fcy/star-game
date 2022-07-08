import { Loader } from '@pixi/loaders';
import { InteractionEvent, InteractionData } from '@pixi/interaction';
import { Spine } from 'pixi-spine';
import { Application } from '@pixi/app';
import { Point } from 'pixi.js';
import uniqueId from 'lodash/uniqueId';

// import * as PIXI from 'pixi.js';
import config from '../config';
import '../libs/pixi-dragonbones';
import AxisPoint from './AxisPoint';
import Boards from './Boards';
import Chequer, { stateType } from './Chequer';
import Soldier, { AttrSoldierOptions } from './Soldier';
import {
  getAddActiveSoliderEvent,
  getRemoveActiveSoliderEvent,
  getUpdateSoldierPosition,
} from './event';
import LinearMove from './LinearMove';
import loaders from './Loaders';
import { SpeederType } from '../types';

export interface GameOptionsProps {
  height?: number;
  width?: number;
  test?: boolean;
  enableDrag?: boolean;
  enableSoliderDrag?: boolean;
  offsetStartX?: number;
  offsetStartY?: number;
  scale?: number;
}
/**
 * 游戏入口
 */

class Game extends EventTarget {
  constructor(options?: GameOptionsProps) {
    super();
    const {
      width,
      height,
      test,
      enableDrag = true,
      enableSoliderDrag = true,
      offsetStartY,
      offsetStartX,
      scale = 1,
    } = options || {};

    const { clientHeight, clientWidth } = window.document.body;

    let _width = width || config.WIDTH;
    let _height = height || config.HEIGHT;
    const screenRota = clientHeight > clientWidth;
    if (screenRota) {
      _height = width || config.WIDTH;
      _width = height || config.HEIGHT;
    }
    this.boards = new Boards({
      width: _width,
      height: _height,
      test,
      enableDrag,
      offsetStartX,
      offsetStartY,
    });
    this.app = new Application({
      width: _width,
      height: _height,
      resolution: config.resolution,
      antialias: true,
      backgroundAlpha: test ? 0.5 : 0,
    });
    this.enableSoliderDrag = enableSoliderDrag;
    this.app.stage.scale.set(scale);
    if (screenRota) {
      this.app.stage.rotation = Math.PI / 2;
      this.app.stage.position.set(
        (_width + _height) / 2,
        (_height - _width) / 2,
      );
    }
    // this.app.stage.anchor = 0.2;

    // 添加棋盘
    this.app.stage.addChild(this.boards.container);
    // 绑定缩放
    this.app.view.addEventListener(
      'wheel',
      this.boards.onHandleWheel.bind(this.boards),
      {
        passive: true,
      },
    );
    this.test = test;

    this.init();
  }

  test?: boolean;

  app: Application;

  boards;

  boardsCreated = false;

  view = document.createElement('canvas');

  loaders = loaders;

  private axis: AxisPoint[][] = [];

  soldiers: Soldier[] = []; // 小人

  private dragPreSoldier?: Soldier; // 当前拖动小人

  private dragPreSoldierEvent?: InteractionEvent; // 当前拖动小人事件数据

  private enableSoliderDrag = false; // 是否启用小人拖动

  activeSolider?: Soldier; // 当前选中小人

  activeSoliderFlag?: boolean; // 表示事件触发源未activeSolider

  private lastCreateSoldierId = '';

  private enemyOfSoldierId: { [id: string]: boolean } = {};

  init() {
    this.view = this.app.view;

    this.axis = this.boards.axis;

    // 绑定拖动事件 从棋盘外拖到棋盘内
    this.boards.container.on('pointermove', e => {
      if (
        this.enableSoliderDrag &&
        this.dragPreSoldier &&
        this.dragPreSoldier.container
      ) {
        this.dragPreSoldier.container.visible = true;
        this.dragPreSoldier.onDragMove(e);
        this.dragPreSoldierEvent = e;
        this.onDragStarSoldier();
      }
    });
    this.addEventListenerOfWindow();
  }

  loadResources() {
    this.loaders.loadSpineAll();
    return this.loaders;
  }

  creatTerrain(col?: number, row?: number) {
    this.boards.drawChequers(col, row);
    this.boardsCreated = true;
    this.dispatchEvent(new Event('boardsCreated'));
  }

  // 取消选中
  addEventListenerOfWindow() {
    window.addEventListener('click', () => {
      if (this.activeSoliderFlag) {
        this.activeSoliderFlag = false;
        return;
      }
      this.removeActiveSolider();
    });
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.key === 'Delete' && this.activeSolider) {
        this.removeSoldier(this.activeSolider);
      }
    });
  }

  // 添加小人
  addSoldier(soldier: Soldier) {
    this.soldiers.push(soldier);
    this.boards.container.sortableChildren = true;
    this.boards.container.zIndex = 1;
    this.boards.container.addChild(soldier.container);
    soldier.container
      .on('pointerdown', () => {
        // this.showSameSoliderState(soldier);
        soldier.changeState(stateType.ACTIVE, true);
        soldier.setMoved(false);
      })
      .on('pointermove', event => {
        if (soldier.dragging) {
          this.onDrageMoveSoldier(event);
          if (!soldier.moved) {
            soldier.setMoved(true);
            this.onDragStarSoldier(soldier);
          }
        }
      })
      .on('pointerup', event => {
        if (soldier.moved) {
          const res = this.onDragEndSoldier(event, soldier);
          if (res) {
            this.dispatchEvent(getUpdateSoldierPosition(this.soldiers));
          }
        }
        this.activeSoliderFlag = true;
        this.activeSolider = soldier;
        soldier.changeState(stateType.ACTIVE, true);
        this.dispatchEvent(getAddActiveSoliderEvent(soldier));
        soldier.updateZIndex();
      })
      .on('click', (e: InteractionEvent) => {
        this.activeSoliderFlag = true;
      });
    // 小人阵亡事件
    soldier.addEventListener('death', () => {
      setTimeout(() => {
        this.removeSoldier(soldier);
      }, 300);
    });

    // 小人叛变事件
    soldier.addEventListener('enemyChange', () => {
      // this.removeSoldier(soldier);
      this.dispatchEvent(getUpdateSoldierPosition(this.soldiers));
    });
  }

  // 添加当前选中小人
  addActiveSolider(activeSolider: Soldier) {
    this.activeSolider = activeSolider;
    this.activeSoliderFlag = true;
    activeSolider.changeState(stateType.ACTIVE, true);
    this.dispatchEvent(getAddActiveSoliderEvent(activeSolider));
  }

  // 移除当前选中小人
  removeActiveSolider() {
    if (this.activeSolider) {
      this.dispatchEvent(getRemoveActiveSoliderEvent());
      delete this.activeSolider;
    }
  }

  // 设置小人们
  setSolders(soldiers: Soldier[]) {
    const newSoldiers: Soldier[] = [];
    soldiers.forEach(soldier => {
      if (this.soldiers.includes(soldier)) {
        newSoldiers.push(soldier);
      }
    });
    this.soldiers = newSoldiers;
    this.dispatchEvent(getUpdateSoldierPosition(this.soldiers));
  }

  // 从棋盘上移除小人
  removeSoldier(soldier: Soldier) {
    this.soldiers = this.soldiers.filter(item => item !== soldier);
    this.boards.container.removeChild(soldier.container);
    soldier.changeState(stateType.PREVIEW, false);
    this.dispatchEvent(getUpdateSoldierPosition(this.soldiers));
    this.removeActiveSolider();
  }

  // 清空所有小人
  clearSoldier() {
    this.soldiers.forEach(item => {
      item.changeState(stateType.PREVIEW, false);
      this.boards.container.removeChild(item.container);
    });
    this.soldiers = [];
    this.dispatchEvent(getUpdateSoldierPosition(this.soldiers));
  }

  setEnableDrag(state: boolean) {
    this.enableSoliderDrag = state;
  }

  // 移动端, 棋盘外向棋盘内拖拽小人
  addDragPreSoldierApp(options: AttrSoldierOptions) {
    const chequer = this.boards.chequers.find(
      item => item.state === stateType.PREVIEW,
    ) as Chequer;
    if (chequer) {
      this.createSoldier(chequer.axisX, chequer.axisY, { ...options });
      this.dispatchEvent(
        new CustomEvent('updateSoldierPosition', {
          detail: { soldiers: this.soldiers },
        }),
      );
    }
  }

  // PC端, 棋盘外向棋盘内拖拽小人
  addDragPreSoldier(soldier: Soldier) {
    this.setEnableDrag(true);
    this.dragPreSoldier = soldier.clone({ enableDrag: true });
    this.dragPreSoldier.setDragging(true);
    this.dragPreSoldier.container.visible = false;
    this.app.stage.addChild(this.dragPreSoldier.container);
    this.dragPreSoldier.container.on('pointermove', event => {
      this.onDrageMoveSoldier(event);
    });
  }

  // 关闭拖拽中的小人
  offDragPreSoldier() {
    this.setEnableDrag(false);
    if (this.dragPreSoldier && this.dragPreSoldierEvent) {
      const soldier = this.dragPreSoldier.clone();
      const res = this.onDragEndSoldier(this.dragPreSoldierEvent, soldier);
      if (res) {
        this.addSoldier(soldier);
        this.dispatchEvent(
          new CustomEvent('updateSoldierPosition', {
            detail: { soldiers: this.soldiers },
          }),
        );
      }
      this.dragPreSoldier.setDragging(false);
      this.dragPreSoldier.container.visible = false;
      this.app.stage.removeChild(this.dragPreSoldier.container);
      delete this.dragPreSoldier;
      delete this.dragPreSoldierEvent;
    }
  }

  // 显示相同的小人
  showSameSoliderState(soldier?: Soldier) {
    this.soldiers.forEach(item => {
      if (soldier?.options?.unique_id === item.options?.unique_id) {
        item.changeState(stateType.ACTIVE, true);
      } else {
        item.changeState(stateType.ACTIVE, false);
      }
    });
  }

  // 拖拽小人开始生命周期
  onDragStarSoldier(soldier?: Soldier) {
    this.boards.chequers.forEach(item => {
      if (soldier?.axisPoint?.chequer === item) {
        soldier.changeState(stateType.ACTIVE);
      } else if (soldier) {
        soldier.changeState(stateType.DISABLE);
      }
      item.displayState(true);
    });
  }

  // 移动小人
  onDrageMoveSoldier(event: InteractionEvent) {
    this.boards.chequers.forEach(item => {
      const point = new Point(
        event.data.global.x - 10,
        event.data.global.y + 5,
      );
      const collection = item.checkCollisionPoint(point);
      if (collection && item.state === stateType.PREVIEW) {
        item.setState(stateType.PLACE);
      } else if (!collection && item.state === stateType.PLACE) {
        item.setState(stateType.PREVIEW);
      }
    });
  }

  // 拖拽小人结束生命周期
  onDragEndSoldier(event: InteractionEvent, soldier: Soldier) {
    let canDrag = false;

    this.boards.chequers.forEach(item => {
      const point = new Point(
        event.data.global.x - 10,
        event.data.global.y + 5,
      );
      const collection = item.checkCollisionPoint(point);
      if (collection && item.state === stateType.PLACE) {
        soldier.setPosition(new AxisPoint(item.axisX, item.axisY, item));
        canDrag = true;
      }
      item.displayState(false);
    });
    if (!canDrag) {
      soldier.resetPosition();
    }
    return canDrag;
  }

  /**
   * @dev 创建小人并添加到棋盘
   * @param _x x轴坐标
   * @param _y y轴坐标
   * @param option 参数
   * @returns 小人
   */
  createSoldier(_x: number, _y: number, option: AttrSoldierOptions) {
    const axis = this.getAxis(_x, _y);
    let zIndex = 0;
    if (axis) {
      zIndex = axis?.axisX + axis?.axisY;
    }
    if (!axis) return null;
    const soldier = new Soldier({
      ...option,
      x: axis.x,
      y: axis.y - 1000,
      axisPoint: axis,
      zIndex,
    });

    this.addSoldier(soldier);

    // 小人从天而降
    soldier.changeState(stateType.ACTIVE, true);
    const point0 = new Point(axis.x, axis.y - 1000) as AxisPoint;
    const point1 = new Point(axis.x, axis.y) as AxisPoint;

    const id = uniqueId();
    this.lastCreateSoldierId = id;

    const linearMove = new LinearMove(soldier.container, point0, point1, {
      speed: SpeederType.SOLDIER_CREATE,
    });
    linearMove.addEventListener('end', () => {
      soldier.flyingEnd();
      soldier.container.position.set(axis.x, axis.y);
      soldier.startPoint = point1;
      soldier.changeState(stateType.DISABLE, false);
      this.dispatchEvent(
        new CustomEvent('soldierCreated', { detail: { soldier } }),
      );
      if (id === this.lastCreateSoldierId) {
        this.dispatchEvent(
          new CustomEvent('lastSoldierCreated', { detail: { soldier } }),
        );
      }
    });
    // linearMove.speed = 100;
    linearMove.move();
    return soldier;
  }

  /**
   * @dev 获取坐标详情
   * @param x x轴坐标
   * @param y y轴坐标
   * @returns
   */
  getAxis(x: number, y: number) {
    try {
      return this.axis[x][y];
    } catch (error) {
      console.error('Get axis is error, place wite some time of this created');
      return null;
    }
  }

  /**
   * @dev 根据坐标获取小人
   * @param axis
   * @returns Soldier | null
   */
  findSoldierByAxis(axis: AxisPoint) {
    return this.soldiers.find(soldier => soldier.axisPoint === axis);
  }

  /**
   * @dev 根据sid获取小人
   * @param sid
   * @returns Soldier | null
   */
  findSoldierById(sid: string) {
    return this.soldiers.find(soldier => soldier.sid === sid);
  }

  // 判断是敌是友
  getSoliderEnemyById(sid: string) {
    if (sid in this.enemyOfSoldierId) {
      return this.enemyOfSoldierId[sid];
    }
    const soldier = this.findSoldierById(sid);
    if (soldier) {
      this.enemyOfSoldierId[sid] = soldier.isEnemy;
      return soldier.isEnemy;
    }
    return false;
  }

  once(event: string, handle: any) {
    // const callback = () => {
    //   handle();
    //   this.removeEventListener(event, callback);
    // };
    this.addEventListener(event, handle, { once: true });
  }
}

export default Game;
