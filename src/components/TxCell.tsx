import { useMemo } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import { FlipType, ResultType, Round, TokenType } from '../contexts/types';
import { fToNow } from '../utils/formatTime';
import { DEV_GRIND_DECIMAL } from '../config';

export default function TxCell(props: { index: number; data: Round }) {
  const time = useMemo(() => {
    const timestamp = new Date(props.data.timestamp);
    return fToNow(timestamp);
  }, [props.data]);

  const address = useMemo(() => {
    const address = props.data.address;
    return address.slice(0, 4) + '...' + address.slice(-4);
  }, [props.data]);

  const decimal = useMemo(() => {
    if (props.data.token === TokenType.SOL) return LAMPORTS_PER_SOL;
    else if (props.data.token === TokenType.GRIND) return DEV_GRIND_DECIMAL;
    else return 1;
  }, [props.data]);

  return (
    <div className={props.index % 2 === 0 ? 'tx_cell' : 'tx_cell tx_cell_odd'}>
      <div className="cell_info left">
        <span className="text-blue">{`${address}`}</span>
        <span className="text-white">
          {props.data.flip_type === FlipType.KICKFLIP ? 'kickflipped' : 'wipedout'}
        </span>
        <span className="text-yellow">{`${(props.data.amount * 1.0) / decimal} ${
          props.data.token
        }`}</span>
        <span className="text-white">and</span>
        <span className={props.data.result === ResultType.WIN ? 'text-green' : 'text-red'}>
          {props.data.result === ResultType.WIN ? 'doubled' : 'lost'}.
        </span>
      </div>
      <div className="cell_info right">
        <span className="text-white">{time}</span>
      </div>
    </div>
  );
}
