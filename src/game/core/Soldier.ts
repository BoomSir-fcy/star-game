import { Sprite, Texture, InteractionEvent, InteractionData, Point } from 'pixi.js';
import Combat from './Combat';
import Chequer, { stateType } from './Chequer'
import AxisPoint from './AxisPoint';
// import { onDragEnd, onDragMove, onDragStart } from './utils';

export interface AttrSoldierOptions {
  textureRes: string;
  id: number;
  hp?: number;
  isEnemy?: boolean;
}
export interface SoldierOptions extends AttrSoldierOptions {
  x: number;
  y: number;
  axisPoint?: AxisPoint
  enableDrag?: boolean
}
class Soldier extends Combat {

  constructor(options: SoldierOptions) {
    super();
    this.init(options)
  }

  type = 0; // 什么类型的士兵

  startPoint = new Point();

  textureRes = '';

  enableDrag = true;

  id = 0;

  init({ textureRes, x, y, axisPoint, enableDrag = true, id, isEnemy = false, hp = 0 }: SoldierOptions) {

    this.id = id;

    this.isEnemy = isEnemy;

    this.axisPoint = axisPoint;
    
    this.axisPoint?.chequer?.setState(stateType.DISABLE);

    this.textureRes = textureRes;
    this.displaySprite.texture = Texture.from(textureRes);
    this.displaySprite.anchor.set(0.5);
    this.container.x = x;
    this.container.y = y;
    this.displaySprite.width = 60;
    this.displaySprite.height = 60;
    
    this.startPoint.set(x, y);
    
    this.container.addChild(this.displaySprite);

    this.hp = hp;
    if (hp) {
      this.renderPh();
    }

    this.container.buttonMode = true;
    this.container.interactive = true;

    this.enableDrag = Boolean(enableDrag);

    if (this.enableDrag) {
      this.container
        .on('pointerdown', (e) => this.onDragStart(e))
        .on('pointerup', () => this.onDragEnd())
        .on('pointerupoutside', () => {
          this.onDragEnd();
          this.resetPosition();
        })
        .on('pointermove', () => this.onDragMove());
    }

  }

  clone(option?: Partial<SoldierOptions>) {
    
    const newOptions = {
      ...this,
      ...option,
    }
    const { textureRes, x, y, axisPoint, enableDrag, id } = newOptions;
    
    return new Soldier({ textureRes, x, y, axisPoint, enableDrag, id })
  }

  dragData: InteractionData = new InteractionData();

  dragging = false;

  onDragStart(event: InteractionEvent) {
    this.dragData = event.data;
    this.container.alpha = 0.5;
    this.container.filters = [];
    this.dragging = true;
    this.axisPoint?.chequer?.setState(stateType.ACTIVE);
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

  onDragMove(event?: InteractionEvent) {
    this.dragData = event?.data || this.dragData
    if (this.dragging) {
      const newPosition = this?.dragData?.getLocalPosition(this.container.parent);
      if (newPosition) {
        this.container.x = newPosition.x;
        this.container.y = newPosition.y;
      }
    }
  }

}

export default Soldier;
