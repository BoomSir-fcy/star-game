import { Graphics, Sprite, Container, Texture } from 'pixi.js';

class Select {

  constructor() {
    this.init();
  }

  container = new Container();

  inner = new Container();

  graphics = new Graphics();

  mark =  new Graphics();

  init() {
    console.log(this.container);
    this.container.width = 400;
    this.container.height = 200;

    // this.container.x = x;

    this.graphics.lineStyle(1, 0xFFFFFF, 1);
    this.graphics.drawRect(0, 0, 400, 200);
    this.graphics.endFill();

    this.container.addChild(this.graphics);

    this.inner.width = 300;
    this.inner.height = 150;
    this.container.addChild(this.inner)

    this.addMark();



  }

  addMark() {
    this.mark.width = 100;
    this.mark.height = 50;
    this.mark.x = -50;
    this.mark.y = -20;
    
    this.mark.lineStyle(1, 0xFF0000, 1);
    this.mark.drawRect(0, 0, 100, 50);
    this.mark.endFill();

    this.container.addChild(this.mark);
    // this.inner.mask = this.mark;
  }
}

export default Select;
