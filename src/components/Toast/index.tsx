import React from 'react';
import { ToastContainer, ToastContainerProps } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const ToastComponents: React.FC<ToastContainerProps> = React.memo(() => {
  return (
    <ToastContainer
      containerId='toast'
      position='top-right'
      limit={100}
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
