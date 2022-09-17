import SkyStar from './SkyStar';

class SkyCanvas {
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.init();
  }

  canvas = null;

  ctx = null;

  w = 1920;

  h = 900;

  hue = 217;

  stars = [];

  maxStars = 1300; // 星星数量

  init() {
    this.setCliebtSize();

    const canvas2 = SkyCanvas.createCanvas2(this.hue);

    // 生成星星
    for (let i = 0; i <= this.maxStars; i++) {
      this.stars.push(
        new SkyStar({
          width: this.w,
          height: this.h,
          maxStars: this.maxStars,
          canvas: canvas2,
          ctx: this.ctx,
        }),
      );
    }
  }

  setCliebtSize() {
    this.w = document.body.clientWidth;
    this.h = document.body.clientHeight;
    if (this.canvas) {
      this.canvas.width = this.w;
      this.canvas.height = this.h;
    }
  }

  static createCanvas2(hue: number) {
    const canvas2 = document.createElement('canvas');
    const ctx2 = canvas2.getContext('2d');
    canvas2.width = 100;
    canvas2.height = 100;
    const half = canvas2.width / 2;
    const gradient2 = ctx2.createRadialGradient(
      half,
      half,
      0,
      half,
      half,
      half,
    );
    gradient2.addColorStop(0.025, '#CCC');
    gradient2.addColorStop(0.1, `hsl(${hue}, 61%, 33%)`);
    gradient2.addColorStop(0.25, `hsl(${hue}, 64%, 6%)`);
    gradient2.addColorStop(1, 'transparent');

    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();

    return canvas2;
  }

  animation() {
    if (this.ctx) {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.globalAlpha = 0.5; // 尾巴
      this.ctx.fillStyle = `hsla(${this.hue}, 64%, 6%, 2)`;
      this.ctx.fillRect(0, 0, this.w, this.h);

      this.ctx.globalCompositeOperation = 'lighter';
      this.stars.forEach(item => {
        item.draw();
      });
      window.requestAnimationFrame(() => this.animation());
    }
  }
}

export default SkyCanvas;
