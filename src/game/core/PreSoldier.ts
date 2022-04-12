import { Application } from '@pixi/app';
import { InteractionEvent } from '@pixi/interaction';

import config from 'game/config';
import Soldier from './Soldier';

class PreSoldier extends EventTarget {
  constructor(src: string, id: number, width = 122, height = 122) {
    super();
    this.init(src, id, width, height);
  }

  app: Application = new Application({
    resolution: config.resolution,
    antialias: true,
    backgroundAlpha: 0,
  });

  soldier?: Soldier;

  copySoldier?: Soldier;

  init(src: string, id: number, width: number, height: number) {
    this.app.screen.width = width;

    this.app.screen.height = height;

    const soldier = new Soldier({
      x: this.app.renderer.screen.width / 2,
      y: this.app.renderer.screen.height / 2,
      textureRes: src,
      enableDrag: false,
      id,
      unique_id: id,
    });

    this.soldier = soldier;

    this.soldier.container
      .on('pointerdown', (event: InteractionEvent) => {
        this.copySoldier = this?.soldier?.clone();
        this?.soldier?.onDragStart(event);
        this.dispatchEvent(
          new CustomEvent('pointerdown', {
            detail: { soldier: this.copySoldier, event },
          }),
        );
      })
      .on('pointerup', (event: InteractionEvent) => {
        this?.soldier?.onDragEnd();
        this.dispatchEvent(
          new CustomEvent('pointerup', {
            detail: { soldier: this.copySoldier, event },
          }),
        );
      })
      .on('pointerupoutside', (event: InteractionEvent) => {
        this?.soldier?.onDragEnd();
        this.dispatchEvent(
          new CustomEvent('pointerupoutside', {
            detail: { soldier: this.copySoldier, event },
          }),
        );
      })
      .on('pointermove', (event: InteractionEvent) => {
        this.onDragMove();
        this.dispatchEvent(
          new CustomEvent('pointermove', {
            detail: { soldier: this.copySoldier, event },
          }),
        );
      });

    this.app.stage.addChild(soldier.container);
  }

  onDragMove() {
    if (this.soldier?.dragging && this.copySoldier) {
      // const aa = this.soldier.container;
      const newPosition = this.copySoldier.dragData?.getLocalPosition(
        this.soldier.container.parent,
      );
      if (newPosition) {
        this.copySoldier.container.x = newPosition.x;
        this.copySoldier.container.y = newPosition.y;
      }
    }
  }
}

export default PreSoldier;
