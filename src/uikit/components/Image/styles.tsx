import styled from "styled-components";
import { variant as StyledSystemVariant } from "styled-system";
import { ImageProps, Variant, variants } from "./types";
import TokenImage from "./TokenImage";

interface StyledImageProps extends ImageProps {
  variant: Variant;
}

export const StyledPrimaryImage = styled(TokenImage)<StyledImageProps>`
  position: absolute;
  border-radius: 50%;
  /* width: ${({ variant }) =>
    variant === variants.DEFAULT ? "82%" : "70%"}; // 92, 82 are arbitrary numbers to fit the variant */

  ${StyledSystemVariant({
    variants: {
      [variants.DEFAULT]: {
        width: '82%',
        bottom: "auto",
        left: 0,
        right: "auto",
        top: 0,
        zIndex: 5,
      },
      [variants.INVERTED]: {
        width: '70%',
        bottom: 0,
        left: "auto",
        right: 0,
        top: "auto",
        zIndex: 6,
      },
      [variants.BINARY]: {
        width: '100%',
        height: '100%',
        bottom: 0,
        left: "auto",
        // margin: "auto",
        right: 0,
        top: "auto",
        zIndex: 5,
      },
    },
  })}
`;

export const StyledSecondaryImage = styled(TokenImage)<StyledImageProps>`
  position: absolute;
  transform: scale(0.95);
  /* width: ${({ variant }) =>
    variant === variants.DEFAULT ? "82%" : "70%"}; // 92, 82 are arbitrary numbers to fit the variant */

  ${StyledSystemVariant({
    variants: {
      [variants.DEFAULT]: {
        bottom: 0,
        width: '82%',
        left: "auto",
        right: "5px",
        top: "auto",
        zIndex: 6,
      },
      [variants.INVERTED]: {
        width: '70%',
        bottom: "auto",
        left: 0,
        right: "auto",
        top: 0,
        zIndex: 5,
      },
      [variants.BINARY]: {
        width: '50%',
        height: '50%',
        bottom: 0,
        // margin: "auto",
        left: "auto",
        right: "-5px",
        top: "auto",
        zIndex: 6,
      },
    },
  })}
`;
