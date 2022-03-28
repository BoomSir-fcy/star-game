import React from 'react';
import { BoxProps } from 'uikit';
import { AvatarBox, AvatarImage, AvatarBorder } from './styled';
import { AvatarProps } from './types';

const ManAvatar: React.FC<AvatarProps> = ({ active, onClick, ...props }) => {
  return (
    <AvatarBox {...props}>
      <AvatarImage active={active} src='/images/login/a-man.png' />
      <AvatarBorder
        onClick={onClick}
        src='/images/login/a-b-man.png'
        active={active}
        pointer
      />
    </AvatarBox>
  );
};

export default ManAvatar;
