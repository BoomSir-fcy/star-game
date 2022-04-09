import { InteractionEvent } from "pixi.js";
import AxisPoint from "./AxisPoint";
import Boards from "./Boards";
import { stateType } from "./Chequer";
import Soldier, { AttrSoldierOptions } from "./Soldier";

class Game extends EventTarget {
  constructor() {
    super();
    this.init();
  }
  
  boards = new Boards();

  view = document.createElement('canvas');

  private axis: AxisPoint[][] = [];

  soldiers: Soldier[] = [];

  private dragPreSoldier?: Soldier;

  private dragPreSoldierEvent?: InteractionEvent;

  private enableDrag = false;

  init() {
    this.view = this.boards.app.view;

    this.axis = this.boards.axis;

    this.boards.container.on('pointermove', (e) => {
      if (this.enableDrag && this.dragPreSoldier && this.dragPreSoldier.container) {
        this.dragPreSoldier.container.visible = true;
        this.dragPreSoldier.onDragMove(e)
        this.dragPreSoldierEvent = e;
      }
    })

  }

  addSoldier(soldier: Soldier) {
    console.log(soldier, '=========soldier')
    this.soldiers.push(soldier);
    this.boards.container.addChild(soldier.container);
    soldier.container.on('pointerdown', () => {
      this.onDragStarSoldier()
    }).on('pointerup', (event) => {
      const res = this.onDragEndSoldier(event, soldier)
      if (res) {
        this.dispatchEvent(new CustomEvent('updateSoldierPosition', { detail: { event, soldiers: this.soldiers, } }))
      }
    })
  }

  removeSoldier(soldier: Soldier) {
    this.soldiers = this.soldiers.filter(item => item !== soldier);
    this.boards.container.removeChild(soldier.container);
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
    this.onDragStarSoldier()

  }

  offDragPreSoldier() {
    this.setEnableDrag(false);
    if (this.dragPreSoldier && this.dragPreSoldierEvent) {
      const soldier = this.dragPreSoldier.clone();
      const res = this.onDragEndSoldier(this.dragPreSoldierEvent, soldier);
      if (res) {
        this.addSoldier(soldier);
        this.dispatchEvent(new CustomEvent('updateSoldierPosition', { detail: { soldiers: this.soldiers, } }))
      }
      this.dragPreSoldier.setDragging(false);
      this.dragPreSoldier.container.visible = false;
      this.boards.app.stage.removeChild(this.dragPreSoldier.container);
      delete this.dragPreSoldier;
      delete this.dragPreSoldierEvent
    }

  }

  
  onDragStarSoldier() {
    this.boards.chequers.forEach(item => {
      item.displayState(true);
    })
  }

  
  onDragEndSoldier(event: InteractionEvent, soldier: Soldier) {
    let canDrag = false;

    this.boards.chequers.forEach(item => {
      const collection = item.checkCollisionPoint(event.data.global);
      if (collection && item.state === stateType.PREVIEW) {
        soldier.setPosition(new AxisPoint(item.centerPoint.x, item.centerPoint.y, item));
        canDrag = true;
      }
      item.displayState(false);
    })
    if (!canDrag) {
      soldier.resetPosition();
    }
    return canDrag;
  }

  createSoldier(_x: number, _y: number, option: AttrSoldierOptions) {
    const axis = this.getAxis(_x, _y);
    console.log(axis, _x, _y)
    if (!axis) return null;
    const soldier  = new Soldier({ ...option, x: axis.x, y: axis.y, axisPoint: axis});

    this.addSoldier(soldier);
    return soldier;
  }

  getAxis(x: number, y: number) {
    try {
      return this.axis[x][y];
    } catch (error) {
      console.error('Get axis is error, place wite some time of this created');
      return null
    }

  }

  findSoldierByAxis(axis: AxisPoint) {
    return this.soldiers.find(soldier => soldier.axisPoint === axis);
  }

}

export default Game;
