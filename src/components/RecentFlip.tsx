import axios from 'axios';
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';

import TxCell from './TxCell';
import { Round, ResultType, TokenType, StatusType, FlipType } from '../contexts/types';
import { BACKEND_URL } from '../config';

export default function RecentFlip() {
  const [roundData, setRoundData] = useState<Round[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    setInitialLoading(true);

    fetchedRoundData();
    let itv = setInterval(fetchedRoundData, 2000);

    return () => {
      clearInterval(itv);
    };
  }, []);

  const fetchedRoundData = async () => {
    const data = await axios
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
      });
    if (!data) return;

    setInitialLoading(false);

    const rounds: Round[] = data.response.Items.map((item: any) => {
      return {
        id: item.id.S,
        address: item.wallet.S,
        flip_type: parseInt(item.flip_type.N) as FlipType,
        token: item.token.S as TokenType,
        amount: item.amount.N,
        result: item.result.S as ResultType,
        timestamp: new Date(parseInt(item.timestamp.N)),
        status: item.status.S as StatusType,
        signature: item.tx_hash.S
      };
    });

    setRoundData((_oldList: Round[]) => rounds);
  };

  return (
    <div className="recent_flip_table">
      {!initialLoading &&
        roundData.map((item, index) => <TxCell key={index} index={index} data={item} />)}
      {initialLoading && (
        <div className="loading">
          <ClipLoader color="#36d7b7" />
        </div>
      )}
    </div>
  );
}
