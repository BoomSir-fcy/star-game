import { Loader } from '@pixi/loaders';
import { InteractionEvent, InteractionData } from '@pixi/interaction';
import { Spine } from 'pixi-spine';
import { Application } from '@pixi/app';

// import * as PIXI from 'pixi.js';
import config from '../config';
import '../libs/pixi-dragonbones';
import AxisPoint from './AxisPoint';
import Boards from './Boards';
import { stateType } from './Chequer';
import Soldier, { AttrSoldierOptions } from './Soldier';
import {
  getAddActiveSoliderEvent,
  getRemoveActiveSoliderEvent,
  getUpdateSoldierPosition,
} from './event';

interface GameOptionsProps {
  height?: number;
  width?: number;
  test?: boolean;
}
class Game extends EventTarget {
  constructor(options?: GameOptionsProps) {
    super();
    const { width, height, test } = options || {};
    const _width = width || config.WIDTH;
    const _height = height || config.HEIGHT;
    this.boards = new Boards({ width, height, test });
    this.app = new Application({
      width: _width,
      height: _height,
      resolution: config.resolution,
      antialias: true,
      backgroundAlpha: 0.5,
    });
    this.app.stage.addChild(this.boards.container);
    this.app.view.addEventListener(
      'wheel',
      this.boards.onHandleWheel.bind(this.boards),
    );
    this.init();
  }

  app;

  boards;

  view = document.createElement('canvas');

  private axis: AxisPoint[][] = [];

  soldiers: Soldier[] = [];

  private dragPreSoldier?: Soldier;

  private dragPreSoldierEvent?: InteractionEvent;

  private enableDrag = false;

  activeSolider?: Soldier;

  activeSoliderFlag?: boolean; // 表示事件触发源未activeSolider

  init() {
    this.view = this.app.view;

    this.axis = this.boards.axis;

    this.boards.container.on('pointermove', e => {
      if (
        this.enableDrag &&
        this.dragPreSoldier &&
        this.dragPreSoldier.container
      ) {
        this.dragPreSoldier.container.visible = true;
        this.dragPreSoldier.onDragMove(e);
        this.dragPreSoldierEvent = e;
        this.onDragStarSoldier();
      }
    });
    // const app = new PIXI.Application({
    //   width: config.WIDTH,
    //   height: config.HEIGHT,
    //   resolution: config.resolution,
    //   antialias: true,
    //   backgroundAlpha: 0.5,
    // });
    // // document.body.appendChild(app.view);
    // this.view = app.view;

    // this.app = app;

    // app.stop();

    // this.addDragon();
    // this.addSpine();
    // setTimeout(() => {
    //   this.app.stop();
    // }, 2000);
    this.addEventListenerOfWindow();
  }

  addEventListenerOfWindow() {
    window.addEventListener('click', () => {
      if (this.activeSoliderFlag) {
        this.activeSoliderFlag = false;
        return;
      }
      this.removeActiveSolider();
    });
  }

