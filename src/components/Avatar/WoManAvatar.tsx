import React from 'react';
import { Box } from 'uikit';
import { AvatarBox, AvatarImage, AvatarBorder } from './styled';
import { AvatarProps } from './types';

const WoManAvatar: React.FC<AvatarProps> = ({ active, onClick, ...props }) => {
  return (
    <AvatarBox {...props}>
      <AvatarImage active={active} src='/images/login/a-woman.png' />
      <AvatarBorder
        onClick={onClick}
        src='/images/login/a-b-woman.png'
        active={active}
      />
    </AvatarBox>
  );
};

export default WoManAvatar;
