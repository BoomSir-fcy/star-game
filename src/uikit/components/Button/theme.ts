import { textShadows } from 'uikit/theme/base';
import { scales, variants } from './types';

export const scaleVariants = {
  [scales.LD]: {
    height: '36px',
    minWidth: '108px',
    padding: '0 24px',
  },
  [scales.MD]: {
    height: '36px',
    padding: '0 24px',
  },
  [scales.SM]: {
    height: '52px',
    width: '202px',
    fontSize: '20px',
    padding: '0 16px',
  },
  [scales.XS]: {
    height: '20px',
    fontSize: '12px',
    padding: '0 8px',
  },
};

export const styleVariants = {
  [variants.LOGIN]: {
    background: `url(/images/commons/btn/enter.png)`,
    backgroundPosition: '0 0',
    width: '210px',
    height: '123px',
    paddingBottom: '48px',
  },
  [variants.PRIMARY]: {
    backgroundColor: '#191d24',
    color: 'white',
    border: '20px solid ',
    borderImage: 'url(/images/commons/btn/b3.png) 20 20',
    boxShadow: '0px 0px 9px 0px #41B7FF',
    height: '70px',
    padding: '0 52px',
    borderRadius: '20px',
    overflow: 'hidden',
    textShadow: textShadows.primary,
  },
  [variants.CUSTOM]: {
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    boxShadow: 'none',
    borderRadius: '0',
  },
  [variants.SECONDARY]: {
    background: 'url(/images/commons/btn/s3.png)',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    height: '74px',
    padding: '0',
    fontSize: '20px',
    width: '212px',
    textShadow: textShadows.secondary,
  },
  [variants.VS]: {
    background: 'url(/images/commons/btn/b1.png)',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    height: '91px',
    width: '280px',
    padding: '0',
    fontSize: '28px',
    boxShadow: 'none',
  },
  [variants.VS_REFRESH]: {
    background: 'url(/images/commons/btn/s1.png)',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    height: '105px',
    width: '105px',
    padding: '0',
    boxShadow: 'none',
  },
  [variants.TERTIARY]: {
    background: 'url(/images/commons/btn/s2.png)',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    height: '74px',
    width: '71px',
    padding: '0',
  },
  [variants.TEXT]: {
    backgroundColor: 'transparent',
    color: 'primary',
    boxShadow: 'none',
  },
};
