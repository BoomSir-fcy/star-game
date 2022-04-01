import React from 'react';
import { ImageProps, Image } from 'uikit';

export const GalaxyImage: React.FC<ImageProps> = ({
  width = 351,
  height = 351,
  ...props
}) => {
  return (
    <Image
      {...props}
      width={width}
      height={height}
      src='/images/commons/star/1.png'
    />
  );
};
