import React from 'react';
export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    srcs: string[];
}
/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
declare const Logo: React.FC<LogoProps>;
export default Logo;
