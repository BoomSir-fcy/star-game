import React from 'react';
import { ToastContainer, ToastContainerProps } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { CloseButton } from 'uikit';

const StyledContainer = styled(ToastContainer)`
  .Toastify__toast {
    background: url('/images/commons/modal/toast.png') no-repeat;
    background-size: 100%;
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
`;

const StyledCloseBtn = styled(CloseButton)`
  position: absolute;
  right: 0;
  top: 0;
`;
const ToastComponents: React.FC<ToastContainerProps> = React.memo(() => {
  return (
    <StyledContainer
      containerId='toast'
      position='top-right'
      limit={100}
      closeButton={() => <StyledCloseBtn width={35} />}
      autoClose={3000}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      hideProgressBar
      pauseOnFocusLoss
      draggable
      pauseOnHover
      style={{
        zIndex: 99999,
        transform: 'translateZ(1px)',
      }}
    />
  );
});

export default ToastComponents;
