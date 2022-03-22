import React, { useCallback } from 'react';
import Modal from 'react-modal';
import styled, { DefaultTheme } from 'styled-components';
import { Heading, Flex, HelpIcon, Button, Box } from 'uikit';
import useTheme from 'hooks/useTheme';

Modal.setAppElement('#scale-content');

const BoxStyled = styled(Box)<{ overflow?: string }>`
  background-color: ${({ theme }) => theme.colors.backgroundModal};
`;

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
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  creactOnUse?: boolean;
  customizeTitle?: boolean;
  shouldCloseOnOverlayClick?: boolean;
  theme?: DefaultTheme;
}

const getCustomStyles = (themes: DefaultTheme) => ({
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    minWidth: '320px',
    border: 0,
    zIndex: 200,
    inset: '50% auto auto 50%',
    maxHeight: '80vh',
    background: 'transparent',
    padding: '0',
    margin: '0',
  },
  overlay: {
    backgroundColor: themes.colors.overlay,
    zIndex: 200,
    // transform: 'scale(1)',
    // width: '100vw',
    // height: '100vw',
  },
});

const ModalWrapper: React.FC<ModalWrapperProps> = React.memo(
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
        style={getCustomStyles(themes)}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        contentLabel='Example Modal'
        parentSelector={() =>
          document.querySelector('#scale-content') || document.body
        }
        overlayElement={(props, contentElement) => {
          const { width, height } =
            window.document.documentElement.getBoundingClientRect();
          const maxV = Math.max(width, height);
          const rate = maxV / 1980;
          return (
            <div
              {...props}
              style={{
                ...props.style,
                height: `${(1 / rate) * 100}vmin`,
                top: '0',
                bottom: '0',
                margin: 'auto',
              }}
            >
              {contentElement}
            </div>
          );
        }}
      >
        <ModalHeader title={title} onClose={onClose} theme={themes} />
        <BoxStyled>{children}</BoxStyled>
      </Modal>
    );
  },
);

ModalWrapper.defaultProps = {
  scale: scales.XL,
};

export default ModalWrapper;
