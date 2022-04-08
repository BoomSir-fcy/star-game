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

  private enableDrag = false;

  private dragPreSoldier?: Soldier;

  private dragPreSoldierEvent?: InteractionEvent;

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
    this.containerSprite.on('pointermove', (e) => {
      if (this.enableDrag && this.dragPreSoldier && this.dragPreSoldier.container) {
        // console.log(e, '===')
        this.dragPreSoldier.container.visible = true;
        this.dragPreSoldier.onDragMove(e)
        this.dragPreSoldierEvent = e;
      }
    })
    // this.app.view.addEventListener('mo')
    // this.app.stage.on('point', (e) => {
    //   console.log(e, '===')
    //   // if (this.enableDrag) {
    //   // }
    // })

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

  setEnableDrag(state: boolean) {
    this.enableDrag = state;
  }

  addDragPreSoldier(soldier: Soldier) {
    this.enableDrag = true;
    this.dragPreSoldier = soldier.clone({ enableDrag: true });
    this.dragPreSoldier.setDragging(true);
    this.dragPreSoldier.container.visible = false;
    this.app.stage.addChild(this.dragPreSoldier.container);
    this.onDragStarSoldier()

  }

  offDragPreSoldier() {
    this.enableDrag = false;
    if (this.dragPreSoldier && this.dragPreSoldierEvent) {
      const soldier = this.dragPreSoldier.clone();
      const res = this.onDragEndSolider(this.dragPreSoldierEvent, soldier);
      if (res) {
        this.containerSprite.addChild(soldier.container);
        soldier.renderPh();
      }
      this.dragPreSoldier.setDragging(false);
      this.dragPreSoldier.container.visible = false;
      this.app.stage.removeChild(this.dragPreSoldier.container);
      delete this.dragPreSoldier;
      delete this.dragPreSoldierEvent
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

  onDragStarSoldier() {
    this.chequers.forEach(item => {
      item.displayState(true);
    })
  }

  onDragEndSolider(event: InteractionEvent, soldier: Soldier) {
    let canDrag = false;

    this.chequers.forEach(item => {
      const collection = item.checkCollisionPoint(event.data.global);
      if (collection && item.state === stateType.PREVIEW) {
        soldier.setPosition(new AxisPoint(item.centerPoint.x, item.centerPoint.y, item));
        canDrag = true;
      }
      item.displayState(false);
    })
    if (!canDrag) {
      soldier.resetPosition();
    }
    return canDrag;
  }

  createSoldier(_x: number, _y: number, src: string) {
    const axis = this.getAxis(_x, _y);
    if (!axis) return null;
    const soldier  = new Soldier({ x: axis.x, y: axis.y, chequer: axis.chequer ,textureRes: src});

    this.containerSprite.addChild(soldier.container);
    soldier.renderPh();
    
    soldier.container.on('pointerdown', () => {
      this.onDragStarSoldier()
    }).on('pointerup', (event) => {
      this.onDragEndSolider(event, soldier)
    })

    return soldier;
  }

}

export default Boards;
