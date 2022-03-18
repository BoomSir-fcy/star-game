import React from "react";
import { TokenPairImageProps, variants } from "./types";
import { StyledPrimaryImage, StyledSecondaryImage } from "./styles";
import Wrapper from "./Wrapper";

const TokenPairImage: React.FC<TokenPairImageProps> = ({
  primarySrc,
  secondarySrc,
  primarySrcs,
  secondarySrcs,

  width,
  height,
  variant = variants.DEFAULT,
  primaryImageProps = {},
  secondaryImageProps = {},
  ...props
}) => {
  // const secondaryImageSize = Math.floor(width / 2);
  return (
    <Wrapper position="relative" width={width} height={height} {...props}>
      <StyledPrimaryImage
        shadow
        variant={variant}
        srcs={primarySrcs?.length ? [...primarySrcs, `${primarySrc}`] : [`${primarySrc}`]}
        width={width}
        height={height}
        {...primaryImageProps}
      />
      <StyledSecondaryImage
        shadow
        variant={variant}
        srcs={secondarySrcs?.length ? [...secondarySrcs, `${secondarySrc}`] : [`${secondarySrc}`]}
        width={width}
        height={width}
        {...secondaryImageProps}
      />
    </Wrapper>
  );
};

export default TokenPairImage;
