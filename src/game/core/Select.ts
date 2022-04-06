import { Graphics, Sprite, Container, Texture } from 'pixi.js';

class Select {

  constructor() {
    this.init();
  }

  container = new Sprite(Texture.from('/assets/bg_scene_rotate.jpg'));

  inner = new Sprite(Texture.from('/assets/p2.jpeg'));

  graphics = new Graphics();

  mark = new Graphics();

  init() {
    console.log(this.container);
    // this.container.width = 400;
    // this.container.height = 200;

    // this.container.x = x;

    this.graphics.lineStyle(1, 0xFFFFFF, 1);
    this.graphics.drawRect(0, 0, 400, 200);
    this.graphics.endFill();

    this.container.addChild(this.graphics);

    this.inner.width = this.container.width;
    this.inner.height = this.container.height;

    this.container.addChild(this.inner)

    // this.addMark();

  }

  addMark() {
    this.mark.width = this.inner.width;
    this.mark.height = this.inner.height;
    this.mark.x = 0;
    this.mark.y = 0;
    this.container.addChild(this.mark);
    this.inner.mask = this.mark;
  }
}

export default Select;
