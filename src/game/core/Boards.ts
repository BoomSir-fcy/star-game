import { Application, Renderer, Graphics, Texture, Sprite, Point, ObservablePoint, InteractionEvent, Container } from 'pixi.js';
import { Sprite2d, Container2d, TRANSFORM_STEP, AFFINE }  from 'pixi-projection'
import { EventSystem } from '@pixi/events'
// import { EventSystem } from '@pixi/events';
// import { Stage, Layer, Group } from '@pixi/layers'
import config from 'game/config';
import Chequer from './Chequer';
import Soldier from './Soldier';
import Select from './Select';

/* eslint-disable no-param-reassign */

delete Renderer.__plugins.interaction;

class Boards {
  constructor() {
    this.init();
  }

  app: Application = new Application({ width: config.WIDTH, height: config.HEIGHT, resolution: config.resolution, antialias: true, backgroundAlpha: 0.5  });

  squares: Sprite[] = [];

  chequers: Chequer[] = [];

  containerSprite: Container = new Container();

  bunny = null;

  scale = 1;

  private axis: [number, number][][] = [];

  created = false;

  init() {

    // this.containerSprite.width = 200;
    // this.containerSprite.height = 200;
    // this.containerSprite.anchor.set(0.5);

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

    this.renderSelect();

    for(let i = 0; i < 1; i++) {
      const x = Math.floor(Math.random() * 8);
      const y = Math.floor(Math.random() * 8);
      const res = Math.floor(Math.random() * 7);
      const soldier = this.createSoldier(x, y, `/assets/soldier/rt_object_0${res + 1}.png`);
      if (x>y) {
        soldier.attacking = true;
        soldier.run()
      }

      // setTimeout(() => {
      //   soldier.stop()
      // }, 2000)
    }

  }

  onHandleWheel(e: any) {
    const { deltaY } = e;
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
    this.chequers.forEach((s) => {
      const createGraphic = s.createGraphics();
      this.containerSprite.addChild(createGraphic);
      if (!this.axis[s.axisX]) {
        this.axis[s.axisX] = [];
      }
      this.axis[s.axisX][s.axisY] = [createGraphic.x, createGraphic.y + 30];
    });
    
    this.created = true;
  }

  getAxis(x: number, y: number) {
    try {
      if (this.created) {
        return this.axis[x][y];
      }
      console.error('Get axis is error, place wite some time of this created');
      return [0, 0]
    } catch (error) {
      console.error('Get axis is error, place wite some time of this created');
      return [0, 0]
    }

  }

  createSoldier(_x: number, _y: number, src: string) {
    const [x, y] = this.getAxis(_x, _y)
    const soldier  = new Soldier({ x, y, textureRes: src});

    this.containerSprite.addChild(soldier.container);
    soldier.renderPh()
    return soldier;
  }

  renderSelect() {
    const select = new Select();
    select.container.x = this.app.screen.width - 401;
    select.container.y = this.app.screen.height - 201;

    const soldier  = new Soldier({ x: -100, y: -100, textureRes: '/assets/soldier/rt_object_01.png'});
    const soldier1  = new Soldier({ x: 100, y: 100, textureRes: '/assets/soldier/rt_object_02.png'});
    select.inner.addChild(soldier.container);
    select.inner.addChild(soldier1.container);

    this.app.stage.addChild(select.container);
  }

}

export default Boards;
