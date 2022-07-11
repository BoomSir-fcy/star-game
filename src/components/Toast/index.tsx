import React from 'react';
import { ToastContainer, ToastContainerProps } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { useStore } from 'state';
import styled from 'styled-components';
import { CloseButton } from 'uikit';

const StyledContainer = styled(ToastContainer)<{ scale: number }>`
  &.Toastify__toast-container {
    z-index: 99999;
    transform: translateZ(1px) scale(${({ scale }) => scale});
    left: auto;
    right: -80px;
    top: 10px;
    /* right: ${({ scale }) => `${scale * 20}px`};
    top: ${({ scale }) => `${scale * 20}px`}; */
    ${({ theme }) => theme.mediaQueries.sm} {
      right: -60px;
      top: 20px;
    }
    ${({ theme }) => theme.mediaQueries.xl} {
      right: 20px;
      top: 20px;
    }
  }
  .Toastify__toast {
    background: url('/images/commons/modal/toast.png') no-repeat;
    background-size: 100% 100%;
    min-height: 150px;
  }
  .Toastify__toast-body {
    flex-direction: column;
    padding: 6px 15px;
    font-size: 22px;
    color: #fff;
  }
  .Toastify__toast-icon {
    width: 30px;
    margin-bottom: 10px;
  }
  .Toastify__toast-body > div:last-child {
    word-break: break-all;
  }
`;

const StyledCloseBtn = styled(CloseButton)`
  position: absolute;
  right: 0;
  top: 0;
`;
const ToastComponents: React.FC<ToastContainerProps> = React.memo(() => {
  const { scale } = useStore(p => p.user);
  return (
    <StyledContainer
      containerId='toast'
      position='top-right'
      limit={100}
      closeButton={() => <StyledCloseBtn width={35} />}
      autoClose={3000}
      scale={scale}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      hideProgressBar
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
});

export default ToastComponents;
