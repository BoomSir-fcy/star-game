// import {
//   Sprite,
//   Texture,
//   Text,
//   InteractionEvent,
//   InteractionData,
//   Point,
// } from 'pixi.js';
import { Text } from '@pixi/text';
import { Texture } from '@pixi/core';
import { InteractionEvent, InteractionData } from '@pixi/interaction';
import { Point } from '@pixi/math';
import Combat from './Combat';
import Chequer, { StateType, stateType } from './Chequer';
import AxisPoint from './AxisPoint';
// import { onDragEnd, onDragMove, onDragStart } from './utils';

export interface AttrSoldierOptions {
  textureRes: string;
  id: number;
  unique_id: number;
  hp?: number;
  activePh?: number;
  isEnemy?: boolean;
  attackId?: string;
  unitInfo?: Api.Game.UnitInfo;
}
export interface SoldierOptions extends AttrSoldierOptions {
  x: number;
  y: number;
  axisPoint?: AxisPoint;
  enableDrag?: boolean;
}
class Soldier extends Combat {
  constructor(options: SoldierOptions) {
    super();
    this.init(options);
  }

  type = 0; // 什么类型的士兵

  startPoint = new Point();

  textureRes = '';

  enableDrag = true;

  id = 0;

  unique_id = 0;

  attackId = '';

  moved = false; // 是否发生移动

  options?: SoldierOptions;

  init(options: SoldierOptions) {
    const {
      textureRes,
      x,
      y,
      axisPoint,
      enableDrag = true,
      id,
      isEnemy = false,
      hp = 0,
      activePh = 0,
      attackId = '',
      unique_id,
    } = options;

    this.options = {
      ...this.options,
      ...options,
    };
    this.id = id;

    this.unique_id = unique_id;

    this.isEnemy = isEnemy;

    this.axisPoint = axisPoint;

    this.axisPoint?.chequer?.setState(stateType.DISABLE);

    this.textureRes = textureRes;
    this.displaySprite.texture = Texture.from(textureRes);
    this.displaySprite.anchor.set(0.5);
    this.container.x = x;
    this.container.y = y;
    this.container.scale.set(0.6);
    // this.displaySprite.width = 100;
    // this.displaySprite.height = 100;

    this.startPoint.set(x, y);

    this.container.addChild(this.displaySprite);

    this.hp = hp;
    this.activePh = activePh || hp;
    if (hp) {
      this.renderPh();
    }

    this.attackId = attackId;
    if (this.attackId) {
      this.createAttackId();
    }

    this.container.buttonMode = true;
    this.container.interactive = true;

    this.enableDrag = Boolean(enableDrag);

    if (this.enableDrag) {
      this.container
        .on('pointerdown', e => this.onDragStart(e))
        .on('pointerup', () => this.onDragEnd())
        .on('pointerupoutside', () => {
          this.onDragEnd();
          this.resetPosition();
        })
        .on('pointermove', () => this.onDragMove());
    }
  }

  createAttackId() {
    const text = new Text(this.attackId, { fill: 0xffffff, fontSize: 16 });
    text.x = -30;
    text.y = -28;
    this.container.addChild(text);
  }

  clone(option?: Partial<SoldierOptions>) {
    const newOptions = {
      ...this,
      ...option,
    };
    const { textureRes, x, y, axisPoint, enableDrag, id, unique_id } =
      newOptions;

    return new Soldier({
      ...this.options,
      textureRes,
      x,
      y,
      axisPoint,
      enableDrag,
      id,
      unique_id,
    });
  }

  dragData: InteractionData = new InteractionData();

  dragging = false;

  onDragStart(event: InteractionEvent) {
    event.stopPropagation();
    this.dragData = event.data;
    this.container.alpha = 0.9;
    this.container.filters = [];
    this.dragging = true;
    // this.axisPoint?.chequer?.setState(stateType.ACTIVE);
    this.changeState(stateType.ACTIVE);
  }

  changeState(state: StateType, visible?: boolean) {
    this.axisPoint?.chequer?.setState(state);
    if (typeof visible === 'boolean') {
      this.axisPoint?.chequer?.displayState(visible);
    }
  }

  onDragEnd() {
    this.container.alpha = 1;
    this.container.filters = [];
    this.dragging = false;
    this.axisPoint?.chequer?.setState(stateType.DISABLE);
  }

  setDragging(state: boolean) {
    this.dragging = state;
  }

  setMoved(moved: boolean) {
    this.moved = moved;
  }

  onDragMove(event?: InteractionEvent) {
    this.dragData = event?.data || this.dragData;
    if (this.dragging) {
      const newPosition = this?.dragData?.getLocalPosition(
        this.container.parent,
      );
      if (newPosition) {
        this.container.x = newPosition.x;
        this.container.y = newPosition.y;
      }
    }
  }
}

export default Soldier;
