import { Graphics, Sprite, Container, Point } from 'pixi.js';
import config from '../config';
import AxisPoint from './AxisPoint';
import Chequer, { stateType } from './Chequer';

class Combat extends EventTarget {

  x = 0;

  targetX = 0;

  y = 0;

  targetY = 0;

  moving = false;

  attacking = false;

  running = false;

  hp = 0; // 总生命值

  activePh = 0; // 当前生命值

  hpGraphics = new Graphics();

  isEnemy = false;

  displaySprite = new Sprite();

  container = new Container();

  bloodStartY = -20;

  bloodH = 10;

  targetAxisPoint?: AxisPoint;

  startPoint = new Point();

  axisPoint?: AxisPoint;

  speedX = 0;

  speedY = 0;

  moveTime = 500;

  fps = 60;
  
  renderPh() {

    this.hpGraphics.lineStyle(1, 0xFFFFFF, 1);
    this.hpGraphics.drawRect( -(config.BLOOD_WIDTH / 2), this.bloodStartY, config.BLOOD_WIDTH, this.bloodH);
    this.hpGraphics.endFill();

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

  /**
   * 
   * @param axisPoint 目标坐标
   * @param moveTime 移动时间(ms)
   */
  moveTo(axisPoint: AxisPoint, moveTime?: number) {
    const t = (moveTime || this.moveTime) / 1000 * 60;
    
    this.moving = true;
    this.targetAxisPoint = axisPoint;
    axisPoint.chequer.setState(stateType.PREVIEW);
    axisPoint.chequer.displayState(true);
    if (this.axisPoint) {
      this.speedX = (axisPoint.x - this.axisPoint.x) / t;
      this.speedY = (axisPoint.y - this.axisPoint.y) / t;
    }
  }

  handleMove() {
    if (this.moving && this.targetAxisPoint) {

      this.container.position.x += this.speedX;
      this.container.position.y += this.speedY;
      // this.x += this.speedX;
      // this.y += this.speedY;
      if (Math.abs(this.container.position.y - (this.targetAxisPoint.y || 0)) <= 1 && Math.abs(this.container.position.x - (this.targetAxisPoint.x || 0)) <= 1) {
        this.moving = false;
        this.speedX = 0;
        this.speedY = 0;
        this.setPosition(this.targetAxisPoint);
        this.dispatchEvent(new Event('moveEnd'));
      }
    }
  }

  
  resetPosition() {
    const { x, y } = this.startPoint;

    this.container.position.set(x, y);
  }

  setPosition(point: AxisPoint) {
    this.container.position.set(point.x, point.y);
    this.startPoint.set(point.x, point.y);
    this.axisPoint?.chequer?.setState(stateType.PREVIEW);

    this.axisPoint = point;
    this.axisPoint?.chequer?.setState(stateType.DISABLE);
    this.axisPoint?.chequer?.displayState(false);

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
    if (!this.running) {
      this.running = true;
      this.handleRun()
    }
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
