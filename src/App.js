import { useEffect, useState } from 'react';
import ReactGA from 'react-ga';

import Router from './routes';
import './assets/scss/style.css';
import { Wallets } from './components/wallet';
import { context } from './contexts/context';

export default function App() {
  const [token, setToken] = useState(null);
  const [chipAmount, setChipAmount] = useState(null);
  const [pageOpenedTimestamp, setPageOpenedTimestamp] = useState(Date.now());

  const TRACKING_ID = 'G-V9J2GN1NKX';
  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
  }, []);

  return (
    <context.Provider
      value={{
        token,
        setToken,
        chipAmount,
        setChipAmount,
        pageOpenedTimestamp,
        setPageOpenedTimestamp
      }}
    >
      <Wallets>
        <Router />
      </Wallets>
    </context.Provider>
  );
}
