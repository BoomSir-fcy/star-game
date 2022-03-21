import React from 'react';
import { ToastsContext } from './Provider';

const useToast = () => {
  const toastContext = React.useContext(ToastsContext);
  return toastContext;
};

export default useToast;
