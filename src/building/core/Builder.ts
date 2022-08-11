import { Sprite } from '@pixi/sprite';
import { InteractionEvent, InteractionData } from '@pixi/interaction';
import { Point, Polygon } from '@pixi/math';
import { FederatedPointerEvent } from '@pixi/events';
import { Texture } from '@pixi/core';
import { Graphics } from '@pixi/graphics';
import { Text } from '@pixi/text';
import { Container } from '@pixi/display';
import { raceData } from 'config/buildConfig';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import Chequer, { StateType, stateType } from './Chequer';
import AxisPoint from './AxisPoint';
import Matrix4 from './Matrix4';
import { getBuilderSpriteRes } from './utils';

dayjs.extend(duration);

export interface BuilderOption {
  src?: string;
  id: string;
  race?: number;
  building: Api.Building.Building;
  areaY: number;
  areaX: number;
  Lv: number;
  isBuilding?: boolean;
  builded?: boolean;
  enableDrag?: boolean;
  IsUpgrade?: boolean;
  ore?: number;
  energy?: number;
  spice?: number;
  Estimated_Time?: number;
}

class Builder extends EventTarget {
  constructor(option: BuilderOption) {
    super();
    const {
      src,
      id,
      race = 1,
      areaX,
      areaY,
      enableDrag,
      isBuilding,
      builded,
      Lv,
      IsUpgrade,
      ore,
      energy,
      spice,
      Estimated_Time,
    } = option;
    this.id = id;
    this.race = race;
    this.resId = src;
    this.Lv = Lv;
    this.IsUpgrade = Boolean(IsUpgrade);
    this.ore = ore;
    this.energy = energy;
    this.spice = spice;
    this.Estimated_Time = Estimated_Time;
    // const img = `${window.location.origin}/assets/buildings/${race}/${
    //   src ? src?.substring(src?.lastIndexOf('/') + 1) : '36.jpg'
    // }`;

    this.src = getBuilderSpriteRes(race, src);
    this.areaY = areaY;
    this.areaX = areaX;

    this.texture = Texture.from(this.src);

    this.enableDrag = Boolean(enableDrag);

    this.setIsBuilding(Boolean(isBuilding));
    this.setIsBuilded(Boolean(builded));

    this.option = { ...option };

    this.init();
  }

  ore = 0;

  energy = 0;

  spice = 0;

  Estimated_Time = 0;

  areaY = 1;

  areaX = 1;

  sprite: Sprite = new Sprite();

  cancelSprite: Sprite = new Sprite(Texture.from('/assets/cancel.png'));

  confirmSprite: Sprite = new Sprite(Texture.from('/assets/confirm.png'));

  texture: Texture;

  container = new Container();

  axisPoint?: AxisPoint;

  matrix4?: Matrix4;

  startPoint = new Point();

  Lv = 1;

  id = '1';

  resId = '1';

  race = 1;

  src = '';

  enableDrag = false;

  isBuilding = false;

  builded = false;

  IsUpgrade = false;

  option: BuilderOption;

  moved = false; // 是否发生移动

  isRemove = false; // 已经移除

  graphics = new Graphics();

  graphicsBox = new Graphics();

  BuildingText = new Text('Building...', {
    fill: 0xffffff,
    fontSize: 14,
    breakWords: true,
    wordWrap: true,
    wordWrapWidth: 170,
    lineHeight: 18,
  });

  UpgradeText = new Text('during Upgrade...', {
    fill: 0xffffff,
    fontSize: 14,
    breakWords: true,
    wordWrap: true,
    wordWrapWidth: 170,
    lineHeight: 18,
  });

  BuildingInfoText = new Text('');

  BuildConsumptionText = new Text('');

  position: {
    from: {
      x: number;
      y: number;
    };
    to: {
      x: number;
      y: number;
    };
  } = {
    from: {
      x: 0,
      y: 0,
    },
    to: {
      x: 0,
      y: 0,
    },
  };

  init() {
    this.sprite.texture = this.texture;

    this.sprite.width = 150 * this.areaX;
    this.sprite.height = 150 * this.areaY;
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(-20 * this.areaX, 30 * this.areaY);

    this.container.addChild(this.sprite);

    this.setEnableDrag(this.enableDrag);

    this.container.buttonMode = true;
    this.container.interactive = true;
    this.container.zIndex = 99;
    // this.container.scale.set(1.37)

    this.drawInfoBox();
    // if (!this.isBuilding && !this.builded) {
    //   this.addHandleBtn();
    // }

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
  }

