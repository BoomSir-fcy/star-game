interface SkyStarProps {
  width: number;
  height: number;
  maxStars: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

class SkyStar {
  constructor(star: SkyStarProps) {
    this.canvas = star.canvas;
    this.ctx = star.ctx;
    this.orbitRadius = SkyStar.randomM(
      SkyStar.maxOrbit(star.width, star.height),
    );
    this.radius = SkyStar.randomM(60, this.orbitRadius) / 8;
    // 星星大小
    this.orbitX = star.width / 2;
    this.orbitY = star.height / 2;
    this.timePassed = SkyStar.randomM(0, star.maxStars);
    // 星星移动速度
    this.speed = SkyStar.randomM(this.orbitRadius) / 500000;
    this.alpha = SkyStar.randomM(2, 10) / 10;
  }

  canvas: HTMLCanvasElement;

  ctx: CanvasRenderingContext2D;

  orbitRadius: number;

  radius: number;

  orbitX: number;

  orbitY: number;

  timePassed: number;

  speed: number; // //星星移动速度

  alpha: number;

  static randomM(min: number, max?: number) {
    let _min = min;
    let _max = max;
    if (!max) {
      _max = min;
      _min = 0;
    }
    if (min > max) {
      _max = min;
      _min = max;
    }
    return Math.floor(Math.random() * (_max - _min + 1)) + _min;
  }

  // 星星移动范围，值越大范围越小
  static maxOrbit(x: number, y: number) {
    const max = Math.max(x, y);
    const diameter = Math.round(Math.sqrt(max * max + max * max));
    return diameter / 2;
  }

  draw() {
    const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
    const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
    const twinkle = SkyStar.randomM(10);

    if (twinkle === 1 && this.alpha > 0) {
      this.alpha -= 0.05;
    } else if (twinkle === 2 && this.alpha < 1) {
      this.alpha += 0.05;
    }

    this.ctx.globalAlpha = this.alpha;
    this.ctx.drawImage(
      this.canvas,
      x - this.radius / 2,
      y - this.radius / 2,
      this.radius,
      this.radius,
    );
    this.timePassed += this.speed;
  }
}

export default SkyStar;
