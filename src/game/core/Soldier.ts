import { Sprite, Texture, InteractionEvent, InteractionData, Point } from 'pixi.js';
import Combat from './Combat';
import Chequer, { stateType } from './Chequer'
import AxisPoint from './AxisPoint';
// import { onDragEnd, onDragMove, onDragStart } from './utils';

interface SoldierOptions {
  textureRes: string;
  x: number;
  y: number;
  chequer?: Chequer
}
class Soldier extends Combat {

  constructor(options: SoldierOptions) {
    super();
    this.init(options)
  }

  type = 0; // 什么类型的士兵

  startPoint = new Point();

  chequer?: Chequer;

  init({ textureRes, x, y, chequer }: SoldierOptions) {

    this.chequer = chequer;
    
    this.chequer?.setState(stateType.DISABLE);

    this.displaySprite.texture = Texture.from(textureRes);
    this.displaySprite.anchor.set(0.5);
    this.container.x = x;
    this.container.y = y;
    this.displaySprite.width = 60;
    this.displaySprite.height = 60;
    
    this.startPoint.set(x, y);
    
    this.container.addChild(this.displaySprite);

    this.container.buttonMode = true;
    this.container.interactive = true;

    this.container
      .on('pointerdown', (e) => this.onDragStart(e))
      .on('pointerup', () => this.onDragEnd())
      .on('pointerupoutside', () => {
        this.onDragEnd();
        this.resetPosition();
      })
      .on('pointermove', () => this.onDragMove());
  }

  private dragData: InteractionData = new InteractionData();

  dragging = false;

  resetPosition() {
    const { x, y } = this.startPoint;

    this.container.position.set(x, y);
  }

  setPosition(point: AxisPoint) {
    this.container.position.set(point.x, point.y);
    this.startPoint.set(point.x, point.y);
    this.chequer?.setState(stateType.PREVIEW);

    this.chequer = point.chequer;
    this.chequer?.setState(stateType.DISABLE);

  }

  onDragStart(event: InteractionEvent) {
    this.dragData = event.data;
    this.container.alpha = 0.5;
    this.container.filters = [];
    this.dragging = true;
    this.chequer?.setState(stateType.ACTIVE);
  }

  onDragEnd() {
    this.container.alpha = 1;
    this.container.filters = [];
    this.dragging = false;
    this.chequer?.setState(stateType.DISABLE);
  }

  onDragMove() {
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
