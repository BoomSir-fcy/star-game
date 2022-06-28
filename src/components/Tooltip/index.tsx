import React, { ReactNode } from 'react';
import Tooltip from 'rc-tooltip';
import { TooltipProps } from 'rc-tooltip/lib/Tooltip';
import 'rc-tooltip/assets/bootstrap.css';

interface TooltipTriggerProps extends TooltipProps {
  overlay: ReactNode | (() => ReactNode);
  trigger?: string | string[];
  placement?: string;
}

const TooltipTrigger: React.FC<TooltipTriggerProps> = ({
  overlay,
  trigger = ['hover', 'click'],
  placement = 'right',
  children,
  ...props
}) => {
  return (
    <Tooltip
      placement={placement}
      mouseEnterDelay={0}
      mouseLeaveDelay={0.1}
      destroyTooltipOnHide={false}
      trigger={trigger}
      overlay={overlay}
      overlayInnerStyle={{ background: 'rgb(75 75 75 / 50%)' }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default TooltipTrigger;
