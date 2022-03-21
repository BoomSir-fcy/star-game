import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { kebabCase } from 'lodash';
import { Flex, Text } from 'uikit';

export const toastTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warn',
  INFO: 'info',
} as const;

export type ToastTypes = typeof toastTypes[keyof typeof toastTypes];

export const ToastsContext = React.createContext({} as ToastContextApi);
export const ToastsProvider: React.FC = ({ children }) => {
  const toastFunc = React.useCallback(
    (title, type: ToastTypes, url?: string, urlText?: string) => {
      const toastId = title ? kebabCase(title) : kebabCase(`${+new Date()}`);
      toast[type](url ? toastWithLink(title, url, urlText) : title, {
        toastId,
      });
    },
    [],
  );

  const toastWithLink = (title: string, url: string, urlText?: string) => (
    <Flex as={Link} to={url}>
      <Text color='rgb(117, 117, 117)'>{title}</Text>
      <Text ml='10px' color='rgb(117, 117, 117)'>
        {urlText}
      </Text>
    </Flex>
  );

  const toastSuccess = (title: string) => {
    return toastFunc(title, toastTypes.SUCCESS);
  };

  const toastWarning = (title: string) => {
    return toastFunc(title, toastTypes.WARNING);
  };

  const toastInfo = (title: string) => {
    return toastFunc(title, toastTypes.INFO);
  };

  const toastError = (title: string) => {
    return toastFunc(title, toastTypes.ERROR);
  };

  const toastLink = (title: string, url: any, urlText?: string) => {
    return toastFunc(title, toastTypes.SUCCESS, url, urlText);
  };

  return (
    <ToastsContext.Provider
      value={{ toastSuccess, toastWarning, toastInfo, toastError, toastLink }}
    >
      {children}
    </ToastsContext.Provider>
  );
};
