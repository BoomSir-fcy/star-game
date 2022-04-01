import { events } from '../types';

export class Obj extends EventTarget {

  constructor() {
    super()
    // this.init()
  }
  
  private x = 0;
  private y = 0;

  private moving = false;

  private speed = 1; // 速度 (每秒移动多少格)  

  // private attackPower = 1; // 攻击力
  
  // private attackDistance = 1; // 攻击距离

  setPosition(x: number, y: number) {
    this.moving = false;

    this.x = x;
    this.y = y;

  }

  move(x: number, y: number) {
    // 移动

  }
  
  private hp = 1; // 总生命值
  private activePh = 1; // 当前生命值
  private attacking = false; // 攻击中
  private attackSpeed = 1; // 攻击速度(每秒攻击多少下)

  private living = true; // 是否存活

  attack(other: Obj, value: number) {

    this.dispatchEvent(new Event(events.ATTACK));
    this.attacking = true;

    // const timer = setInterval(() => {

    // }, 1000 / this.attackSpeed * 1000)

    const preHp = other.activePh - value;
    // 攻击
    other.activePh = preHp < 0 ? 0 : preHp;
    if (other.activePh === 0) {
      this.living = false;
      other.dispatchEvent(new Event(events.DEAD))
      this.dispatchEvent(new Event(events.ATTACK_END));
      return ;
    }
    this.dispatchEvent(new Event(events.ATTACK));

    // 攻击动画
    
  }




}