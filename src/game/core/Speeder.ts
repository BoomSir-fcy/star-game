import { SpeederType } from '../types';

class Speeder {
  base = 1; // 基础速率

  private _soldierMove = 4;

  get [SpeederType.SOLDIER_MOVE](): number {
    return this._soldierMove * this.base;
  }

  private _bulletLinear = 4;

  get [SpeederType.BULLET_LINEAR]() {
    return this._bulletLinear * this.base;
  }

  private _bulletParabola = 60;

  get [SpeederType.BULLET_PARABOLA]() {
    return this._bulletParabola * this.base;
  }

  private _update = 0.016666666666;

  get [SpeederType.UPDATE]() {
    return this._update * this.base;
  }

  private _collision = 10;

  get [SpeederType.COLLECTION]() {
    return this._collision * this.base;
  }

  private _soldierCreated = 20;

  get [SpeederType.SOLDIER_CREATE]() {
    return this._soldierCreated * this.base;
  }
}

const speeder = new Speeder();

export default speeder;