  addSoldier(soldier: Soldier) {
    this.soldiers.push(soldier);
    this.boards.container.addChild(soldier.container);
    soldier.container
      .on('pointerdown', () => {
        this.showSameSoliderState(soldier);
        soldier.setMoved(false);
      })
      .on('pointermove', () => {
        if (soldier.dragging) {
          if (!soldier.moved) {
            soldier.setMoved(true);
            this.onDragStarSoldier();
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
      })
      .on('click', (e: InteractionEvent) => {
        this.activeSoliderFlag = true;
      });
    soldier.addEventListener('death', () => {
      this.removeSoldier(soldier);
    });
    soldier.addEventListener('enemyChange', () => {
      // this.removeSoldier(soldier);
      this.dispatchEvent(getUpdateSoldierPosition(this.soldiers));
    });
  }

  addActiveSolider(activeSolider: Soldier) {
    this.activeSolider = activeSolider;
    this.activeSoliderFlag = true;
    activeSolider.changeState(stateType.ACTIVE, true);
    this.dispatchEvent(getAddActiveSoliderEvent(activeSolider));
  }

  removeActiveSolider() {
    if (this.activeSolider) {
      this.dispatchEvent(getRemoveActiveSoliderEvent());
      delete this.activeSolider;
    }
  }

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

  removeSoldier(soldier: Soldier) {
    this.soldiers = this.soldiers.filter(item => item !== soldier);
    this.boards.container.removeChild(soldier.container);
    soldier.changeState(stateType.PREVIEW, false);
    this.dispatchEvent(getUpdateSoldierPosition(this.soldiers));
    this.removeActiveSolider();
  }

  clearSoldier() {
    this.soldiers.forEach(item => {
      item.changeState(stateType.PREVIEW, false);
      this.boards.container.removeChild(item.container);
    });
    this.soldiers = [];
    this.dispatchEvent(getUpdateSoldierPosition(this.soldiers));
  }

  setEnableDrag(state: boolean) {
    this.enableDrag = state;
  }

  addDragPreSoldier(soldier: Soldier) {
    this.setEnableDrag(true);
    this.dragPreSoldier = soldier.clone({ enableDrag: true });
    this.dragPreSoldier.setDragging(true);
    this.dragPreSoldier.container.visible = false;
    this.app.stage.addChild(this.dragPreSoldier.container);
  }

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

  showSameSoliderState(soldier?: Soldier) {
    this.soldiers.forEach(item => {
      if (soldier?.options?.unique_id === item.options?.unique_id) {
        item.changeState(stateType.ACTIVE, true);
      }
    });
  }

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

  onDragEndSoldier(event: InteractionEvent, soldier: Soldier) {
    let canDrag = false;

    this.boards.chequers.forEach(item => {
      const collection = item.checkCollisionPoint(event.data.global);
      if (collection && item.state === stateType.PREVIEW) {
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

  createSoldier(_x: number, _y: number, option: AttrSoldierOptions) {
    const axis = this.getAxis(_x, _y);
    if (!axis) return null;
    const soldier = new Soldier({
      ...option,
      x: axis.x,
      y: axis.y,
      axisPoint: axis,
    });

    this.addSoldier(soldier);
    return soldier;
  }

  getAxis(x: number, y: number) {
    try {
      return this.axis[x][y];
    } catch (error) {
      console.error('Get axis is error, place wite some time of this created');
      return null;
    }
  }

  findSoldierByAxis(axis: AxisPoint) {
    return this.soldiers.find(soldier => soldier.axisPoint === axis);
  }

  findSoldierById(sid: string) {
    return this.soldiers.find(soldier => soldier.sid === sid);
  }

  addDragon() {
    this.app.stop();
    const loader = Loader.shared;
    loader.reset();

    loader
      .add('skeleton', '/assets/stone_movie_clip/ske.json')
      .add('texture_json', '/assets/stone_movie_clip/tex.json')
      .add('texture_png', '/assets/stone_movie_clip/tex.png')
      .load((_loader, res: any) => {
        return this.onAssetsLoaded(res);
      });
  }

  onAssetsLoaded(res: any) {
    const { factory } = window.dragonBones.PixiFactory;

    factory.parseDragonBonesData(res.skeleton.data);
    factory.parseTextureAtlasData(
      res.texture_json.data,
      res.texture_png.texture,
    );

    const armatureDisplay = factory.buildArmatureDisplay('yans');
    armatureDisplay.animation.play('play');
    armatureDisplay.x = 600;
    armatureDisplay.y = 100;

    this.app.stage.addChild(armatureDisplay);

    this.app.start();
  }

  addSpine() {
    this.app.stop();
    const loader = Loader.shared;
    loader.reset();

    loader.add('yans', '/assets/yans/yans.json').load((_loader, res: any) => {
      return this.onAssetsLoadedSpine(res);
    });
  }

  onAssetsLoadedSpine(res: any) {
    const dragon = new Spine(res.yans.spineData);
    // dragon.state
    dragon.update(0);
    dragon.autoUpdate = false;

    dragon.position.set(300, 300);

    this.app.stage.addChild(dragon);
    dragon.state.setAnimation(0, 'play', true);

    this.app.start();

    this.app.ticker.add(() => {
      // update the spine animation, only needed if dragon.autoupdate is set to false
      dragon.update(0.01666666666667); // HARDCODED FRAMERATE!
    });
  }
}

export default Game;
