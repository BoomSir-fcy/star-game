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
  [variants.PRIMARY]: {
    backgroundColor: "primary",
    color: "white",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0 0px, 10px 0px, 100% -1px",
    backgroundSize: "20px 36px, calc(100% - 20px) 36px, 20px 38px",
  },
  [variants.SECONDARY]: {
    backgroundColor: "transparent",
    border: "2px solid",
    borderColor: "primary",
    boxShadow: "none",
    color: "primary",
    ":disabled": {
      backgroundColor: "transparent",
    },
  },
  [variants.TERTIARY]: {
    backgroundColor: "tertiary",
    boxShadow: "none",
    color: "primary",
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
