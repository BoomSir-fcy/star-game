import { Application, Renderer, Graphics, Texture, Sprite, Point, ObservablePoint, InteractionEvent, Container } from 'pixi.js';
import { Sprite2d, Container2d, TRANSFORM_STEP, AFFINE }  from 'pixi-projection'
import { EventSystem } from '@pixi/events'
// import { EventSystem } from '@pixi/events';
// import { Stage, Layer, Group } from '@pixi/layers'
import config from 'game/config';
import Chequer, { stateType } from './Chequer';
import Soldier from './Soldier';
import Select from './Select';
import createBunny from './Test';
import { checkPolygonPoint, hitTestPoint } from './utils';
import AxisPoint from './AxisPoint';



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

  private axis: AxisPoint[][] = [];

  created = false;

  enableDrag = true;

  init() {

    // this.containerSprite.width = 200;
    // this.containerSprite.height = 200;
    // this.containerSprite.anchor.set(0.5);

    this.containerSprite.position.set(this.app.renderer.screen.width / 2, this.app.renderer.screen.height / 2);
    // this.containerSprite.scale.set(20);

    this.app.stage.addChild(this.containerSprite)

    this.drawChequers()

    this.app.stage.hitArea = this.app.renderer.screen;

    // if (!('events' in this.app.renderer)) {
    //   this.app.renderer.addSystem(EventSystem, 'events');
    // }

    this.containerSprite.interactive = true;
    this.app.view.addEventListener('wheel', (e) => { this.onHandleWheel(e) });

    // this.renderSelect();

    for(let i = 0; i < 5; i++) {
      const x = Math.floor(Math.random() * 8);
      const y = Math.floor(Math.random() * 8);
      const res = Math.floor(Math.random() * 7);
      const soldier = this.createSoldier(x, y, `/assets/soldier/rt_object_0${res + 1}.png`);
      if (soldier && x>y) {
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
        const chequer = new Chequer({ type: 'map1', axisX: row, axisY: col, state: Math.random() > 0.5 ? stateType.DISABLE : stateType.PREVIEW })
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
      this.axis[s.axisX][s.axisY] = new AxisPoint(s.axisX, s.axisY, s);
    });
    
    this.created = true;
  }

  getAxis(x: number, y: number) {
    try {
      if (this.created) {
        return this.axis[x][y];
      }
      console.error('Get axis is error, place wite some time of this created');
      return null
    } catch (error) {
      console.error('Get axis is error, place wite some time of this created');
      return null
    }

  }

  createSoldier(_x: number, _y: number, src: string) {
    const axis = this.getAxis(_x, _y);
    if (!axis) return null;
    const soldier  = new Soldier({ x: axis.x, y: axis.y, chequer: axis.chequer ,textureRes: src});

    this.containerSprite.addChild(soldier.container);
    soldier.renderPh();
    
    soldier.container.on('pointerdown', () => {
      console.log(121212)
      this.chequers.forEach(item => {
        item.displayState(true);
      })
    }).on('pointerup', (event) => {
      // console.log(event);
      // const collection = this.chequers[0].checkCollisionPoint(event.data.global);
      // console.log(collection);
      let canDrag = false;

      this.chequers.forEach(item => {
        const collection = item.checkCollisionPoint(event.data.global);
        if (collection && item.state === stateType.PREVIEW) {
          // soldier.container.position.set(item.axisX, item.axisY);
          // console.log(item)
          soldier.setPosition(new AxisPoint(item.centerPoint.x, item.centerPoint.y, item));
          canDrag = true;
        }
        item.displayState(false);
      })
      if (!canDrag) {
        soldier.resetPosition();
      }
    })

    return soldier;
  }



  renderSelect() {
    const select = new Select();
    select.container.x = this.app.screen.width - 401;
    select.container.y = this.app.screen.height - 201;

    const soldier  = new Soldier({ x: -100, y: -100, textureRes: '/assets/soldier/rt_object_01.png'});
    const soldier1  = new Soldier({ x: 50, y: 20, textureRes: '/assets/soldier/rt_object_02.png'});
    const soldier2  = new Soldier({ x: 200, y: 200, textureRes: '/assets/soldier/rt_object_03.png'});
    const soldier3  = new Soldier({ x: 300, y: 150, textureRes: '/assets/soldier/rt_object_04.png'});
    select.inner.addChild(soldier.container);
    select.inner.addChild(soldier1.container);
    select.inner.addChild(soldier2.container);
    select.inner.addChild(soldier3.container);

    this.app.stage.addChild(select.container);
  }

}

export default Boards;
