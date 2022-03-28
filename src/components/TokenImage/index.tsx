import React from 'react';
import {
  TokenPairImage as UIKitTokenPairImage,
  TokenPairImageProps as UIKitTokenPairImageProps,
  TokenImage as UIKitTokenImage,
  ImageProps,
} from 'uikit';

import getTokenLogoURLs from 'utils/getTokenLogoURL';

interface TokenPairImageProps
  extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
  primaryAddress?: string;
  secondaryAddress?: string;
}

export const TokenPairImage: React.FC<TokenPairImageProps> = ({
  primaryAddress,
  secondaryAddress,
  ...props
}) => {
  const primarySrcs = getTokenLogoURLs(primaryAddress);
  const secondarySrcs = getTokenLogoURLs(secondaryAddress);

  return (
    <UIKitTokenPairImage
      primarySrcs={primarySrcs}
      secondarySrcs={secondarySrcs}
      {...props}
    />
  );
};

interface TokenImageProps extends ImageProps {
  tokenAddress: string;
}

export const TokenImage: React.FC<TokenImageProps> = ({
  tokenAddress,
  ...props
}) => {
  console.log(getTokenLogoURLs(tokenAddress), 'getTokenLogoURLs(tokenAddress)');
  return <UIKitTokenImage srcs={getTokenLogoURLs(tokenAddress)} {...props} />;
};