  addHandleBtn() {
    this.container.sortableChildren = true;
    this.cancelSprite.buttonMode = true;
    this.cancelSprite.interactive = true;
    this.cancelSprite.anchor.set(0.5);
    this.cancelSprite.position.set(-60, 10);
    this.cancelSprite.width = 70;
    this.cancelSprite.height = 70;
    this.cancelSprite.zIndex = 99;
    this.cancelSprite.addListener('click', e => this.onCancel(e));
    this.container.addChild(this.cancelSprite);

    this.confirmSprite.buttonMode = true;
    this.confirmSprite.interactive = true;
    this.confirmSprite.anchor.set(0.5);
    this.confirmSprite.width = 70;
    this.confirmSprite.height = 70;
    this.confirmSprite.position.set(20, 10);
    this.confirmSprite.zIndex = 99;
    this.confirmSprite.addListener('click', e => this.onConfirm(e));
    this.container.addChild(this.confirmSprite);
  }

  removeHandleBtn() {
    this.container.removeChild(this.cancelSprite);
    this.container.removeChild(this.confirmSprite);
    this.Estimated_Time = 0;
  }

  onConfirm(event: FederatedPointerEvent) {
    event.stopPropagation();
    this.dispatchEvent(new Event('confirm'));
  }

  onCancel(event: FederatedPointerEvent) {
    event.stopPropagation();
    this.dispatchEvent(new Event('cancel'));
  }

  setEnableDrag(enableDrag: boolean) {
    this.enableDrag = enableDrag;
    // this.sprite.buttonMode = false;
    // this.sprite.interactive = false;
    // this.sprite;
  }

  setRemove(isRemove?: boolean) {
    this.isRemove = isRemove;
  }

  createGraphics() {
    const offsetY = -Chequer.HEIGHT * Chequer.Y_RATIO * (this.areaX - 0.5);
    const path = [
      0,
      offsetY,
      Chequer.WIDTH * Chequer.X_RATIO * this.areaX,
      Chequer.HEIGHT * Chequer.Y_RATIO * this.areaX + offsetY,
      0,
      Chequer.HEIGHT * Chequer.Y_RATIO * 2 * this.areaX + offsetY,
      -Chequer.WIDTH * Chequer.X_RATIO * this.areaX,
      Chequer.HEIGHT * Chequer.Y_RATIO * this.areaX + offsetY,
    ];
    const polygon = new Polygon(Chequer.getPath(this.areaX));
    this.graphics.lineStyle(1, 0xfff000, 0.0000000001);
    this.graphics.beginFill(0xff0f00, 0.000000000001);
    this.graphics.drawPolygon(polygon);
    this.graphics.endFill();
    this.graphics.x = 0;
    this.graphics.y = 0;
    this.graphics.y = -Chequer.HEIGHT * Chequer.Y_RATIO * (this.areaX - 0.5);
    this.graphics.zIndex = 999;

    this.graphics.interactive = true;

    // this.centerPoint.set(x, y);

    this.container.hitArea = this.graphics.hitArea;
    this.container.addChild(this.graphics);

    return this.graphics;
  }

  drawInfoBox() {
    if (this.Estimated_Time) {
      // 准备建造
      this.graphicsBox.beginFill(0x434343, 0.8);
      this.graphicsBox.drawRoundedRect(-64, 20, 130, 170, 10);
    } else {
      this.graphicsBox.beginFill(0x434343, 0.5);
      this.graphicsBox.drawRoundedRect(-64, 20, 130, 70, 10);
    }
    this.graphicsBox.endFill();
    this.graphicsBox.position.set(-20 * this.areaX, 30 * this.areaY);
    this.container.addChild(this.graphicsBox);
    this.addBuilderText();
  }

  addConsumeText() {
    let Estimated = '00:00:00';
    const Time = dayjs.duration(this.Estimated_Time * 1000);
    const hours = Time.hours();
    const minutes = Time.minutes();
    const seconds = Time.seconds();

    if (hours <= 0 && minutes <= 0 && seconds <= 0) {
      Estimated = '00:00:00';
    } else {
      Estimated = Time.format('HH:mm:ss');
    }

    this.BuildConsumptionText = new Text(
      `Resource Consumption:\nOre: ${this.ore}\nEnergy: ${this.energy}\nSpice: ${this.spice}\nEstimated Time: ${Estimated}`,
      {
        fill: 0xffffff,
        fontSize: 14,
        breakWords: true,
        wordWrap: true,
        wordWrapWidth: 124,
        lineHeight: 18,
      },
    );
    this.BuildConsumptionText.x = -60;
    this.BuildConsumptionText.y = 60;
    this.graphicsBox.addChild(this.BuildConsumptionText);
  }

  removeConsumeText() {
    this.graphicsBox.removeChild(this.BuildConsumptionText);
  }

  addBuilderText() {
    this.BuildingInfoText = new Text(
      `${raceData[this.race]?.[this.resId]?.name}    Lv${this.Lv}`,
      {
        fill: 0xffffff,
        fontSize: 14,
        breakWords: true,
        wordWrap: true,
        wordWrapWidth: 124,
        lineHeight: 18,
      },
    );
    this.BuildingInfoText.x = -60;
    this.BuildingInfoText.y = 24;
    // this.BuildingInfoText.zIndex = 999;
    this.graphicsBox.addChild(this.BuildingInfoText);
  }

