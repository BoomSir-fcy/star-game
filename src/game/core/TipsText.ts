import { ITextStyle, Text, TextStyle } from '@pixi/text';
import AxisPoint from './AxisPoint';
import { TipsTextType } from '../types';
import { getTipsColorByType } from './utils';

interface Options {
  type: TipsTextType;
}

const defaultOptions = {
  type: TipsTextType.NORMAL,
};

class TipsText extends EventTarget {
  constructor(text: string, options?: Options) {
    super();
    const option = {
      ...defaultOptions,
      ...options,
    };

    this.type = option.type;
    // const color = getTipsColorByType(option.type);
    const style = TipsText.getTextStyle(this.type);
    this.text = new Text(text, style);
  }

  type;

  text: Text;

  scale = 1;

  alpha = 1;

  show(axisPoint: AxisPoint) {
    this.text.zIndex = 999;
    this.text.anchor.set(0.5, 0.5);
    this.text.position.set(axisPoint.x, axisPoint.y);
    axisPoint.chequer.bunny.parent.addChild(this.text);
    this.animation();
  }

  animation() {
    this.scale -= 0.01;
    this.alpha -= 0.05;

    if (this.alpha <= 0.1) {
      this.text.parent.removeChild(this.text);
      return;
    }
    if (this.type === TipsTextType.NORMAL) {
      this.scale -= 0.01;
      this.text.alpha = this.alpha;
      this.text.position.y -= 2;
      this.text.scale.set(this.scale);
    } else if (this.type === TipsTextType.CRIT) {
      this.scale += 0.02;
      this.text.alpha = this.alpha;
      this.text.position.y -= 1;
      this.text.scale.set(this.scale);
    } else if (this.type === TipsTextType.RESTORE) {
      this.scale -= 0.01;
      this.text.alpha = this.alpha;
      this.text.position.y -= 1;
      this.text.scale.set(this.scale);
    }
    requestAnimationFrame(() => {
      this.animation();
    });
  }

  static getTextStyle(type: TipsTextType): TextStyle | Partial<ITextStyle> {
    const fill = getTipsColorByType(type);

    if (type === TipsTextType.CRIT) {
      return {
        fill,
        fontSize: 24,
        fontWeight: 'bold',
      };
    }
    if (type === TipsTextType.RESTORE) {
      return {
        fill,
        fontSize: 24,
      };
    }
    return {
      fill,
      fontSize: 22,
    };
  }
}

export default TipsText;
