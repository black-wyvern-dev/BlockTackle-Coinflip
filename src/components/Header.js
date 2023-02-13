import { Link, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import logo from '../assets/img/SkateXLogo.png';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Nav = (props) => {
  const menuStyle = { marginLeft: 3, fontWeight: 'bold', cursor: 'pointer' };
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(false);
  }, []);

  function gaTriggerNavAction() {
    ReactGA.event({
      category: 'Navigation',
      action: 'FaqPageClicked',
      nonInteraction: true,
    });
  }

  const handleFaqClicked = () => {
    gaTriggerNavAction();
    props.showModal();
  };

  return (
    <>
      <div className="top_menu">
        <div className="left_menu">
          <img src={logo} alt="SkateX logo" />
          <Box sx={menuStyle}>
            <Link className={location.pathname === '/' ? 'text-green' : 'text-white'} to="/">
              HOME
            </Link>
          </Box>
          <Box sx={menuStyle}>
            <Link
              className={location.pathname === '/profile' ? 'text-green' : 'text-white'}
              to="/profile"
            >
              PROFILE
            </Link>
          </Box>
          <Box sx={menuStyle}>
            <Link
              className={location.pathname === '/leaderboard' ? 'text-green' : 'text-white'}
              to="/leaderboard"
            >
              LEADERBOARDS
            </Link>
          </Box>
          <Box sx={menuStyle}>
            <Link
              className={location.pathname === '/history' ? 'text-green' : 'text-white'}
              to="/history"
            >
              HISTORY
            </Link>
          </Box>
          <Box sx={menuStyle}>
            <Link className="text-white" to="#" onClick={handleFaqClicked}>
              FAQ
            </Link>
          </Box>
        </div>
        <WalletMultiButton />
      </div>
      <div className="mobile_menu_toggle">
        {isOpen ? (
          <HighlightOffIcon onClick={() => setIsOpen(false)} />
        ) : (
          <MenuIcon onClick={() => setIsOpen(true)} />
        )}
        {isOpen && (
          <div className="responsive_menu">
            <WalletMultiButton />
            <Box>
              <Link
                className={location.pathname === '/' ? 'text-green' : 'text-white'}
                to="/"
                onClick={() => setIsOpen(false)}
              >
                HOME
              </Link>
            </Box>
            <Box>
              <Link
                className={location.pathname === '/profile' ? 'text-green' : 'text-white'}
                to="/profile"
                onClick={() => setIsOpen(false)}
              >
                PROFILE
              </Link>
            </Box>
            <Box>
              <Link
                className={location.pathname === '/leaderboard' ? 'text-green' : 'text-white'}
                to="/leaderboard"
                onClick={() => setIsOpen(false)}
              >
                LEADERBOARDS
              </Link>
            </Box>
            <Box>
              <Link
                className={location.pathname === '/history' ? 'text-green' : 'text-white'}
                to="/history"
                onClick={() => setIsOpen(false)}
              >
                HISTORY
              </Link>
            </Box>
            <Box>
              <Link className="text-white" to="#" onClick={handleFaqClicked}>
                FAQ
              </Link>
            </Box>
          </div>
        )}
      </div>
      <div className="blank_section"></div>
    </>
  );
};

export default function Header(props) {
  return (
    <WalletModalProvider>
      <div className="header">
        <Nav showModal={props.showModal} />
      </div>
    </WalletModalProvider>
  );
}
