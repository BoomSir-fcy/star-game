import { InteractionEvent } from '@pixi/interaction';
import { Application } from '@pixi/app';
import { Point } from '@pixi/math';
import uniqueId from 'lodash/uniqueId';

// import * as PIXI from 'pixi.js';
import config from '../config';
import AxisPoint from './AxisPoint';
import Boards from './Boards';
import Chequer, { stateType } from './Chequer';
import {
  getAddActiveBuilderEvent,
  getCancelBuilderEvent,
  getConfirmBuilderEvent,
  getRemoveActiveBuilderEvent,
  getUpdateBuilderPosition,
  getAddActiveChequerEvent,
  getErrorEvent,
} from './event';
import LinearMove from './LinearMove';
import { SpeederType } from '../types';
import Builder, { BuilderOption } from './Builder';

export interface GameOptionsProps {
  height?: number;
  width?: number;
  test?: boolean;
  enableDrag?: boolean;
  enableSoliderDrag?: boolean;
  offsetStartX?: number;
  offsetStartY?: number;
}

interface BuilderInfoOfApi {
  building: Api.Building.Building;
  position: {
    from: { x: number; y: number };
    to: { x: number; y: number };
  };
}
export interface ChequerPosition {
  x: number;
  y: number;
}
/**
 * 游戏入口
 */

class Building extends EventTarget {
  constructor(options?: GameOptionsProps) {
    super();
    const {
      width,
      height,
      test,
      enableDrag = true,
      enableSoliderDrag = true,
      offsetStartX,
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
      width,
      height,
      test,
      enableDrag,
    });
    this.app = new Application({
      width: _width,
      height: _height,
      resolution: config.resolution,
      antialias: true,
      backgroundAlpha: test ? 0.5 : 0,
    });
    this.enableSoliderDrag = enableSoliderDrag;
    this.app.stage.sortableChildren = true;
    // 添加棋盘
    this.app.stage.addChild(this.boards.container);
    this.test = test;

    if (screenRota) {
      this.app.stage.rotation = Math.PI / 2;
      this.app.stage.position.set(1920 / 2, 0);
    }

