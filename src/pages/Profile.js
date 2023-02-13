import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import ReactGA from 'react-ga';
import axios from 'axios';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

import Box from '@mui/material/Box';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import MiscStats from '../components/MiscStats';
import PNL from '../components/PNL';
import { BACKEND_URL } from '../config';

ChartJS.register(ArcElement, Tooltip, Legend);

const DEFAULT_DATA = {
  response: {
    topWinStreak: 0,
    topLoseStreak: 0,
    kickWon: 0,
    kickLost: 0,
    wipeWon: 0,
    wipeLost: 0,
    luckToken: 'GRIND',
    unluckToken: 'GRIND'
  },
  tokenInfo: {
    SOL: {
      count: 0,
      volume: 0,
      winRate: 0,
      pnl: 0
    },
    GRIND: {
      count: 0,
      volume: 0,
      winRate: 0,
      pnl: 0
    }
  }
};

export default function Profile({ props }) {
  const [profile, setProfile] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [pieData1, setPieData1] = useState({
    data: [1, 1],
    backgroundColor: ['#B38CB4', '#FFE484'],
    borderColor: ['#FFFFFF', '#FFFFFF'],
    borderWidth: 2
  });
  const [pieData2, setPieData2] = useState({
    data: [1, 1],
    backgroundColor: ['#FF6660', '#5DE3BF'],
    borderColor: ['#FFFFFF', '#FFFFFF'],
    borderWidth: 2
  });

  const { publicKey } = useWallet();

  useEffect(() => {
    if (!publicKey) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchProfile();
  }, [publicKey]);

  useEffect(() => {
    gaTriggerNavAction();
  }, []);

  function gaTriggerNavAction() {
    ReactGA.event({
      category: 'Navigation',
      action: 'ProfilePageClicked',
      nonInteraction: true,
    });
  }

  const fetchProfile = () => {
    axios
      .get(`${BACKEND_URL}/profile/${publicKey.toBase58()}`)
      .then((res) => {
        // console.log('==> Profile response');
        // console.log(res.data);
        return res.data;
      })
      .catch((e) => {
        return DEFAULT_DATA;
      })
      .then((data) => {
        setLoading(false);
        setProfile((_oldData) => {
          setPieData1((oldData) => {
            return {
              ...oldData,
              data: [
                data.response.wipeWon + data.response.wipeLost,
                data.response.kickWon + data.response.kickLost
              ]
            };
          });

          setPieData2((oldData) => {
            return {
              ...oldData,
              data: [
                data.response.kickLost + data.response.wipeLost,
                data.response.kickWon + data.response.wipeWon
              ]
            };
          });
          return data;
        });
      });
  };

  return (
    <>
      <div className="profile-content">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          {!publicKey && (
            <>
              <h3 className="text-yellow" style={{ textAlign: 'center' }}>
                Connect your wallet to see your Kickflip Stats.
              </h3>
              <WalletModalProvider>
                <div style={{ marginTop: '20px' }}>
                  <WalletMultiButton />
                </div>
              </WalletModalProvider>
            </>
          )}
          {publicKey && (
            <div style={{ width: '100%', position: 'relative' }}>
              <h1 className="caption_text text-white">
                {(
                  publicKey.toString().slice(0, 4) +
                  '...' +
                  publicKey
                    .toString()
                    .slice(publicKey.toString().length - 4, publicKey.toString().length)
                ).toUpperCase()}
                ’S PROFILE
              </h1>
              <div className="inventory_section">
                <div className="text-white">
                  <h5>KICKFLIP/WIPEOUT</h5>
                  <h6>
                    {' '}
                    <span className="text-yellow">{pieData1.data[1]}</span> Kickflips
                  </h6>
                  <h6>
                    {' '}
                    <span className="text-purple">{pieData1.data[0]}</span> Wipeouts
                  </h6>
                  <Pie
                    data={{
                      datasets: [
                        {
                          ...pieData1,
                          data:
                            pieData1.data[0] === 0 && pieData1.data[1] === 0
                              ? [1, 1]
                              : pieData1.data
                        }
                      ]
                    }}
                    style={{ height: '100px' }}
                  />
                </div>
                <div className="text-white">
                  <h5>WINS/LOSSES</h5>
                  <h6>
                    {' '}
                    <span className="text-green">{pieData2.data[1]}</span> Wins
                  </h6>
                  <h6>
                    {' '}
                    <span className="text-red">{pieData2.data[0]}</span> Losses
                  </h6>
                  <Pie
                    data={{
                      datasets: [
                        {
                          ...pieData2,
                          data:
                            pieData2.data[0] === 0 && pieData2.data[1] === 0
                              ? [1, 1]
                              : pieData2.data
                        }
                      ]
                    }}
                    style={{ height: '100px' }}
                  />
                </div>
              </div>
              <MiscStats stats={profile.response} />
              <div className="table_title_text text-white">
                <span style={{ paddingLeft: '10px' }}>ALL-TIME PNL BY TOKENS</span>
              </div>
              <PNL tokenData={profile.tokenInfo} pnl={true} />
            </div>
          )}
        </Box>
      </div>
      {loading && (
        <div className="loading-overlay">
          <div className="loading">
            <ClipLoader color="#36d7b7" />
          </div>
        </div>
      )}
    </>
  );
}
