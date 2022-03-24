import { scales, variants } from "./types";

export const scaleVariants = {
  [scales.LD]: {
    height: "36px",
    minWidth: "108px",
    padding: "0 24px",
  },
  [scales.MD]: {
    height: "36px",
    padding: "0 24px",
  },
  [scales.SM]: {
    height: "32px",
    padding: "0 16px",
  },
  [scales.XS]: {
    height: "20px",
    fontSize: "12px",
    padding: "0 8px",
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
  // [variants.GHOST]: {
  //   background: `url(/images/commons/btn/enter.png)`,
  //   backgroundPosition: '0 0',
  //   width: '210px',
  //   height: '123px',
  //   paddingBottom: '48px',
  // },
  [variants.PRIMARY]: {
    backgroundColor: "#191d24",
    color: "white",
    border: '20px solid ',
    borderImage: 'url(/images/commons/btn/b3.png) 20 20',
    boxShadow: '0px 0px 9px 0px #41B7FF',
    height: '70px',
    padding: '0 52px',
    borderRadius: '20px',
    overflow: 'hidden',
    textShadow: '1px 1px 5px #41B7FF, -1px -1px 5px #41B7FF',
  },
  [variants.CUSTOM]: {
    backgroundColor: "transparent",
    color: "white",
    border: 'none',
    boxShadow: 'none',
    borderRadius: '0',
  },
  [variants.SECONDARY]: {
    background: 'url(/images/commons/btn/s3.png)',
    backgroundColor: "transparent",
    color: "white",
    border: 'none',
    // boxShadow: '0px 0px 9px 0px #41B7FF',
    height: '74px',
    padding: '0',
    fontSize: '20px',
    width: '212px',
    textShadow: '1px 1px 5px #41B7FF, -1px -1px 5px #41B7FF',
  },
  [variants.TERTIARY]: {
    background: 'url(/images/commons/btn/s2.png)',
    backgroundColor: "transparent",
    color: "white",
    border: 'none',
    // boxShadow: '0px 0px 9px 0px #41B7FF',
    height: '74px',
    width: '71px',
    padding: '0',
  },
  [variants.INFO]: {
    backgroundColor: "primary",
    color: "white",
    boxShadow: "none",
  },
  [variants.SUBTLE]: {
    backgroundColor: "textSubtle",
    color: "backgroundAlt",
  },
  [variants.DANGER]: {
    backgroundColor: "failure",
    color: "white",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0 0px, 10px 0px, 100% -1px",
    backgroundSize: "20px 36px, calc(100% - 20px) 36px, 20px 38px",

  },
  [variants.LEFT]: {
    color: "white",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0",
    backgroundSize: "57px 60px",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    boxShadow: "0px -3px 0px 0px rgba(14, 14, 44, 0.4) inset,  0px -2px 0px 0px rgba(250, 250, 253, 0.4), 1px 0px 0px 0px rgba(14, 14, 44, 0.4)",

  },
  [variants.RIGHT]: {
    color: "white",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right",
    backgroundSize: "57px 60px",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    boxShadow: "0px -3px 0px 0px rgba(14, 14, 44, 0.4) inset,  0px -2px 0px 0px rgba(250, 250, 253, 0.4), -1px 0px 0px 0px rgba(14, 14, 44, 0.4)",
  },
  [variants.SUCCESS]: {
    backgroundColor: "success",
    color: "white",
  },
  [variants.ORANGE]: {
    backgroundColor: "orange",
    color: "white",
    boxShadow: "none",
  },
  [variants.TEXT]: {
    backgroundColor: "transparent",
    color: "primary",
    boxShadow: "none",
  },
  [variants.TEXTLINE]: {
    backgroundColor: "transparent",
    color: "primary",
    boxShadow: "none",
    padding: 0,
    margin: 0,
  },
  [variants.CIRCULAR]: {
    color: "white",
    width: "36px",
    height: "36px",
    padding: "0",
  },
};
