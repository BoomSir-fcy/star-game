import { Application, Texture, Sprite, TilingSprite } from 'pixi.js';
// import { Stage, Layer, Group } from '@pixi/layers'
import config from 'game/config';

// const W = 800;
// const H = 600;
// const resolution = 1;
// const WIDTH = W / resolution;
// const HEIGHT = H / resolution;

// const app = new PIXI.Application({ width: WIDTH, height: HEIGHT, resolution });
// // document.body.appendChild(app.view);

// const stage = new Stage();
// app.stage = stage;


interface BoardOptions {
  src: string; // 精灵的资源地址
}
class Board {
  
  constructor(option: BoardOptions) {
    this.init(option);
  }

  src = '';

  bunny: Sprite = new Sprite();

  init({ src }: BoardOptions) {
    this.src = src;

    const texture = Texture.from(src);

    this.bunny = new Sprite(texture);
    this.bunny.anchor.set(0.5);
    this.bunny.x = 0;
    this.bunny.y = 0;

    // this.bunny.width = 50;
    // this.bunny.height = 50;

    // this.bunny.rotation = Math.PI

    // this.bunny
    // this.gameLoop()

  }

  gameLoop() {

    requestAnimationFrame(() => {
      this.gameLoop()
    });
  
    this.bunny.x += 1;
  }
  
}

export default Board;
