// import {
//   Application,
//   Sprite,
//   Container,
//   Loader,
//   InteractionData,
//   InteractionEvent,
// } from '@pixi/core';
import { Application } from '@pixi/app';
import { Sprite } from '@pixi/sprite';
import { Container } from '@pixi/display';
import { Loader } from '@pixi/loaders';
import { InteractionEvent, InteractionData } from '@pixi/interaction';

import config from 'game/config';
import Chequer, { stateType } from './Chequer';
import AxisPoint from './AxisPoint';

interface BoardsProps {
  width?: number;
  height?: number;
}
class Boards extends EventTarget {
  constructor(options?: BoardsProps) {
    super();
    // this.aaa = 1;
    const { width, height } = options || {};

    this.width = width || config.WIDTH;
    this.height = height || config.HEIGHT;

    this.app = new Application({
      width: this.width,
      height: this.height,
      resolution: config.resolution,
      antialias: true,
      backgroundAlpha: 0.5,
    });
    this.init();
  }

  app: Application;

  width;

  height;

  squares: Sprite[] = [];

  chequers: Chequer[] = [];

  container = new Container();

  scale = 1;

  axis: AxisPoint[][] = [];

  created = false;

  dragData: InteractionData = new InteractionData();

  dragging = false;

  init() {
    this.app.loader = new Loader();

    this.container.position.set(
      this.app.renderer.screen.width / 2,
      this.app.renderer.screen.height / 2,
    );

    this.app.stage.addChild(this.container);

    this.drawChequers();

    this.app.stage.hitArea = this.app.renderer.screen;

    this.container.interactive = true;
    this.app.view.addEventListener('wheel', e => {
      this.onHandleWheel(e);
    });

    this.container
      .on('pointerdown', e => this.onDragStart(e))
      .on('pointerup', () => this.onDragEnd())
      .on('pointerupoutside', () => {
        this.onDragEnd();
      })
      .on('pointermove', () => this.onDragMove());
  }

  onHandleWheel(e: any) {
    const { deltaY } = e;
    const down = deltaY > 0;

    this.scale = down
      ? this.scale - config.SCALE_BASE
      : this.scale + config.SCALE_BASE;
    if (this.scale > config.MAX_SCALE) {
      this.scale = config.MAX_SCALE;
    } else if (this.scale < config.MIN_SCALE) {
      this.scale = config.MIN_SCALE;
    }

    this.container.scale.set(this.scale);
    e.preventDefault();
  }

  drawChequers() {
    this.chequers = [];
    for (let row = 0; row < config.BOARDS_ROW_COUNT; row++) {
      for (let col = 0; col < config.BOARDS_COL_COUNT; col++) {
        const chequer = new Chequer({
          type: 'map1',
          axisX: row,
          axisY: col,
          state: stateType.PREVIEW,
        });
        this.chequers.push(chequer);
      }
    }
    this.chequers.forEach(s => {
      this.container.addChild(s.bunny);
    });
    this.chequers.forEach(s => {
      const createGraphic = s.createGraphics();
      this.container.addChild(createGraphic);
      if (!this.axis[s.axisX]) {
        this.axis[s.axisX] = [];
      }
      this.axis[s.axisX][s.axisY] = new AxisPoint(s.axisX, s.axisY, s);
    });

    this.created = true;
  }

  onDragStart(event: InteractionEvent) {
    this.dragData = event.data;
    this.dragging = true;
  }

  onDragEnd() {
    this.dragging = false;
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

export default Boards;
