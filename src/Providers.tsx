import React from 'react'
import { light, dark } from 'uikit'
import { ThemeProvider } from 'styled-components'
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async'
import { Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from 'utils/web3Core';
import { LanguageProvider } from 'contexts/Localization'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ToastsProvider } from 'contexts/ToastsContext'
import { ConnectWalletProvider } from 'contexts/ConnectWallet';

const ThemeProviderWrapper: React.FC = (props) => {
  const isDark = true
  return <ThemeProvider theme={isDark ? dark : light} {...props}/>
}

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <HelmetProvider>
        <ThemeProviderWrapper>
          <LanguageProvider>
            <RefreshContextProvider>
              <ToastsProvider>
                <ConnectWalletProvider>
                  {children}
                </ConnectWalletProvider>
              </ToastsProvider>
            </RefreshContextProvider>
          </LanguageProvider>
        </ThemeProviderWrapper>
      </HelmetProvider>
    </Web3ReactProvider>
  )
}

export default Providers
