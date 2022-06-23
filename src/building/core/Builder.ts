import { Sprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import Chequer from './Chequer';
import AxisPoint from './AxisPoint';

class Builder extends EventTarget {
  constructor() {
    super();

    this.init();
  }

  areaY = 1;

  areaX = 1;

  sprite: Sprite = new Sprite();

  texture = Texture.from('/assets/buildings/1/14.png');

  container = new Container();

  axisPoint?: AxisPoint;

  init() {
    this.sprite.texture = this.texture;

    this.sprite.width = Chequer.WIDTH;
    this.sprite.height = Chequer.HEIGHT;

    this.container.addChild(this.sprite);
  }

  setPointAsXY(x: number, y: number) {
    const chequer = new Chequer({
      axisX: x,
      axisY: y,
    });

    console.log(chequer);

    this.axisPoint = new AxisPoint(x, y, chequer);
  }
}

export default Builder;
