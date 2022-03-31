import React from 'react';
import { AvatarBox, AvatarImage } from './styled';
import { RaceAvatarProps, raceImage } from './types';

const RaceAvatar: React.FC<RaceAvatarProps> = ({
  width = '130px',
  height = '130px',
  race,
  ...props
}) => {
  return (
    <AvatarBox width={width} height={height} {...props}>
      <AvatarImage width={width} height={height} src={raceImage[race]} />
    </AvatarBox>
  );
};

export default RaceAvatar;
