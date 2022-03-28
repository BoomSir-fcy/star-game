import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import useActiveWeb3React from './hooks/useActiveWeb3React';
import { BLOCKED_ADDRESSES } from './config/constants';
import reportWebVitals from './reportWebVitals';
import Providers from './Providers';
import App from './App';

function BlockList({ children }: { children: React.ReactNode }) {
  const { account } = useActiveWeb3React();
  const blocked: boolean = useMemo(
    () => Boolean(account && BLOCKED_ADDRESSES.indexOf(account) !== -1),
    [account],
  );
  if (blocked) {
    return <div>Blocked address</div>;
  }
  return <>{children}</>;
}

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <BlockList>
        <App />
      </BlockList>
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
