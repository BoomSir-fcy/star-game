import React from 'react';
import { light, dark } from 'uikit';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from 'utils/web3Core';
import { LanguageProvider } from 'contexts/Localization';
import { RefreshContextProvider } from 'contexts/RefreshContext';
import { ToastsProvider } from 'contexts/ToastsContext';
import { ConnectWalletProvider } from 'contexts/ConnectWallet';
import store from 'state';

const ThemeProviderWrapper: React.FC = props => {
  const isDark = true;
  return <ThemeProvider theme={isDark ? dark : light} {...props} />;
};

const Providers: React.FC = ({ children }) => {
  return (
    <BrowserRouter>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Provider store={store}>
          <HelmetProvider>
            <ThemeProviderWrapper>
              <LanguageProvider>
                <RefreshContextProvider>
                  <ToastsProvider>
                    <ConnectWalletProvider>{children}</ConnectWalletProvider>
                  </ToastsProvider>
                </RefreshContextProvider>
              </LanguageProvider>
            </ThemeProviderWrapper>
          </HelmetProvider>
        </Provider>
      </Web3ReactProvider>
    </BrowserRouter>
  );
};

export default Providers;
