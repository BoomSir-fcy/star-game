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
import { Graphics } from '@pixi/graphics';
import Combat, { CombatOptions } from './Combat';
import Chequer, { StateType, stateType } from './Chequer';
import AxisPoint from './AxisPoint';
// import { onDragEnd, onDragMove, onDragStart } from './utils';

export interface AttrSoldierOptions extends CombatOptions {
  id: number;
  unique_id: number;
  sid?: string;
  hp?: number;
  activePh?: number;
  isEnemy?: boolean;
  attackId?: string;
  unitInfo?: Api.Game.UnitInfo;
  enableDrag?: boolean;
  test?: boolean;
}
export interface SoldierOptions extends AttrSoldierOptions {
  x: number;
  y: number;
  axisPoint?: AxisPoint;
}
class Soldier extends Combat {
  constructor(options: SoldierOptions) {
    super({
      srcId: options.srcId,
      race: options.race,
    });
    this.init(options);
  }

  type = 0; // 什么类型的士兵

  startPoint = new Point();

  enableDrag = true;

  id = 0;

  sid?: string;

  unique_id = 0;

  attackId = '';

  moved = false; // 是否发生移动

  testButton = new Graphics();

  options?: SoldierOptions;

  init(options: SoldierOptions) {
    const {
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
      test,
      sid,
    } = options;

    this.options = {
      ...this.options,
      ...options,
    };
    this.id = id;

    this.sid = sid;

    this.unique_id = unique_id;

    this.isEnemy = isEnemy;

    this.axisPoint = axisPoint;

    this.axisPoint?.chequer?.setState(stateType.DISABLE);

    // this.textureRes = textureRes;
    this.displaySprite.texture = this.texture1;
    this.displaySprite.anchor.set(0.5);
    this.container.x = x;
    this.container.y = y;
    this.container.scale.set(0.6);
    this.displaySprite.position.set(-5, -15);
    this.displaySprite.width = 180;
    this.displaySprite.height = 180;

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

    this.container.buttonMode = Boolean(enableDrag);
    this.container.interactive = Boolean(enableDrag);

    this.enableDrag = Boolean(enableDrag);

    this.drawAttackEffect();

    this.container
      .on('pointerdown', e => this.onDragStart(e))
      .on('pointerup', () => this.onDragEnd())
      .on('pointerupoutside', () => {
        this.onDragEnd();
        this.resetPosition();
      })
      .on('pointermove', () => this.onDragMove());

    if (test) {
      this.testButton.beginFill(0xde3249);
      this.testButton.drawRect(0, 0, 60, 32);
      this.testButton.endFill();
      const text = new Text('叛变', { fill: 0xffffff });
      this.testButton.position.set(-50, 0);
      this.testButton.addChild(text);
      this.container.addChild(this.testButton);
      this.testButton.interactive = true;
      this.testButton.buttonMode = true;
      this.testButton.on('click', () => {
        this.isEnemy = !this.isEnemy;
        this.drawHp();
        this.dispatchEvent(new Event('enemyChange'));
      });
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
    const { srcId, race, x, y, axisPoint, enableDrag, id, unique_id } =
      newOptions;

    return new Soldier({
      ...this.options,
      srcId,
      race,
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
