import { variants, scales } from './types';

// FIXME: 当前尺寸不对 我懒 没有一个一个找尺寸 希望遇到个有缘人补充一下
export const scaleVariants = {
  [scales.LD]: {
    height: 293,
    width: 293,
    sWidth: 230,
    sHeight: 230,
    rWidth: 230,
    rHeight: 230,
  },
  [scales.XL]: {
    height: 230,
    width: 230,
    sWidth: 180,
    sHeight: 180,
    rWidth: 180,
    rHeight: 180,
  },
  [scales.MD]: {
    height: 165,
    width: 165,
    sWidth: 119,
    sHeight: 119,
    rWidth: 119,
    rHeight: 119,
  },
  [scales.SM]: {
    height: 118,
    width: 118,
    sWidth: 80,
    sHeight: 80,
    rWidth: 80,
    rHeight: 80,
  },
  [scales.XS]: {
    height: 106,
    width: 106,
    sWidth: 66,
    sHeight: 66,
    rWidth: 66,
    rHeight: 66,
  },
};

export const styleVariants = {
  [variants.SQUARE]: {
    // background: "url(/images/commons/bg-card/big.png)",
    borderRadius: '10px',
  },
  [variants.RING]: {
    // background: "url(/images/commons/bg-card/full.png)",
    borderRadius: '50%',
  },
  [variants.NONE]: {
    border: 'none',
  },
};
