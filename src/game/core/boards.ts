import { Application } from 'pixi.js';
// import { Stage, Layer, Group } from '@pixi/layers'
import config from 'game/config';
import Board from './board';

// const W = 800;
// const H = 600;
// const resolution = 1;
// const WIDTH = W / resolution;
// const HEIGHT = H / resolution;

// const app = new PIXI.Application({ width: WIDTH, height: HEIGHT, resolution });
// // document.body.appendChild(app.view);

// const stage = new Stage();
// app.stage = stage;



// export default app;

class Test {
  constructor() {
    this.init();
  }

  value = 0;

  init() {
    this.value += 1;
    console.log('初始化')
  }
}


class Boards {
  
  constructor() {
    this.init()
  }

  app: Application = new Application({ width: config.WIDTH, height: config.HEIGHT, resolution: config.resolution, antialias: true  });

  // stage: Stage = new Stage();

  test = new Test();

  init() {
    
    // this.app = new Application({ width: config.WIDTH, height: config.HEIGHT, resolution: config.resolution });
    // this.stage = new Stage();

    // this.app.view
    console.log(this.app)
    this.app.renderer.backgroundColor = 0x061639;

    const board = new Board({ src: '/assets/board/building1.png' })
    this.app.stage.addChild(board.bunny)

    this.app.ticker.add(() => {
      board.bunny.x += 0.1;
    })
    
  }
}

export default Boards;
