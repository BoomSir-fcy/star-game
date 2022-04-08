import { Application, Sprite, Container } from 'pixi.js';
import config from 'game/config';
import Chequer, { stateType } from './Chequer';
import AxisPoint from './AxisPoint';

class Boards extends EventTarget {
  constructor() {
    super();
    this.init();
  }

  app: Application = new Application({ width: config.WIDTH, height: config.HEIGHT, resolution: config.resolution, antialias: true, backgroundAlpha: 0.5  });

  squares: Sprite[] = [];

  chequers: Chequer[] = [];

  container = new Container();

  scale = 1;

  axis: AxisPoint[][] = [];

  created = false;

  init() {

    this.container.position.set(this.app.renderer.screen.width / 2, this.app.renderer.screen.height / 2);

    this.app.stage.addChild(this.container)

    this.drawChequers()

    this.app.stage.hitArea = this.app.renderer.screen;

    this.container.interactive = true;
    this.app.view.addEventListener('wheel', (e) => { this.onHandleWheel(e) });

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

    this.container.scale.set(this.scale);
    e.preventDefault();

  }

  drawChequers() {
    this.chequers = [];
    for(let row = 0; row < config.BOARDS_ROW_COUNT; row ++) {
      for(let col = 0; col < config.BOARDS_COL_COUNT; col ++) {
        const chequer = new Chequer({ type: 'map1', axisX: row, axisY: col, state: stateType.PREVIEW })
        this.chequers.push(chequer);
      }
    }
    this.chequers.forEach((s) => { this.container.addChild(s.bunny); });
    this.chequers.forEach((s) => {
      const createGraphic = s.createGraphics();
      this.container.addChild(createGraphic);
      if (!this.axis[s.axisX]) {
        this.axis[s.axisX] = [];
      }
      this.axis[s.axisX][s.axisY] = new AxisPoint(s.axisX, s.axisY, s);
    });
    
    this.created = true;
  }

}

export default Boards;
