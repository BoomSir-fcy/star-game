type AttrData = { attr: string; value: number }[];

interface Options {
  width: number;
  height: number;
  data: AttrData;
  colorPolygon?: string;
  colorText?: string;
  fillColor?: string;
}

/**
 * 雷达图
 */
class RadarChart {
  constructor(options: Options) {
    this.init(options);
  }

  ctx: CanvasRenderingContext2D | null = null;

  count = 8; // 属性数量

  centerX = 0; // x轴中心

  radius = 0; //

  angle = 0; // 角度

  colorPolygon = '#000000';

  data: AttrData = []; // 属性数据

  colorText = '#000000';

  fillColor = 'rgba(255, 0, 0, 0.5)';

  canvas = document.createElement('canvas');

  offsetAngle = Math.PI / 2;

  init(options: Options) {
    const { width, height, data, colorText, colorPolygon, fillColor } = {
      ...options,
    };
    this.canvas.width = width;
    this.canvas.height = height;

    this.ctx = this.canvas.getContext('2d');

    if (colorText) {
      this.colorText = colorText;
    }
    if (colorPolygon) {
      this.colorPolygon = colorPolygon;
    }
    if (fillColor) {
      this.fillColor = fillColor;
    }
    this.data = data;
    this.count = data.length;
    this.centerX = width / 2;
    this.radius = this.centerX - 28;
    this.angle = (Math.PI * 2) / this.count;

    this.draw();
  }
  // （最高等级的兵种的属性值）当前兵种属性值/最大兵种属性值 0 - 1

  draw() {
    this.drawPolygon(); // 绘制多边形
    this.drawLines(); // 绘制直线
    this.drawText(); // 绘制文本
    this.drawRegion(); // 绘制覆盖区域
  }

  // 绘制六边形
  drawPolygon() {
    if (this.ctx) {
      this.ctx.save(); // save the default state
      this.ctx.strokeStyle = this.colorPolygon;
      const rangCount = 4;
      const r = this.radius / rangCount;
      for (let i = 0; i < rangCount; i++) {
        this.ctx.beginPath(); // 开始路径
        const currR = r * (rangCount - i);
        for (let j = 0; j < this.count; j++) {
          const x =
            this.centerX + currR * Math.cos(this.angle * j + this.offsetAngle);
          const y =
            this.centerX + currR * Math.sin(this.angle * j + this.offsetAngle);
          this.ctx.lineTo(x, y);
        }
        this.ctx.closePath(); // 闭合路径
        this.ctx.stroke(); // restore to the default state
      }
      this.ctx.restore();
    }
  }

  // 绘制线
  drawLines() {
    if (this.ctx) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.colorPolygon;
      for (let i = 0; i < this.count; i++) {
        const x =
          this.centerX +
          this.radius * Math.cos(this.angle * i + this.offsetAngle);
        const y =
          this.centerX +
          this.radius * Math.sin(this.angle * i + this.offsetAngle);
        this.ctx.moveTo(this.centerX, this.centerX);
        this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  // 绘制文字
  drawText() {
    if (this.ctx) {
      this.ctx.save();
      const fontSize = this.centerX / 12;
      this.ctx.font = `14px Microsoft Yahei`;
      this.ctx.fillStyle = this.colorText;
      for (let i = 0; i < this.count; i++) {
        const x =
          this.centerX +
          this.radius * Math.cos(this.angle * i + this.offsetAngle);
        const y =
          this.centerX +
          this.radius * Math.sin(this.angle * i + this.offsetAngle);
        // 通过不同的位置，调整文本的显示位置
        if (
          this.angle * i + this.offsetAngle >= 0 &&
          this.angle * i + this.offsetAngle <= Math.PI / 2
        ) {
          this.ctx.fillText(this.data[i].attr, x, y + fontSize);
        } else if (
          this.angle * i + this.offsetAngle > Math.PI / 2 &&
          this.angle * i + this.offsetAngle <= Math.PI
        ) {
          this.ctx.fillText(
            this.data[i].attr,
            x - this.ctx.measureText(this.data[i].attr).width,
            y + fontSize,
          );
        } else if (
          this.angle * i + this.offsetAngle > Math.PI &&
          this.angle * i + this.offsetAngle <= (Math.PI * 3) / 2
        ) {
          this.ctx.fillText(
            this.data[i].attr,
            x - this.ctx.measureText(this.data[i].attr).width,
            y,
          );
        } else {
          this.ctx.fillText(this.data[i].attr, x, y);
        }
      }
      this.ctx.restore();
    }
  }

  // 绘制覆盖区域(技能系数)
  drawRegion() {
    if (this.ctx) {
      this.ctx.save();
      this.ctx.beginPath();
      for (let i = 0; i < this.count; i++) {
        const x =
          this.centerX +
          (this.radius *
            Math.cos(this.angle * i + this.offsetAngle) *
            this.data[i].value) /
            100;
        const y =
          this.centerX +
          (this.radius *
            Math.sin(this.angle * i + this.offsetAngle) *
            this.data[i].value) /
            100;
        this.ctx.lineTo(x, y);
      }
      this.ctx.closePath();
      this.ctx.fillStyle = this.fillColor;
      this.ctx.fill();
      this.ctx.stroke();
    }
  }

  updateDate(data: AttrData) {
    this.data = data;
    this.draw();
  }
}

export default RadarChart;
