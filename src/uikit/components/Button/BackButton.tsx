import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from '../Image';
import Button from './Button';
import { ButtonProps, ButtonOnBack } from './types';

interface RefreshButtonProps extends ButtonProps {
  onBack?: ButtonOnBack;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onBack, ...props }) => {
  const navigate = useNavigate();
  const handleClick = useCallback(
    async event => {
      if (onBack) {
        onBack();
      } else {
        navigate(-1);
      }
      if (props.onClick) {
        props.onClick(event);
      }
    },
    [onBack, props, navigate],
  );
  return (
    <Button {...props} variant='tertiary' onClick={handleClick}>
      <Image width={50} height={50} src='/images/commons/btn/back.png' />
    </Button>
  );
};

export default RefreshButton;
