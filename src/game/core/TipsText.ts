import { Text } from '@pixi/text';
import AxisPoint from './AxisPoint';

enum TipsTextType {
  NORMAL, // 普通
  CRIT, // 暴击
}

interface Options {
  type: TipsTextType;
}

class TipsText extends EventTarget {
  constructor(text: string, options?: Options) {
    super();
    this.text = new Text(text, { fill: [0xffffff] });
  }

  text: Text;

  show(axisPoint: AxisPoint) {
    this.text.anchor.set(0.5, 0.5);
    this.text.position.set(axisPoint.x, axisPoint.y - 50);
    axisPoint.chequer.bunny.parent.addChild(this.text);
    this.animation();
  }

  animation() {
    this.text.position.y -= 1;
    this.text.alpha -= 0.05;
    if (this.text.alpha <= 0.1) {
      // TODO: 移除。。。
      return;
    }
    requestAnimationFrame(() => {
      this.animation();
    });
  }
}

export default TipsText;
