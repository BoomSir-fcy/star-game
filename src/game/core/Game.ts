import { Loader } from '@pixi/loaders';
import { InteractionEvent, InteractionData } from '@pixi/interaction';
import { Spine } from 'pixi-spine';

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
}
class Game extends EventTarget {
  constructor(options?: GameOptionsProps) {
    super();
    const { width, height } = options || {};
    this.boards = new Boards({ width, height });
    this.init();
  }

  boards;

  view = document.createElement('canvas');

  private axis: AxisPoint[][] = [];

  soldiers: Soldier[] = [];

  private dragPreSoldier?: Soldier;

  private dragPreSoldierEvent?: InteractionEvent;

  private enableDrag = false;

  activeSolider?: Soldier;

  activeSoliderFlag?: boolean; // 表示事件触发源未activeSolider

  app: any;

  init() {
    this.view = this.boards.app.view;

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
        this.onDragStarSoldier();
        soldier.setMoved(false);
      })
      .on('pointermove', () => {
        soldier.setMoved(true);
      })
      .on('pointerup', event => {
        const res = this.onDragEndSoldier(event, soldier);
        if (res) {
          this.dispatchEvent(getUpdateSoldierPosition(this.soldiers));
        }
        this.activeSoliderFlag = true;
        this.activeSolider = soldier;
        soldier.changeState(stateType.ACTIVE, true);
        this.dispatchEvent(getAddActiveSoliderEvent(soldier));
        // this.activeSoliderFlag = true;
        // if (!soldier.moved) {
        //   this.activeSolider = soldier;
        //   soldier.changeState(stateType.ACTIVE, true);
        // }
      })
      .on('click', (e: InteractionEvent) => {
        this.activeSoliderFlag = true;
        // this.activeSolider = soldier;
        // soldier.changeState(stateType.ACTIVE, true);
        // this.dispatchEvent(getAddActiveSoliderEvent(soldier));
      });
  }

  removeActiveSolider() {
    if (this.activeSolider) {
      this.activeSolider.changeState(stateType.DISABLE, false);
      this.activeSolider?.changeState(stateType.DISABLE, false);
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

  setEnableDrag(state: boolean) {
    this.enableDrag = state;
  }

  addDragPreSoldier(soldier: Soldier) {
    this.setEnableDrag(true);
    this.dragPreSoldier = soldier.clone({ enableDrag: true });
    this.dragPreSoldier.setDragging(true);
    this.dragPreSoldier.container.visible = false;
    this.boards.app.stage.addChild(this.dragPreSoldier.container);
    this.onDragStarSoldier();
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
      this.boards.app.stage.removeChild(this.dragPreSoldier.container);
      delete this.dragPreSoldier;
      delete this.dragPreSoldierEvent;
    }
  }

  onDragStarSoldier() {
    this.boards.chequers.forEach(item => {
      item.displayState(true);
    });
  }

  onDragEndSoldier(event: InteractionEvent, soldier: Soldier) {
    let canDrag = false;

    this.boards.chequers.forEach(item => {
      const collection = item.checkCollisionPoint(event.data.global);
      if (collection && item.state === stateType.PREVIEW) {
        soldier.setPosition(
          new AxisPoint(item.centerPoint.x, item.centerPoint.y, item),
        );
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

  addDragon() {
    this.boards.app.stop();
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

    this.boards.app.stage.addChild(armatureDisplay);

    this.boards.app.start();
  }

  addSpine() {
    this.boards.app.stop();
    const loader = Loader.shared;
    loader.reset();

    loader.add('yans', '/assets/yans/yans.json').load((_loader, res: any) => {
      return this.onAssetsLoadedSpine(res);
    });
  }

  onAssetsLoadedSpine(res: any) {
    const dragon = new Spine(res.yans.spineData);
    dragon.skeleton.setToSetupPose();
    dragon.update(0);
    dragon.autoUpdate = false;

    dragon.position.set(300, 300);

    this.boards.app.stage.addChild(dragon);
    this.boards.app.start();
    // dragon.state.setAnimation(0, 'play', true);
    dragon.state.setAnimation(1, 'play', true);

    this.boards.app.ticker.add(() => {
      // update the spine animation, only needed if dragon.autoupdate is set to false
      dragon.update(0.01666666666667); // HARDCODED FRAMERATE!
    });
  }
}

export default Game;
