import { Sprite } from '@pixi/sprite';
import { InteractionEvent, InteractionData } from '@pixi/interaction';
import { Point } from '@pixi/math';
import { Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import Chequer, { StateType, stateType } from './Chequer';
import AxisPoint from './AxisPoint';
import Matrix4 from './Matrix4';

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
    const { src, id, race = 1, areaX, areaY, enableDrag, isBuilding, builded } = option;
    this.id = id;

    const img = `${window.location.origin}/assets/buildings/${race}/${src ? src?.substring(src?.lastIndexOf('/') + 1) : '36.jpg'
      }`;

    this.src = img;
    this.areaY = areaY;
    this.areaX = areaX;
    this.texture = Texture.from(img);

    this.enableDrag = Boolean(enableDrag);

    this.setIsBuilding(Boolean(isBuilding));
    this.setIsBuilded(Boolean(builded));

    this.option = { ...option };

    this.init();
  }

  areaY = 1;

  areaX = 1;

  sprite: Sprite = new Sprite();

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

  setEnableDrag(enableDrag: boolean) {
    this.enableDrag = enableDrag;
    // this.container.buttonMode = enableDrag;
    // this.container.interactive = enableDrag;
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
    if (isBuilding) {
      this.container.alpha = 0.5;
      this.enableDrag = false;
    } else {
      this.container.alpha = 1;
    }
  }

  setIsBuilded(builded: boolean) {
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