  setPointAsXY(x: number, y: number) {
    const chequer = new Chequer({
      axisX: x,
      axisY: y,
    });

    const axisPoint = new AxisPoint(x, y, chequer);
    this.setPosition(axisPoint);
  }

  // 更新等级
  updateLv(lv: number) {
    this.Lv = lv;
    this.graphicsBox.removeChild(this.BuildingInfoText);
    this.addBuilderText();
  }

  // 设置升级中状态
  setIsUpgrade(IsUpgrade: boolean) {
    this.IsUpgrade = IsUpgrade;
    if (IsUpgrade) {
      this.addIsUpgradeText();
    } else {
      this.graphicsBox.removeChild(this.UpgradeText);
    }
  }

  setIsBuilding(isBuilding: boolean) {
    // this.setIsBuilding(!isBuilding)
    this.isBuilding = isBuilding;
    this.removeHandleBtn();
    this.removeConsumeText();
    if (isBuilding) {
      this.container.alpha = 0.5;
      this.enableDrag = false;
      this.addIsBuildingText();
    } else {
      this.container.alpha = 1;
      this.graphicsBox.removeChild(this.BuildingText);
    }
  }

  addIsUpgradeText() {
    // 状态文字
    this.UpgradeText.x = -60;
    this.UpgradeText.y = 68;
    this.graphicsBox.addChild(this.UpgradeText);
  }

  addIsBuildingText() {
    // 状态文字
    this.BuildingText.x = -60;
    this.BuildingText.y = 68;
    this.graphicsBox.addChild(this.BuildingText);
  }

  setIsBuilded(builded: boolean) {
    this.removeHandleBtn();
    this.removeConsumeText();
    if (builded) {
      this.setIsBuilding(false);
      this.enableDrag = false;
    }
    this.builded = builded;
  }

  // 设置位置
  setPosition(point: AxisPoint, matrix4?: Matrix4) {
    this.axisPoint?.chequer?.addText();
    this.matrix4?.addText();
    if (matrix4) {
      this.matrix4 = matrix4;
      this.axisPoint = point;
      this.container.position.set(matrix4.x, matrix4.y);
      this.startPoint.set(matrix4.x, matrix4.y);
      matrix4.setState(stateType.DISABLE);
      matrix4.displayState(false);
      matrix4.removeText();
    } else {
      this.axisPoint = point;
      this.container.position.set(point.x, point.y);
      this.startPoint.set(point.x, point.y);
      point.chequer?.setState(stateType.DISABLE);
      point.chequer?.displayState(false);
      point.chequer?.removeText();
    }

    // this.container.removeChild(this.graphics);

    this.position = {
      from: {
        x: point.axisX,
        y: point.axisY,
      },
      to: {
        x: point.axisX + this.areaX,
        y: point.axisY + this.areaY,
      },
    };

    this.createGraphics();
    // this.setEnableDrag(false);
  }

  // 重置位置 用于拖动的时候
  resetPosition() {
    const { x, y } = this.startPoint;

    this.container.position.set(x, y);
  }

  dragData: InteractionData = new InteractionData();

  dragging = false;

  onDragStart(event: InteractionEvent) {
    event.stopPropagation();
    if (this.enableDrag) {
      this.dragData = event.data;
      this.container.alpha = 0.9;
      this.container.filters = [];
      this.dragging = true;
      this.container.zIndex = 9999;
    }
    this.changeState(stateType.ACTIVE, true);
  }

  changeState(state: StateType, visible?: boolean) {
    this.axisPoint?.chequer?.setState(state);
    this.matrix4?.setState(state);
    if (typeof visible === 'boolean') {
      this.axisPoint?.chequer?.displayState(visible);
      this.matrix4?.displayState(visible);
    }
  }

  onDragEnd() {
    if (this.enableDrag) {
      this.container.alpha = 1;
      this.container.filters = [];
      this.dragging = false;
    }
    // this.axisPoint?.chequer?.setState(stateType.DISABLE);
    this.updateZIndex();
  }

  setDragging(state: boolean) {
    this.dragging = state;
  }

  onDragOver() {
    this.changeState(stateType.HOVER, true);
  }

  setMoved(moved: boolean) {
    this.moved = moved;
  }

  clone() {
    return new Builder(this.option);
  }

  onDragOut() {
    this.changeState(stateType.ACTIVE, false);
  }

  onDragMove(event?: InteractionEvent) {
    this.dragData = event?.data || this.dragData;
    if (this.enableDrag && this.dragging) {
      const newPosition = this?.dragData?.getLocalPosition(
        this.container.parent,
      );
      if (newPosition) {
        this.container.x = newPosition.x;
        this.container.y = newPosition.y;
      }
    }
  }

  updateZIndex() {
    if (this.axisPoint?.axisX + this.axisPoint?.axisY + 1) {
      this.container.zIndex =
        this.axisPoint?.axisX + this.axisPoint?.axisY + 999;
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

export default Builder;
