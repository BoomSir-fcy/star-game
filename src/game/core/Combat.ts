import { Graphics, Sprite, Container } from 'pixi.js';
import config from '../config';

class Combat {

  x = 0;

  targetX = 0;

  y = 0;

  targetY = 0;

  moving = false;

  attacking = true;

  running = false;

  hp = 800; // 总生命值

  activePh = 230; // 当前生命值

  hpGraphics = new Graphics();

  isEnemy = false;

  displaySprite = new Sprite();

  container = new Container();

  bloodStartY = -20;

  bloodH = 10;
  
  renderPh() {
    // 每格表示XXX的血量
    // 友军的血用绿色表示
    // 敌军的血用红色表示

    // this.hpGraphics.beginFill(0xFFFFFF);
    this.hpGraphics.lineStyle(1, 0xFFFFFF, 1);
    this.hpGraphics.drawRect( -(config.BLOOD_WIDTH / 2), this.bloodStartY, config.BLOOD_WIDTH, this.bloodH);
    this.hpGraphics.endFill();

    // this.hpGraphics.beginFill(config.BLOOD_COLOR);
    // this.hpGraphics.lineStyle(10, 0xFF0000, 0.8);
    // this.hpGraphics.beginFill(0xFF700B, 1);
    // this.hpGraphics.moveTo(-30, -20);
    // this.hpGraphics.lineTo(30, -20);
    // this.hpGraphics.endFill();
    this.container.addChild(this.hpGraphics);

    this.drawHp()
  }

  drawHp() {
    const lineX = this.bloodH - 2;
    const lineStartX = -(config.BLOOD_WIDTH / 2) + 1;
    const lineH = (lineX) / 2 + 1;
    const lineY = this.bloodStartY + lineH

    this.hpGraphics.lineStyle(lineX, this.isEnemy ? config.BLOOD_COLOR_ENEMY : config.BLOOD_COLOR, 0.8);
    this.hpGraphics.moveTo(lineStartX, lineY)
    this.hpGraphics.lineTo( this.activePh / this.hp * (config.BLOOD_WIDTH - 2) + lineStartX, lineY)
  }

  move(x: number, y: number) {
    this.moving = true;
    this.targetX = x;
    this.targetY = y;

  }

  handleMove() {
    if (this.moving) {
      if (this.targetX !== this.x) {
        // move x
      }
      if (this.targetY !== this.y) {
        // move y
      }
    }
  }

  attack() {
    this.attacking = true
  }

  handleAttack() {
    if (this.attacking) {
      // 攻击
      this.displaySprite.rotation += 0.1;
    }
  }

  run() {
    this.running = true;
    this.handleRun()
  }

  stop() {
    this.running = false;
  }

  handleRun() {
    if (this.running) {
      this.handleMove();
      this.handleAttack();
      requestAnimationFrame(() => this.handleRun())
    }
  }


}

export default Combat;
