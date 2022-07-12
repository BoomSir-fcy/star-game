import { Sprite } from '@pixi/sprite';
import { InteractionEvent, InteractionData } from '@pixi/interaction';
import { Point, Polygon } from '@pixi/math';
import { FederatedPointerEvent } from '@pixi/events';
import { Texture } from '@pixi/core';
import { Graphics } from '@pixi/graphics';
import { Container } from '@pixi/display';
import Chequer, { StateType, stateType } from './Chequer';
import AxisPoint from './AxisPoint';
import Matrix4 from './Matrix4';
import { getBuilderSpriteRes } from './utils';

export interface BuilderOption {
  src?: string;
  id: string;
  race?: number;
  building: Api.Building.Building;
  areaY: number;
  areaX: number;
  isBuilding?: boolean;
  builded?: boolean;
  enableDrag?: boolean;
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
    } = option;
    this.id = id;

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

  id = '1';

  src = '';

  enableDrag = false;

  isBuilding = false;

  builded = false;

  option: BuilderOption;

  moved = false; // 是否发生移动

  isRemove = false; // 已经移除

  graphics = new Graphics();

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

    this.container.addChild(this.sprite);

    this.setEnableDrag(this.enableDrag);

    this.container.buttonMode = true;
    this.container.interactive = true;

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
    this.cancelSprite.position.set(-20, -10);
    this.cancelSprite.zIndex = 99;
    this.cancelSprite.addListener('click', e => this.onCancel(e));
    this.container.addChild(this.cancelSprite);

    this.confirmSprite.buttonMode = true;
    this.confirmSprite.interactive = true;
    this.confirmSprite.anchor.set(0.5);
    this.confirmSprite.position.set(20, -10);
    this.confirmSprite.zIndex = 99;
    this.confirmSprite.addListener('click', e => this.onConfirm(e));
    this.container.addChild(this.confirmSprite);
  }

  removeHandleBtn() {
    this.container.removeChild(this.cancelSprite);
    this.container.removeChild(this.confirmSprite);
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
    const polygon = new Polygon(path);
    // polygon
    // this.graphics.lineStyle(1, 0xff0000, 0.7);
    // this.graphics.beginFill(0xff0000, 0.2);
    // this.graphics.drawPolygon(polygon);
    // this.graphics.endFill();
    // const { x, y } = this?.matrix4 || this.axisPoint || {};
    // // const { x } = this.bunny;
    // // const y = y - (Chequer.HEIGHT * Chequer.Y_RATIO) / 2;
    // this.graphics.x = 0;
    // this.graphics.y = 0;
    // this.graphics.y = -Chequer.HEIGHT * Chequer.Y_RATIO * (this.areaX - 0.5);

    // console.log(this.graphics.position);

    // this.graphics.interactive = true;

    // this.centerPoint.set(x, y);
    this.container.addChild(this.graphics);

    this.container.hitArea = new Polygon(path);
    return this.graphics;
  }

  setPointAsXY(x: number, y: number) {
    const chequer = new Chequer({
      axisX: x,
      axisY: y,
    });

    const axisPoint = new AxisPoint(x, y, chequer);
    this.setPosition(axisPoint);
  }

  setIsBuilding(isBuilding: boolean) {
    // this.setIsBuilding(!isBuilding)
    this.isBuilding = isBuilding;
    this.removeHandleBtn();
    if (isBuilding) {
      this.container.alpha = 0.5;
      this.enableDrag = false;
    } else {
      this.container.alpha = 1;
    }
  }

  setIsBuilded(builded: boolean) {
    this.removeHandleBtn();
    if (builded) {
      this.setIsBuilding(false);
      this.enableDrag = false;
    }
    this.builded = builded;
  }

  // 设置位置
  setPosition(point: AxisPoint, matrix4?: Matrix4) {
    if (matrix4) {
      this.matrix4 = matrix4;
      this.axisPoint = point;
      this.container.position.set(matrix4.x, matrix4.y);
      this.startPoint.set(matrix4.x, matrix4.y);
      matrix4.setState(stateType.DISABLE);
      matrix4.displayState(false);
    } else {
      this.axisPoint = point;
      this.container.position.set(point.x, point.y);
      this.startPoint.set(point.x, point.y);
      point.chequer?.setState(stateType.DISABLE);
      point.chequer?.displayState(false);
    }
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
    if (this.axisPoint?.axisX && this.axisPoint?.axisY) {
      this.container.zIndex = this.axisPoint?.axisX + this.axisPoint?.axisY;
    }
  }
}

export default Builder;
