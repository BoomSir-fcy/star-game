import { Application, Renderer, Graphics, Texture, Sprite, Point, ObservablePoint, InteractionEvent } from 'pixi.js';
import { Sprite2d, Container2d, TRANSFORM_STEP, AFFINE }  from 'pixi-projection'
import { EventSystem } from '@pixi/events'
// import { EventSystem } from '@pixi/events';
// import { Stage, Layer, Group } from '@pixi/layers'
import config from 'game/config';
import Chequer from './Chequers';

/* eslint-disable no-param-reassign */

delete Renderer.__plugins.interaction;

class Boards {
  constructor() {
    this.init();
  }

  app: Application = new Application({ width: config.WIDTH, height: config.HEIGHT, resolution: config.resolution, antialias: true, backgroundAlpha: 0.5  });

  squares: Sprite[] = [];

  chequers: Chequer[] = [];

  quad: ObservablePoint<any>[] = [];

  containerSprite: Sprite = new Sprite(Texture.from('/assets/p2.jpeg'));

  bunny = null;

  scale = 1;

  init() {

    // this.containerSprite.width = 200;
    // this.containerSprite.height = 200;
    this.containerSprite.anchor.set(0.5);

    this.containerSprite.position.set(this.app.renderer.screen.width / 2, this.app.renderer.screen.height / 2);
    // this.containerSprite.scale.set(20);

    this.app.stage.addChild(this.containerSprite)

    this.drawChequers()

    this.app.stage.hitArea = this.app.renderer.screen;

    if (!('events' in this.app.renderer)) {
      this.app.renderer.addSystem(EventSystem, 'events');
    }

    this.containerSprite.interactive = true;
    this.app.view.addEventListener('wheel', (e) => { this.onHandleWheel(e) });

  }

  onHandleWheel(e: any) {
    const deltaY = e.deltaY;
    const down = deltaY > 0;

    this.scale = down ? this.scale - config.SCALE_BASE : this.scale + config.SCALE_BASE;
    if (this.scale > config.MAX_SCALE) {
      this.scale = config.MAX_SCALE;
    } else if (this.scale < config.MIN_SCALE) {
      this.scale = config.MIN_SCALE;
    }


    this.containerSprite.scale.set(this.scale);
    e.preventDefault();

}

  drawChequers() {
    this.chequers = [];
    for(let row = 0; row < config.BOARDS_ROW_COUNT; row ++) {
      for(let col = 0; col < config.BOARDS_COL_COUNT; col ++) {
        const chequer = new Chequer({ type: 'map1', axisX: row, axisY: col })
        this.chequers.push(chequer);
      }
    }
    this.chequers.forEach((s) => { this.containerSprite.addChild(s.bunny); });
    this.chequers.forEach((s) => { this.containerSprite.addChild(s.createGraphics()) });
  }

}

export default Boards;
