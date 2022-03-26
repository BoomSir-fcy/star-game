import { variants, scales } from './types';

// FIXME: 当前尺寸不对 我懒 没有一个一个找尺寸 希望遇到个有缘人补充一下
export const scaleVariants = {
  [scales.LD]: {
    height: '293px',
    width: '293px',
    sWidth: '230px',
    sHeight: '222px',
    rWidth: '230px',
    rHeight: '222px',
  },
  [scales.MD]: {
    height: '165px',
    width: '165px',
    sWidth: '119px',
    sHeight: '114px',
    rWidth: '119px',
    rHeight: '114px',
  },
  [scales.SM]: {
    height: '106px',
    width: '106px',
    sWidth: '103px',
    sHeight: '104px',
    rWidth: '103px',
    rHeight: '104px',
  },
  [scales.XS]: {
    height: '106px',
    width: '106px',
    sWidth: '66px',
    sHeight: '63px',
    rWidth: '66px',
    rHeight: '63px',
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
    background: 'red',
  },
};
