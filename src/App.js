import { useState } from 'react';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';

import Router from './routes';
import './assets/scss/style.css';
import { Wallets } from './components/wallet';
import { context } from './contexts/context';

const TRACKING_ID = "G-V9J2GN1NKX";
ReactGA.initialize(TRACKING_ID);

const history = createBrowserHistory();
// Initialize google analytics page view tracking
history.listen(location => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

export default function App() {
  const [token, setToken] = useState(null);
  const [chipAmount, setChipAmount] = useState(null);
  return (
    <context.Provider value={{ token, setToken, chipAmount, setChipAmount }}>
      <Wallets>
        <Router />
      </Wallets>
    </context.Provider>
  );
}
