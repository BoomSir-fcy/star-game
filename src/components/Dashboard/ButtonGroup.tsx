import React from 'react';
import {
  Flex,
  Button,
  Image,
  RefreshButton,
  BackButton,
  ButtonOnBack,
  ButtonOnRefresh,
  ButtonProps,
} from 'uikit';

export interface ButtonGroupProps {
  onRefresh?: ButtonOnRefresh;
  onBack?: ButtonOnBack;
}

interface SecondaryButtonProps extends ButtonProps {
  tag: 'attack' | 'flag' | 'm-box' | 'star';
}
const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  tag,
  children,
  ...props
}) => {
  return (
    <Button
      {...props}
      variant='secondary'
      mr='22px'
      startIcon={
        <Image width={50} height={50} src={`/images/commons/btn/${tag}.png`} />
      }
    >
      {children}
    </Button>
  );
};

const ButtonGroup: React.FC<ButtonGroupProps> = ({ onBack, onRefresh }) => {
  return (
    <Flex>
      <SecondaryButton tag='attack'>掠夺资源</SecondaryButton>
      <SecondaryButton tag='flag'>占领恒星</SecondaryButton>
      <SecondaryButton tag='star'>STAR GPOUP</SecondaryButton>
      <SecondaryButton tag='m-box'>STAR BOX</SecondaryButton>
      {/* <BackButton onBack={onBack} /> */}
      <RefreshButton mr='23px' onRefresh={onRefresh} />
    </Flex>
  );
};

export default ButtonGroup;
