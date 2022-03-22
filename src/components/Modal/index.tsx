import React, { useCallback } from 'react';
import Modal from 'react-modal';
import styled, { DefaultTheme } from 'styled-components';
import { Heading, Flex, HelpIcon, Button, Box } from 'uikit';

import useTheme from 'hooks/useTheme';

const BoxStyle = styled(Box)<{ overflow?: string }>`
  overflow-y: ${({ overflow }) => overflow || 'auto'};
  max-height: calc(80vh - 100px);
  padding-bottom: 3px;
`;

const getCustomStyles = (
  theme: DefaultTheme,
  fillBody?: boolean,
  top?: string,
  padding?: string,
  left?: string,
) => ({
  content: {
    top: top ? top : '50%',
    left: left ? left : '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    minWidth: '320px',
    border: 0,
    overflow: 'visible',
    padding: padding ? padding : fillBody ? '18px 0' : '18px 20px',
    zIndex: 200,
    inset: '50% auto auto 50%',
    maxHeight: '80vh',
  },
  overlay: {
    backgroundColor: 'rgba(98, 98, 98, 0.3)',
    zIndex: 200,
  },
});

interface ModalHeaderProps {
  title?: string;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  theme?: DefaultTheme;

}
const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose, theme }) => {
  return (
    <Flex
      theme={theme}
      mb='8px'
      justifyContent='space-between'
      alignItems='center'
    >
      <Heading>{title}</Heading>
      <Button onClick={onClose} padding='0' variant='text'>
        <HelpIcon width={16} color='white_black' />
      </Button>
    </Flex>
  );
};

const scales = {
  XS: 'xs',
  MD: 'md',
  XL: 'xl',
} as const;
interface ModalWrapperProps {
  visible: boolean;
  scale?: typeof scales[keyof typeof scales];
  setVisible?: (state: boolean) => void;
  title?: string;
  creactOnUse?: boolean;
  customizeTitle?: boolean;
  shouldCloseOnOverlayClick?: boolean;
  theme?: DefaultTheme;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = React.memo(
  ({
    visible,
    setVisible,
    children,
    creactOnUse,
    title,
    shouldCloseOnOverlayClick = true,
    theme,
  }) => {
    const { theme: defaultTheme } = useTheme();

    const themes = theme || defaultTheme;

    const onClose = useCallback(() => {
      if (setVisible) {
        setVisible(false);
      }
    }, [setVisible]);
    if (!visible && creactOnUse) return null;
    return (
      <Modal
        isOpen={visible}
        onRequestClose={onClose}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        contentLabel='Example Modal'
      >
        <ModalHeader title={title} onClose={onClose} theme={themes}/>
        <BoxStyle theme={themes}>
          {children}
        </BoxStyle>
      </Modal>
    );
  },
);

ModalWrapper.defaultProps = {
  scale: scales.XL,
};
