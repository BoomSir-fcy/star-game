import styled from "styled-components";
import Text from "../Text/Text";
import { tags, scales, HeadingProps } from "./types";

const style = {
  [scales.SM]: {
    fontSize: "12px",
    fontSizeLg: "12px",
  },
  [scales.LD]: {
    fontSize: "14px",
    fontSizeLg: "16px",
  },
  [scales.MD]: {
    fontSize: "16px",
    fontSizeLg: "20px",
  },
  [scales.LG]: {
    fontSize: "24px",
    fontSizeLg: "24px",
  },
  [scales.LX]: {
    fontSize: "24px",
    fontSizeLg: "32px",
  },
  [scales.XL]: {
    fontSize: "32px",
    fontSizeLg: "40px",
  },
  [scales.XLD]: {
    fontSize: "32px",
    fontSizeLg: "48px",
  },
  [scales.XXL]: {
    fontSize: "48px",
    fontSizeLg: "64px",
  },
  [scales.XXLD]: {
    fontSize: "54px",
    fontSizeLg: "80px",
  },
  [scales.XXXL]: {
    fontSize: "44px",
    fontSizeLg: "90px",
  },
};

const Heading = styled(Text).attrs({ bold: true })<HeadingProps>`
  font-size: ${({ scale }) => style[scale || scales.MD].fontSize};
  font-weight: 600;
  line-height: 1.1;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: ${({ scale }) => style[scale || scales.MD].fontSizeLg};
  }
`;

Heading.defaultProps = {
  as: tags.H2,
};

export default Heading;
