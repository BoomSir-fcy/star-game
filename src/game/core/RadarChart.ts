type AttrData = { attr: string; value: number }[]

interface Options {
  width: number;
  height: number;
  data: AttrData
  colorPolygon?: string;
  colorText?: string;
  fillColor?: string;
}

class RadarChart {
  constructor(options: Options) {
    this.init(options);
  }

  ctx: CanvasRenderingContext2D | null = null;

  count = 6; // 属性数量

  centerX = 0; // x轴中心

  radius = 0; // 

  angle = 0; // 角度

  colorPolygon = '#000000';

  data: AttrData = []; // 属性数据
  
  colorText = '#000000';

  fillColor = 'rgba(255, 0, 0, 0.5)';

  canvas = document.createElement('canvas');

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
    this.radius = this.centerX - 20;
    this.angle = Math.PI * 2 / this.count;

    console.log(this, width, height, data, colorText, colorPolygon, fillColor)

    this.draw();
  }

  draw() {
    this.drawPolygon(); // 绘制多边形
    this.drawLines(); // 绘制直线
    this.drawText(); // 绘制文本
    this.drawRegion(); // 绘制覆盖区域
  }

  drawPolygon() {
    if (this.ctx) {
      this.ctx.save();  // save the default state
      this.ctx.strokeStyle = this.colorPolygon;
      const r = this.radius / this.count;
      for(let i = 0; i < this.count; i++) {
          this.ctx.beginPath();  // 开始路径
          const currR = r * (i + 1);
          for(let j = 0; j < this.count; j++) {
              const x = this.centerX + currR*Math.cos(this.angle*j);
              const y = this.centerX + currR*Math.sin(this.angle*j);
              this.ctx.lineTo(x, y);  
          }
          this.ctx.closePath(); // 闭合路径
          this.ctx.stroke() // restore to the default state
      }
      this.ctx.restore();
    }
  }

  drawLines() {
    if (this.ctx) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.colorPolygon;
      for( let i = 0; i< this.count; i++){
        const x = this.centerX + this.radius * Math.cos(this.angle*i);
        const y = this.centerX + this.radius * Math.sin(this.angle*i);
        this.ctx.moveTo(this.centerX, this.centerX);
        this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  drawText() {
    if (this.ctx) {
      this.ctx.save();
      const fontSize = this.centerX / 12;
      this.ctx.font = `14px Microsoft Yahei`;
      this.ctx.fillStyle = this.colorText;
      for(let i = 0; i< this.count; i++){
        const x = this.centerX + this.radius*Math.cos(this.angle*i);
        const y = this.centerX + this.radius*Math.sin(this.angle*i);
       // 通过不同的位置，调整文本的显示位置
        if( this.angle * i >= 0 && this.angle * i <= Math.PI / 2 ){
                this.ctx.fillText(this.data[i].attr, x, y + fontSize);
            }else if(this.angle * i > Math.PI / 2 && this.angle * i <= Math.PI){
                this.ctx.fillText(this.data[i].attr, x - this.ctx.measureText(this.data[i].attr).width, y + fontSize);
            }else if(this.angle * i > Math.PI && this.angle * i <= Math.PI * 3 / 2){
                this.ctx.fillText(this.data[i].attr, x - this.ctx.measureText(this.data[i].attr).width, y);
            }else{
                this.ctx.fillText(this.data[i].attr, x, y);
            }
      }
      this.ctx.restore();
    }
  }

  drawRegion() {
    if (this.ctx) {
      this.ctx.save();
      this.ctx.beginPath();
      for(let i = 0; i< this.count; i++){
        const x = this.centerX + this.radius*Math.cos(this.angle*i)*this.data[i].value/100;
        const y = this.centerX + this.radius*Math.sin(this.angle*i)*this.data[i].value/100;
        this.ctx.lineTo(x, y);
      }
      this.ctx.closePath();
      this.ctx.fillStyle = this.fillColor
      this.ctx.fill();
      this.ctx.stroke();
    }
  }
}

export default RadarChart;