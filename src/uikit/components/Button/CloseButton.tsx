import React from 'react';
import { Image, Button, ButtonProps } from 'uikit';

interface CloseButtonProps extends ButtonProps {
  onClose?: () => void;
}
export const CloseButton: React.FC<CloseButtonProps> = ({
  onClose,
  ...props
}) => {
  return (
    <Button {...props} padding='0' onClick={onClose} variant='text'>
      <Image width={55} height={55} src='/images/commons/modal/cancle.png' />
    </Button>
  );
};
