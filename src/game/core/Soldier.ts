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
import config from 'game/config';
import Combat, { CombatOptions } from './Combat';
import Chequer, { StateType, stateType } from './Chequer';
import AxisPoint from './AxisPoint';
// import { onDragEnd, onDragMove, onDragStart } from './utils';

export interface AttrSoldierOptions extends CombatOptions {
  id: number;
  unique_id: number;
  sid?: string;
  hp?: number;
  shield?: number;
  activePh?: number;
  isEnemy?: boolean;
  attackId?: string;
  unitInfo?: Api.Game.UnitInfo;
  enableDrag?: boolean;
  test?: boolean;
  activeCountText?: string;
  noHp?: boolean;
}
export interface SoldierOptions extends AttrSoldierOptions {
  x: number;
  y: number;
  axisPoint?: AxisPoint;
  zIndex?: number;
}
class Soldier extends Combat {
  constructor(options: SoldierOptions) {
    super({
      srcId: options.srcId,
      race: options.race,
      attackType: options.unitInfo?.attack_type,
      skillType: options.unitInfo?.skill_type,
    });
    this.init(options);
  }

  type = 0; // 什么类型的士兵

  startPoint = new Point();

  enableDrag = true;

  id = 0;

  unique_id = 0;

  attackId = '';

  moved = false; // 是否发生移动

  testButton = new Graphics();

  options?: SoldierOptions;

  activeCountText = new Text('');

  init(options: SoldierOptions) {
    const {
      x,
      y,
      axisPoint,
      enableDrag = true,
      id,
      isEnemy = false,
      hp = 0,
      shield = 0,
      activePh = 0,
      attackId = '',
      unique_id,
      test,
      sid,
      zIndex = 0,
      unitInfo,
      activeCountText,
      noHp,
    } = options;

    this.options = {
      ...this.options,
      ...options,
    };

    if (activeCountText) {
      this.addActiveCountText(activeCountText);
    }
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
    this.container.zIndex = zIndex;
    this.container.scale.set(0.6);
    this.displaySprite.position.set(-5, -15);
    this.displaySprite.width = 180;
    this.displaySprite.height = 180;

    this.startPoint.set(x, y);

    this.container.addChild(this.spriteShadow);
    this.container.addChild(this.displaySprite);
    this.shield = shield;
    this.hp = hp || unitInfo?.hp;
    this.activePh = activePh || this.hp;
    if (this.hp && !noHp) {
      this.renderPh();
    }

    this.attackId = attackId;
    if (this.attackId) {
      this.createAttackId();
    }

    this.container.buttonMode = Boolean(enableDrag);
    this.container.interactive = Boolean(enableDrag);

    this.enableDrag = Boolean(enableDrag);

    this.container
      .on('pointerdown', e => this.onDragStart(e))
      .on('pointerup', () => this.onDragEnd())
      .on('pointerupoutside', () => {
        this.onDragEnd();
        this.resetPosition();
      })
      .on('pointermove', () => this.onDragMove())
      .on('pointerover', () => this.onDragOver())
      .on('pointerout', () => this.onDragOut());

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
      this.testButton
        .on('click', () => {
          this.isEnemy = !this.isEnemy;
          this.drawHp();
          this.dispatchEvent(new Event('enemyChange'));
        })
        .on('touchend', () => {
          this.isEnemy = !this.isEnemy;
          this.drawHp();
          this.dispatchEvent(new Event('enemyChange'));
        });
    }
  }

  upDateActiveCountText(activeCountText) {
    this.container.removeChild(this.activeCountText);
    this.addActiveCountText(activeCountText);
  }

  addActiveCountText(activeCountText) {
    this.activeCountText = new Text(activeCountText, {
      fill: [0xffffff, 0x4ffffb],
      fontSize: 30,
      dropShadow: true,
      dropShadowColor: 'rgba(0,0,0,0.9500)',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      stroke: 'rgba(225,225,225,0.5)',
      strokeThickness: 1,
    });
    this.activeCountText.x = -30;
    this.activeCountText.y = -100;
    this.container.addChild(this.activeCountText);
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
    this.container.zIndex = 9999;
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
    this.updateZIndex();
  }

  setDragging(state: boolean) {
    this.dragging = state;
  }

  setMoved(moved: boolean) {
    this.moved = moved;
  }

  onDragOver() {
    this.changeState(stateType.HOVER, true);
  }

  onDragOut() {
    this.changeState(stateType.ACTIVE, false);
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
