import { useContext, useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import Box from '@mui/material/Box';

import HistoryFlip from '../components/HistoryFlip';
import HistoryTab from '../components/HistoryTab';
import { context } from '../contexts/context';
import { BACKEND_URL } from '../config';

export default function LeaderBoard({ props }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [roundData, setRoundData] = useState([]);
  const [myRounds, setMyRounds] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [myLoading, setMyLoading] = useState(true);s

  const wallet = useWallet();
  const { setPageOpenedTimestamp } = useContext(context);

  useEffect(() => {
    setRecentLoading(true);
    fetchHistory();
    gaTriggerNavAction();
    setPageOpenedTimestamp(Date.now());
    return () => {
      setPageOpenedTimestamp((oldDate) => {
        gaTriggerStayTiming(Date.now() - oldDate);
      });
    };
  }, []);

  function gaTriggerStayTiming(duration) {
    ReactGA.timing({
      category: 'Time Measurement',
      variable: 'spentTime',
      value: duration, // in milliseconds
      label: 'Stay at history'
    });
  }

  function gaTriggerNavAction() {
    ReactGA.event({
      category: 'Navigation',
      action: 'HistoryPageClicked',
      nonInteraction: true
    });
  }

  useEffect(() => {
    if (!wallet.publicKey) {
      setMyLoading(false);
      return;
    }
    setMyLoading(true);
    fetchMyHistory(wallet.publicKey.toBase58());
  }, [wallet]);

  const fetchHistory = async () => {
    const data = await axios
      .get(`${BACKEND_URL}/history`)
      .then((res) => {
        // console.log('==> History response');
        // console.log(res.data);
        return res.data;
      })
      .catch((e) => {
        console.log('==> History error response');
        console.log(e);
        return;
      });

    setRecentLoading(false);
    if (!data) return;

    const rounds = data.response.Items.map((item) => {
      return {
        id: item.id.S,
        address: item.wallet.S,
        flip_type: parseInt(item.flip_type.N),
        token: item.token.S,
        amount: item.amount.N,
        result: item.result.S,
        timestamp: new Date(parseInt(item.timestamp.N)),
        status: item.status.S,
        signature: item.tx_hash.S
      };
    });

    setRoundData((_oldList) => rounds);
  };

  const fetchMyHistory = async (address) => {
    const data = await axios
      .get(`${BACKEND_URL}/my_history/${address}`)
      .then((res) => {
        // console.log('==> My history response');
        // console.log(res.data);
        return res.data;
      })
      .catch((e) => {
        console.log('==> My history error response');
        console.log(e);
        return;
      });

    setMyLoading(false);
    if (!data) return;

    const rounds = data.response.Items.map((item) => {
      return {
        id: item.id.S,
        address: item.wallet.S,
        flip_type: parseInt(item.flip_type.N),
        token: item.token.S,
        amount: item.amount.N,
        result: item.result.S,
        timestamp: new Date(parseInt(item.timestamp.N)),
        status: item.status.S,
        signature: item.tx_hash.S
      };
    });

    setMyRounds((_oldList) => rounds);
  };

  return (
    <div className="profile-content">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <div style={{ width: '100%' }}>
          <h1 className="caption_text text-white">HISTORY</h1>
          <div className="history_section">
            <HistoryTab tab={selectedTab} setTab={setSelectedTab} />
            <HistoryFlip
              data={selectedTab === 0 ? roundData : myRounds}
              loading={selectedTab === 0 ? recentLoading : myLoading}
            />
          </div>
        </div>
      </Box>
    </div>
  );
}
