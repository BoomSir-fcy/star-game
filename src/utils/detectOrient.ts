import { env } from "process";

const detectOrient = (dom: HTMLElement, mode=false) => {
  /**
   * 强制横屏竖屏处理;
   * @param  {HTMLElement} dom
   * @param  {Boolean} mode 模式，true为强制竖屏, 默认强制横屏
   * config => top 距离屏幕中间的位置
   */
  if (!(dom instanceof HTMLElement)) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`${dom} is not a HTMLElement`);
    }
    console.error(`${dom} is not a HTMLElement`)
  }
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  const wrapper = dom;
  let style = "";
  if(width >= height) { // 竖屏
      if (mode) {
          style += `width: ${height}px;`;// 注意旋转后的宽高切换
          style += `height: ${width}px;`;
          style += "-webkit-transform: rotate(-90deg); transform: rotate(-90deg);";
          // 注意旋转中点的处理
          style += `-webkit-transform-origin: ${height / 2}px ${height / 2}px;`;
          style += `-transform-origin: ${height / 2}px ${height / 2}px;`;
      } else {
          style += "width:100%"; 
          style += "height:100%;";
          style += "-webkit-transform: rotate(0); transform: rotate(0);";
          style += "-webkit-transform-origin: 0 0;";
          style += "transform-origin: 0 0;";
      }
  } else if (mode) { // 横屏
      style += "width:100%"; 
      style += "height:100%;";
      style += "-webkit-transform: rotate(0); transform: rotate(0);";
      style += "-webkit-transform-origin: 0 0;";
      style += "transform-origin: 0 0;";
  } else {
      style += `width: ${height}px;`;// 注意旋转后的宽高切换
      style += `height: ${width}px;`;
      style += "-webkit-transform: rotate(90deg); transform: rotate(90deg);";
      // 注意旋转中点的处理
      style += `-webkit-transform-origin: ${width / 2}px ${width / 2}px;`;
      style += `-transform-origin: ${width / 2}px ${width / 2}px;`;
  }
  wrapper.style.cssText = style;
  
}

export default detectOrient;
