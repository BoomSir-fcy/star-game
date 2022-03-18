import React from 'react'
import { light, dark } from 'uikit'
import { ThemeProvider } from 'styled-components'

const ThemeProviderWrapper: React.FC = (props) => {
  const isDark = true
  return <ThemeProvider theme={isDark ? dark : light} {...props}/>
}

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProviderWrapper>
      {/* <LanguageProvider> */}
        {children}
      {/* </LanguageProvider> */}
    </ThemeProviderWrapper>
  )
}

export default Providers