    this.init();
  }

  test?: boolean;

  app: Application;

  boards: Boards;

  boardsCreated = false;

  view = document.createElement('canvas');

  private axis: AxisPoint[][] = [];

  builders: Builder[] = []; // 小人

  private dragPreBuilder?: Builder; // 当前拖动小人

  private dragPreBuilderEvent?: InteractionEvent; // 当前拖动小人事件数据

  private enableSoliderDrag = false; // 是否启用小人拖动

  activeBuilder?: Builder; // 当前选中建筑

  activeBuilderFlag?: boolean; // 表示事件触发源未activeSolider

  activeChequer?: ChequerPosition; // 当前选中格子

  init() {
    this.view = this.app.view;

    this.axis = this.boards.axis;

    // 绑定拖动事件 从棋盘外拖到棋盘内
    this.boards.container.on('pointermove', e => {
      if (
        this.enableSoliderDrag &&
        this.dragPreBuilder &&
        this.dragPreBuilder.container
      ) {
        this.dragPreBuilder.container.visible = true;
        this.dragPreBuilder.onDragMove(e);
        this.dragPreBuilderEvent = e;
        this.onDragStarBuilder();
      }
    });
    this.addEventListenerOfWindow();
  }

  addActiveChequer() {
    this.boards.chequers.forEach(item => {
      item.graphics.on('click', e => {
        // 清除其他格子颜色
        this.boards.chequers.forEach(item2 => {
          item2.displayState(false);
        });
        const position = {
          x: item.axisX,
          y: item.axisY,
        };
        this.activeChequer = position;
        this.dispatchEvent(getAddActiveChequerEvent(position));
        item.displayState(true);
      });
    });
  }

  creatTerrain(areaX: number, areaY: number) {
    this.boards.drawChequers(areaX, areaY);
    this.boardsCreated = true;
    this.dispatchEvent(new Event('boardsCreated'));
    this.addActiveChequer();
  }

  // 取消选中
  addEventListenerOfWindow() {
    // window.addEventListener('click', () => {
    //   if (this.activeBuilderFlag) {
    //     this.activeBuilderFlag = false;
    //     return;
    //   }
    //   this.removeActiveSolider();
    // });
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (
        e.key === 'Delete' &&
        this.activeBuilder &&
        this.activeBuilder.enableDrag
      ) {
        this.removeBuilder(this.activeBuilder);
      }
    });
  }

  // 添加小人
  addBuilder(builder: Builder) {
    this.builders.push(builder);
    this.boards.container.sortableChildren = true;
    this.boards.container.zIndex = 1;
    this.boards.container.addChild(builder.container);

    // builder.axisPoint?.chequer?.graphics.on('', () => {});
    // builder.axisPoint?.chequer?.graphics
    //   ?.on('pointerdown', () => {
    //     // this.showSameSoliderState(soldier);
    //     if (builder.enableDrag) {
    //       builder.setMoved(true);
    //       builder.matrix4?.setState(stateType.PREVIEW);
    //       builder.changeState(stateType.PREVIEW);
    //     }
    //   })
    //   .on('pointermove', event => {
    //     if (builder.dragging && builder.enableDrag) {
    //       this.onDragStarBuilder(builder);
    //       this.onDrageMoveBuilder(event, builder);
    //       builder.matrix4?.setState(stateType.PREVIEW);
    //       builder.changeState(stateType.PREVIEW);
    //     }
    //   })
    //   .on('pointerup', event => {
    //     if (builder.moved) {
    //       const res = this.onDragEndBuilder(event, builder);
    //       if (res) {
    //         this.dispatchEvent(getUpdateBuilderPosition(this.builders));
    //         this.dispatchEvent(getAddActiveBuilderEvent(builder));
    //       }
    //     }
    //     this.activeBuilderFlag = true;
    //     this.activeBuilder = builder;
    //     builder.changeState(stateType.ACTIVE, true);
    //     this.dispatchEvent(getAddActiveBuilderEvent(builder));
    //   })
    //   .on('click', (e: InteractionEvent) => {
    //     this.activeBuilderFlag = true;
    //   });

    builder.container
      .on('pointerdown', () => {
        // this.showSameSoliderState(soldier);
        if (builder.enableDrag) {
          builder.setMoved(true);
          builder.matrix4?.setState(stateType.PREVIEW);
          builder.changeState(stateType.PREVIEW);
        }
      })
      .on('pointermove', event => {
        if (builder.dragging && builder.enableDrag) {
          this.onDragStarBuilder(builder);
          this.onDrageMoveBuilder(event, builder);
          builder.matrix4?.setState(stateType.PREVIEW);
          builder.changeState(stateType.PREVIEW);
        }
      })
      .on('pointerup', event => {
        if (builder.moved) {
          const res = this.onDragEndBuilder(event, builder);
          if (res) {
            this.dispatchEvent(getUpdateBuilderPosition(this.builders));
            this.dispatchEvent(getAddActiveBuilderEvent(builder));
          }
        }
        if (!builder.isRemove) {
          this.activeBuilderFlag = true;
          this.activeBuilder = builder;
          builder.changeState(stateType.ACTIVE, true);
          this.dispatchEvent(getAddActiveBuilderEvent(builder));
        }
      })
      .on('click', (e: InteractionEvent) => {
        this.activeBuilderFlag = true;
      });

    builder.once('cancel', () => {
      this.removeBuilder(builder);
      this.dispatchEvent(getCancelBuilderEvent(builder));
    });

    builder.once('confirm', () => {
      this.dispatchEvent(getConfirmBuilderEvent(builder));
    });
  }

  // 添加当前选中小人
  addActiveSolider(activeBuilder: Builder) {
    this.activeBuilder = activeBuilder;
    this.activeBuilderFlag = true;
    activeBuilder.changeState(stateType.ACTIVE, true);
    this.dispatchEvent(getAddActiveBuilderEvent(activeBuilder));
  }

  // 移除当前选中小人状态（不会删除棋盘上的棋子）
  removeActiveSolider() {
    if (this.activeBuilder) {
      this.dispatchEvent(getRemoveActiveBuilderEvent());
      delete this.activeBuilder;
    }
  }

  // 设置小人们
  setBuilders(builders: Builder[]) {
    const newBuilders: Builder[] = [];
    builders.forEach(builder => {
      if (this.builders.includes(builder)) {
        newBuilders.push(builder);
      }
    });
    this.builders = newBuilders;
    this.dispatchEvent(getUpdateBuilderPosition(this.builders));
  }

  // 从棋盘上移除小人
  removeBuilder(builder: Builder) {
    builder.axisPoint?.chequer?.addText();
    builder.matrix4?.addText();
    builder.setRemove(true);
    builder.changeState(stateType.PREVIEW, false);
    this.builders = this.builders.filter(item => item !== builder);
    this.boards.container.removeChild(builder.container);
    this.dispatchEvent(getUpdateBuilderPosition(this.builders));
    this.removeActiveSolider();
  }

  // 清空所有小人
  clearBuilder() {
    this.builders.forEach(item => {
      item.changeState(stateType.PREVIEW, false);
      this.boards.container.removeChild(item.container);
    });
    this.builders = [];
    this.dispatchEvent(getUpdateBuilderPosition(this.builders));
  }

  setEnableDrag(state: boolean) {
    this.enableSoliderDrag = state;
  }

  // 移动端, 棋盘外向棋盘内拖拽小人
  addDragPreBuilderApp(options: BuilderOption) {
    if (options.areaX === 1) {
      const chequer = this.boards.chequers.find(
        item => item.state === stateType.PREVIEW,
      ) as Chequer;

      if (chequer) {
        let builder_axisX = chequer.axisX;
        let builder_axisY = chequer.axisY;
        if (this.activeChequer) {
          builder_axisX = this.activeChequer.x;
          builder_axisY = this.activeChequer.y;
          // 清除选中位置
          this.activeChequer = null;
          this.dispatchEvent(getAddActiveChequerEvent(null));
        }
        const builder = this.createBuilder(
          builder_axisX,
          builder_axisY,
          options,
        );
        this.dispatchEvent(getAddActiveBuilderEvent(builder));
        builder.addHandleBtn();
        builder.addConsumeText();
      } else {
        // 棋盘空位不足
        this.dispatchEvent(getErrorEvent('Insufficient Chessboard Space'));
      }
    } else if (options.areaX === 2) {
      const matrix4 = this.boards.matrix4s.find(item => {
        if (this.activeChequer) {
          return (
            item.chequers.every(
              chequer => chequer.state === stateType.PREVIEW,
            ) &&
            item.chequers.some(
              chequer =>
                chequer.axisX === this.activeChequer.x &&
                chequer.axisY === this.activeChequer.y,
            )
          );
        }
        return item.chequers.every(
          chequer => chequer.state === stateType.PREVIEW,
        );
      });
      if (this.activeChequer) {
        // 清除选中位置
        this.activeChequer = null;
        this.dispatchEvent(getAddActiveChequerEvent(null));
      }
      if (matrix4) {
        const builder = this.createBuilder(
          matrix4.chequers[0].axisX,
          matrix4.chequers[0].axisY,
          options,
        );
        this.dispatchEvent(getAddActiveBuilderEvent(builder));
        builder.addHandleBtn();
        builder.addConsumeText();
      } else {
        // 棋盘空位不足
        this.dispatchEvent(getErrorEvent('Insufficient Chessboard Space'));
      }
    }
  }

  // PC端, 棋盘外向棋盘内拖拽小人
  addDragPreBuilder(builder: Builder) {
    this.setEnableDrag(true);
    this.dragPreBuilder = builder.clone();
    this.dragPreBuilder.setDragging(true);
    this.dragPreBuilder.container.visible = false;
    this.app.stage.addChild(this.dragPreBuilder.container);
    this.dragPreBuilder.container.on('pointermove', event => {
      this.onDrageMoveBuilder(event, builder);
    });
  }

  // 关闭拖拽中的小人
  offDragPreBuilder() {
    this.setEnableDrag(false);
    if (this.dragPreBuilder && this.dragPreBuilderEvent) {
      const builder = this.dragPreBuilder.clone();
      const res = this.onDragEndBuilder(this.dragPreBuilderEvent, builder);
      if (res) {
        this.addBuilder(builder);
        this.dispatchEvent(
          new CustomEvent('updateBuilderPosition', {
            detail: { builders: this.builders },
          }),
        );
        builder.addHandleBtn();
        builder.addConsumeText();
        this.dispatchEvent(getAddActiveBuilderEvent(builder));
      }
      this.dragPreBuilder.setDragging(false);
      this.dragPreBuilder.container.visible = false;
      this.app.stage.removeChild(this.dragPreBuilder.container);
      delete this.dragPreBuilder;
      delete this.dragPreBuilderEvent;
    }
  }

  // 拖拽小人开始生命周期
  onDragStarBuilder(builder?: Builder) {
    this.boards.chequers.forEach(item => {
      // if (builder?.axisPoint?.chequer === item) {
      //   builder.changeState(stateType.PREVIEW);
      // } else if (builder) {
      //   builder.changeState(stateType.DISABLE);
      // }
      item.displayState(true);
    });
    this.builders.forEach(item => {
      if (item === builder) {
        item.changeState(stateType.PREVIEW);
      } else {
        item.changeState(stateType.DISABLE);
      }
    });
  }

  // 移动小人
  onDrageMoveBuilder(event: InteractionEvent, builder: Builder) {
    if (builder.areaX === 2) {
      const matrix4 = this.boards.checkCollisionPointOfTow(event);
      matrix4?.setState(stateType.PLACE);
      return;
    }
    const chequer = this.boards.checkCollisionPoint(event);
    // chequer?.setState(stateType.PLACE);
  }

  // 拖拽小人结束生命周期
  onDragEndBuilder(event: InteractionEvent, builder: Builder) {
    if (builder.areaX === 2) {
      const matrix4 = this.boards.checkCollisionPointOfTow(event, true);

      if (matrix4) {
        builder.setPosition(
          new AxisPoint(
            matrix4.chequers[0].axisX,
            matrix4.chequers[0].axisY,
            matrix4.chequers[0],
          ),
          matrix4,
        );
        matrix4.setState(stateType.ACTIVE);
      } else {
        builder.resetPosition();
      }
      this.restoreActiveChequer();

      return !!matrix4;
      // builder.setPosition(new AxisPoint(item.axisX, item.axisY, item));
    }
    const chequer = this.boards.checkCollisionPoint(event, true);

    if (chequer) {
      builder.setPosition(new AxisPoint(chequer.axisX, chequer.axisY, chequer));
    } else {
      builder.resetPosition();
    }
    this.restoreActiveChequer();
    return !!chequer;
  }

  restoreActiveChequer() {
    // 恢复所选格子颜色
    if (this.activeChequer) {
      this.boards.chequers.forEach(item => {
        if (
          item.axisX === this.activeChequer.x &&
          item.axisY === this.activeChequer.y
        ) {
          item.displayState(true);
        }
      });
    }
  }

  /**
   * @dev 创建小人并添加到棋盘
   * @param _x x轴坐标
   * @param _y y轴坐标
   * @param option 参数
   * @returns 小人
   */
  createBuilder(_x: number, _y: number, option: BuilderOption) {
    const axis = this.getAxis(_x, _y);
    const matrix = option.areaX === 2 ? this.getMatrix4ByAxis(axis) : undefined;
    if (!axis) return null;
    if (!matrix && option.areaX === 2) return null;
    const builder = new Builder(option);
    builder.setPosition(axis, matrix);

    this.addBuilder(builder);

    builder.changeState(stateType.DISABLE, false);

    builder.axisPoint?.chequer?.removeText();
    builder.matrix4?.removeText();

    return builder;
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
   * @returns Builder | null
   */
  getMatrix4ByAxis(axis: AxisPoint) {
    return this.boards.matrix4s.find(
      item => item.chequers[0] === axis?.chequer,
    );
  }

  /**
   * @dev 根据坐标获取小人
   * @param axis
   * @returns Builder | null
   */
  findBuilderByAxis(axis: AxisPoint) {
    return this.builders.find(builder => builder.axisPoint === axis);
  }

  findBuilderByXY(x: number, y: number) {
    const axis = this.getAxis(x, y);
    // debugger;
    return this.builders.find(
      builder => builder.axisPoint?.chequer === axis?.chequer,
    );
  }

  initBuilder(list: BuilderInfoOfApi[]) {
    if (this.builders.length) {
      this.updateBuilderState(list, true);
      return;
    }

    list?.forEach(item => {
      this.createBuilder(item.position.from.x, item.position.from.y, {
        building: item.building,
        src: `${item.building.index}`,
        id: `${item.building._id}`,
        race: item.building.race,
        areaX: item.building.propterty.size.area_x,
        areaY: item.building.propterty.size.area_y,
        isBuilding: false,
        builded: true,
        Lv: item.building.propterty.levelEnergy,
        IsUpgrade: false,
      });
    });
  }

  initBuildingBuilder(list: BuilderInfoOfApi[]) {
    if (this.builders.length) {
      this.updateBuilderState(list);
      return;
    }

    list.forEach(item => {
      this.createBuilder(item.position.from.x, item.position.from.y, {
        building: item.building,
        src: `${item.building.index}`,
        id: `${item.building._id}`,
        race: item.building.race,
        areaX: item.building.propterty.size.area_x,
        areaY: item.building.propterty.size.area_y,
        isBuilding: true,
        builded: false,
        Lv: item.building.propterty.levelEnergy,
        IsUpgrade: false,
      });
    });
  }

  upgradeBuildingBuilder(list: BuilderInfoOfApi[], IsUpgrade?: boolean) {
    if (this.builders.length) {
      this.updateBuilderState(list, true, IsUpgrade);
      return;
    }

    list.forEach(item => {
      this.createBuilder(item.position.from.x, item.position.from.y, {
        building: item.building,
        src: `${item.building.index}`,
        id: `${item.building._id}`,
        race: item.building.race,
        areaX: item.building.propterty.size.area_x,
        areaY: item.building.propterty.size.area_y,
        isBuilding: false,
        builded: true,
        Lv: item.building.propterty.levelEnergy,
        IsUpgrade,
      });
    });
  }

  updateBuilderState(
    list: BuilderInfoOfApi[],
    created?: boolean,
    IsUpgrade?: boolean,
  ) {
    list.forEach(item => {
      const builder = this.findBuilderByXY(
        item.position.from.x,
        item.position.from.y,
      );
      if (builder) {
        builder.setIsBuilded(!!created);
        builder.setIsBuilding(!created);
        builder.setIsUpgrade(!!IsUpgrade);
        if (!IsUpgrade) {
          builder.updateLv(item.building.propterty.levelEnergy);
        }
        builder.option.building = {
          ...item.building,
        };
      } else {
        this.createBuilder(item.position.from.x, item.position.from.y, {
          building: item.building,
          src: `${item.building.index}`,
          id: `${item.building._id}`,
          race: item.building.race,
          areaX: item.building.propterty.size.area_x,
          areaY: item.building.propterty.size.area_y,
          isBuilding: !created,
          builded: !!created,
          Lv: item.building.propterty.levelEnergy,
          IsUpgrade,
        });
      }
    });
  }

  /**
   * @dev 根据id获取小人
   * @param id
   * @returns Builder | null
   */
  findBuilderById(id: string) {
    return this.builders.find(builder => builder.id === id);
  }

  once(event: string, handle: any) {
    // const callback = () => {
    //   handle();
    //   this.removeEventListener(event, callback);
    // };
    this.addEventListener(event, handle, { once: true });
  }
}

export default Building;

/* 

  拖建筑
    1*1的建筑 2*2的建筑
  
  拖到棋盘后 对未保存的建筑进行拖动
  
  保存的建筑不能拖

  更改策略
  按照现在的代码进行重构 从新梳理逻辑 不要去读原来的代码 逻辑有些不一样

  2 * 2 的建筑中心点放置

  要不要在现在的建筑上加一个Matrix4的属性
  
  先解决第一个问题
  1.1*1的拖动 放置后状态不对 需要重置所有状态
  2.2*2的拖动 会出现三个格子的情况
  3.
*/
