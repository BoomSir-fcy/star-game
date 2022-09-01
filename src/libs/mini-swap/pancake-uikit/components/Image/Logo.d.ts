import React from 'react';
import { ImageProps } from './types';
export interface LogoProps extends ImageProps {
    srcs: string[];
}
/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
declare const Logo: React.FC<LogoProps>;
export default Logo;
