import React, { useCallback } from 'react';
import Modal from 'react-modal';
import styled, { DefaultTheme } from 'styled-components';
import { Text, Flex, Button, Box } from 'uikit';
import useTheme from 'hooks/useTheme';

const BoxStyled = styled(Box)<{ overflow?: string }>`
  margin: 40px 0 0 0;
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
      <Text fontSize='30px' mt='8px' pl='20px' bold>
        {title}
      </Text>
      <Button padding='0' onClick={onClose} variant='text'>
        <Box width='55px'>
          <img alt='' src='/images/commons/modal/cancle.png' />
        </Box>
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
    transform: 'translate(-50%, -50%) translateZ(1px)',
    minWidth: '320px',
    border: 0,
    zIndex: 200,
    inset: '50% auto auto 50%',
    background: 'url(/images/commons/modal/bg.png)',
    padding: '60px',
    margin: '0',
    width: '1032px',
    height: '802px',
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
          const rate = maxV / 1920;
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
        appElement={document.getElementById('scale-content') || document.body}
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
