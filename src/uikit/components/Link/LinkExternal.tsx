import React from 'react';
import Link from './Link';
import { LinkProps } from './types';
import OpenNewIcon from '../Svg/Icons/OpenNew';

const LinkExternal: React.FC<LinkProps> = ({ children, color, ...props }) => {
  return (
    <Link external {...props}>
      {children}
      <OpenNewIcon width='24px' color={color || 'textPrimary'} ml='4px' />
    </Link>
  );
};

export default LinkExternal;
