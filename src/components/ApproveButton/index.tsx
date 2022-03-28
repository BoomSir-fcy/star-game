import React, { useCallback, useState, useImperativeHandle } from 'react';
import { Dots, Button, ButtonProps } from 'uikit';
import { Gender } from 'state/types';
import { useApprove } from './hooks';

export interface ForwardRefRenderProps {
  getState: () => { name: string; gender: Gender };
}

interface ApproveButtonProps extends ButtonProps {
  erc20Token: string;
  spender: string;
  onFinish?: (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void;
}
const ApproveButton: React.FC<ApproveButtonProps> = ({
  erc20Token,
  spender,
  onFinish,
  ...props
}) => {
  const { onApprove } = useApprove(erc20Token, spender);

  const [loading, setLoading] = useState(false);
  const handleApprove = useCallback(async () => {
    try {
      setLoading(true);
      await onApprove();
      if (onFinish) onFinish(setLoading);
    } catch (error) {
      console.log(1211212);
      setLoading(false);
    }
    // setLoading(false);
  }, [setLoading, onApprove, onFinish]);

  return (
    <Button disabled={loading} onClick={handleApprove} {...props}>
      {loading ? <Dots>授权</Dots> : '授权'}
    </Button>
  );
};

export default ApproveButton;
