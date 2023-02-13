import axios from 'axios';
import ReactGA from 'react-ga';
import { useContext, useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Box from '@mui/material/Box';

import TimeSelector from '../components/TimeSelector';
import PNL from '../components/PNL';
import Streaks from '../components/Streaks';
import { BACKEND_URL } from '../config';
import { context } from '../contexts/context';

ChartJS.register(ArcElement, Tooltip, Legend);

const DEFAULT_STREAK_DATA = {
  day: {
    topWinners: [],
    topLosers: [],
    tokenInfo: {
      SOL: { plays: 0, volume: 0, winRate: 0 },
      GRIND: { plays: 0, volume: 0, winRate: 0 }
    }
  },
  week: {
    topWinners: [],
    topLosers: [],
    tokenInfo: {
      SOL: { plays: 0, volume: 0, winRate: 0 },
      GRIND: { plays: 0, volume: 0, winRate: 0 }
    }
  },
  month: {
    topWinners: [],
    topLosers: [],
    tokenInfo: {
      SOL: { plays: 0, volume: 0, winRate: 0 },
      GRIND: { plays: 0, volume: 0, winRate: 0 }
    }
  }
};

export default function LeaderBoard({ props }) {
  const [topPlayerPeriod, setTopPlayerPeriod] = useState('day');
  const [tokenPeriod, setTokenPeriod] = useState('day');
  const [topPlayers, setTopPlayers] = useState(DEFAULT_STREAK_DATA);
  const [loadingCount, setLoadingCount] = useState(2);
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

  const { setPageOpenedTimestamp } = useContext(context);

  useEffect(() => {
    setLoadingCount(2);
    fetchStatistics();
    fetchStreaks();
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
      label: 'Stay at leaderboard'
    });
  }

  function gaTriggerNavAction() {
    ReactGA.event({
      category: 'Navigation',
      action: 'LeaderboardPageClicked',
      nonInteraction: true
    });
  }

  const fetchStreaks = () => {
    axios
      .get(`${BACKEND_URL}/leaderboard/top_players`)
      .then((res) => {
        // console.log('==> Top players response');
        // console.log(res.data);
        return res.data;
      })
      .catch((e) => {
        return DEFAULT_STREAK_DATA;
      })
      .then((data) => {
        setLoadingCount((count) => count - 1);
        setTopPlayers((_oldData) => data.response);
      });
  };

  const fetchStatistics = () => {
    axios
      .get(`${BACKEND_URL}/recent_history`)
      .then((res) => {
        // console.log('==> Recent history response');
        // console.log(res.data);
        return res.data;
      })
      .catch((e) => {
        console.log('==> Recent history error response');
        console.log(e);
        return;
      })
      .then((data) => {
        setLoadingCount((count) => count - 1);
        let cnt_kick = 0,
          cnt_wipe = 0,
          cnt_win = 0,
          cnt_lose = 0;

        data.response.Items.map((item) => {
          if (item.flip_type.N == '1') cnt_wipe++;
          else cnt_kick++;

          if (item.result.S == 'win') cnt_win++;
          else cnt_lose++;
        });

        setPieData1((oldData) => {
          return {
            ...oldData,
            data: [cnt_wipe, cnt_kick]
          };
        });

        setPieData2((oldData) => {
          return {
            ...oldData,
            data: [cnt_lose, cnt_win]
          };
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
          <div style={{ width: '100%' }}>
            <h1 className="caption_text text-white">LEADERBOARDS</h1>
            <div className="leaderboard_section">
              <div className="text-white leaderboard_left" style={{ textAlign: 'center' }}>
                <h5>KICKFLIP/WIPEOUT</h5>
                <h6> Last 100 Plays</h6>
                <Pie data={{ datasets: [pieData1] }} />
                <h5 style={{ marginTop: '30px' }}>WINS/LOSSES</h5>
                <h6> Last 100 Plays</h6>
                <Pie data={{ datasets: [pieData2] }} />
              </div>
              <div className="leaderboard_right">
                <TimeSelector
                  title="STREAKS"
                  period={topPlayerPeriod}
                  setPeriod={setTopPlayerPeriod}
                />
                <div className="streaks_table_section">
                  <div style={{ width: '100%', paddingRight: '10px' }}>
                    <Streaks winning={true} players={topPlayers[topPlayerPeriod].topWinners} />
                  </div>
                  <div style={{ width: '100%' }}>
                    <Streaks players={topPlayers[topPlayerPeriod].topLosers} />
                  </div>
                </div>
                <TimeSelector title="Tokens" period={tokenPeriod} setPeriod={setTokenPeriod} />
                <PNL tokenData={topPlayers[tokenPeriod].tokenInfo} pnl={false} />
              </div>
            </div>
          </div>
        </Box>
      </div>
      {loadingCount > 0 && (
        <div className="loading-overlay">
          <div className="loading">
            <ClipLoader color="#36d7b7" />
          </div>
        </div>
      )}
    </>
  );
}
