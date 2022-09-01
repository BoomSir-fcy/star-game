import React from 'react';
import { TokenPairImageProps as UIKitTokenPairImageProps, ImageProps } from 'pancake-uikit';
import { Token } from 'config/constants/types';
interface TokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
    primaryToken?: Token;
    secondaryToken?: Token;
    primarySymbol?: string;
    secondarySymbol?: string;
    primaryAddress?: string;
    secondaryAddress?: string;
}
export declare const TokenPairImage: React.FC<TokenPairImageProps>;
interface TokenImageProps extends ImageProps {
    token: Token;
}
export declare const TokenImage: React.FC<TokenImageProps>;
export {};
