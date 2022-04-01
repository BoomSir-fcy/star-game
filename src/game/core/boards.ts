/* eslint-disable no-param-reassign */
import { Application, Graphics, Texture, Sprite, Point } from 'pixi.js';
import { Sprite2d, Container2d, TRANSFORM_STEP, AFFINE } from 'pixi-projection';
// import { Stage, Layer, Group } from '@pixi/layers'
import config from 'game/config';
import Board from './board';

class Boards {
  constructor() {
    this.init();
  }

  app: Application = new Application({
    width: config.WIDTH,
    height: config.HEIGHT,
    resolution: config.resolution,
    antialias: true,
  });

  init() {
    // this.app = new Application({ width: config.WIDTH, height: config.HEIGHT, resolution: config.resolution });
    // this.stage = new Stage();

    console.log(this.app);
    this.app.renderer.backgroundColor = 0x061639;

    // const board = new Board({ src: '/assets/board/building1.png' })
    // this.app.stage.addChild(board.bunny)

    // this.app.ticker.add(() => {
    //   board.bunny.x += 0.1;
    // })

    this.drawBoards();
  }

  // 绘制棋盘
  drawBoards() {
    const bigWhiteTexture = new Texture(Texture.WHITE.baseTexture);
    bigWhiteTexture.orig.width = 30;
    bigWhiteTexture.orig.height = 30;

    const squareFar = new Sprite(bigWhiteTexture);
    squareFar.tint = 0xff0000;
    // squareFar.factor = 1;
    squareFar.anchor.set(0.5);
    squareFar.position.set(this.app.screen.width / 2, 50);

    // create a new Sprite from an image path
    const container = new Container2d();
    container.position.set(this.app.screen.width / 2, this.app.screen.height);

    const surface = new Sprite2d(Texture.from('/assets/bg_plane.jpg'));
    surface.anchor.set(0.5, 1.0);
    // surface.scale.y = -1; //sorry, have to do that to make a correct projection
    surface.width = this.app.screen.width;
    surface.height = this.app.screen.height;
    // var squarePlane = new Sprite2d(Texture.from('examples/assets/flowerTop.png'));
    const squarePlane = new Sprite2d(bigWhiteTexture);
    squarePlane.tint = 0xff0000;
    // squarePlane.factor = 1;
    squarePlane.proj.affine = AFFINE.AXIS_X;
    squarePlane.anchor.set(0.5, 0.0);
    squarePlane.position.set(
      -this.app.screen.width / 4,
      -this.app.screen.height / 2,
    );

    const bunny = new Sprite2d(Texture.from('examples/assets/flowerTop.png'));
    bunny.anchor.set(0.5, 1.0);

    this.app.stage.addChild(container);
    this.app.stage.addChild(squareFar);
    container.addChild(surface);
    container.addChild(squarePlane);
    squarePlane.addChild(bunny);

    // Listen for animate update
    this.app.ticker.add(delta => {
      const pos = container.toLocal(
        squareFar.position,
        undefined,
        undefined,
        undefined,
        TRANSFORM_STEP.BEFORE_PROJ,
      );
      // need to invert this thing, otherwise we'll have to use scale.y=-1 which is not good
      pos.y = -pos.y;
      pos.x = -pos.x;
      // container.proj.setAxisY(pos, -squareFar.factor);

      // squarePlane.proj.affine = squarePlane.factor
      //     ? AFFINE.AXIS_X : AFFINE.NONE;
      squarePlane.rotation += 0.1;
    });

    addInteraction(squareFar);
    addInteraction(squarePlane);
    // move the bunny too!
    addInteraction(bunny);

    // === CLICKS AND SNAP ===

    // changes axis factor
    function toggle(obj: any) {
      if (obj !== bunny) {
        obj.factor = 1.0 - obj.factor;
        obj.tint = obj.factor ? 0xff0033 : 0x00ff00;
      }
    }

    const snap = (obj: any) => {
      if (obj === bunny) {
        obj.position.set(0);
      } else if (obj === squarePlane) {
        // plane bounds
        obj.position.x = Math.min(
          Math.max(obj.position.x, -this.app.screen.width / 2 + 10),
          this.app.screen.width / 2 - 10,
        );
        obj.position.y = Math.min(
          Math.max(obj.position.y, -this.app.screen.height + 10),
          10,
        );
      } else {
        // far
        obj.position.x = Math.min(
          Math.max(obj.position.x, 0),
          this.app.screen.width,
        );
        obj.position.y = Math.min(
          Math.max(obj.position.y, 0),
          this.app.screen.height,
        );
      }
    };

    // === INTERACTION CODE  ===

    function addInteraction(obj: any) {
      obj.interactive = true;
      obj
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
    }

    function onDragStart(event: any) {
      const obj = event.currentTarget;
      obj.dragData = event.data;
      obj.dragging = 1;
      obj.dragPointerStart = event.data.getLocalPosition(obj.parent);
      obj.dragObjStart = new Point();
      obj.dragObjStart.copyFrom(obj.position);
      obj.dragGlobalStart = new Point();
      obj.dragGlobalStart.copyFrom(event.data.global);
      event.stopPropagation();
    }

    function onDragEnd(event: any) {
      const obj = event.currentTarget;
      if (!obj.dragging) return;
      if (obj.dragging === 1) {
        toggle(obj);
      } else {
        snap(obj);
      }

      obj.dragging = 0;
      obj.dragData = null;

      event.stopPropagation();
      // set the interaction data to null
    }

    function onDragMove(event: any) {
      const obj = event.currentTarget;
      if (!obj.dragging) return;
      event.stopPropagation();
      const data = obj.dragData; // it can be different pointer!
      if (obj.dragging === 1) {
        // click or drag?
        if (
          Math.abs(data.global.x - obj.dragGlobalStart.x) +
            Math.abs(data.global.y - obj.dragGlobalStart.y) >=
          3
        ) {
          // DRAG
          obj.dragging = 2;
        }
      }
      if (obj.dragging === 2) {
        const dragPointerEnd = data.getLocalPosition(obj.parent);
        // DRAG
        obj.position.set(
          obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x),
          obj.dragObjStart.y + (dragPointerEnd.y - obj.dragPointerStart.y),
        );
      }
    }
  }
}

export default Boards;
