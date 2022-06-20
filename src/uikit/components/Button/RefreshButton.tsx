import React, { useCallback, useState } from 'react';
import { Image } from '../Image';
import Button from './Button';
import { ButtonProps, ButtonOnRefresh } from './types';

interface RefreshButtonProps extends ButtonProps {
  onRefresh?: () => void;
  variant?: 'tertiary' | 'vsRefresh';
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  variant = 'tertiary',
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const handleClick = useCallback(
    async event => {
      if (onRefresh) {
        setLoading(true);
        await onRefresh();
        setLoading(false);
      }
      if (props.onClick) {
        props.onClick(event);
      }
    },
    [onRefresh, props],
  );
  return (
    <Button
      {...props}
      variant={variant}
      isLoading={loading}
      onClick={handleClick}
    >
      <Image width={36} height={36} src='/images/commons/btn/refresh.png' />
    </Button>
  );
};

export default RefreshButton;
