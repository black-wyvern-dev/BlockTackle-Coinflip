import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import polygonIcon from '../assets/img/Polygon2.svg';
import { DEV_GRIND_DECIMAL } from '../config';
const Row = ({ data, index, pnl }) => {
  return (
    <div className={index % 2 === 1 ? 'misc_row' : 'misc_row misc_row_odd'}>
      <div>
        <span className="text-white">{data.token}</span>
      </div>
      <div>
        <span className="text-white">{data.play}</span>
      </div>
      <div>
        <span className="text-white">{data.volume}</span>
      </div>
      <div>
        <span className="text-white">{data.winPercent}</span>
      </div>
      {pnl && (
        <div>
          <span className={data.pnl > 0 ? 'text-green' : 'text-red'}>
            {data.pnl > 0 ? '+' : ''}
            {data.pnl}
          </span>
        </div>
      )}
    </div>
  );
};
export default function PNL({ tokenData, pnl }) {
  const data = [
    {
      token: 'SOL',
      play: tokenData.SOL.count,
      volume: (tokenData.SOL.volume * 1.0) / LAMPORTS_PER_SOL,
      winPercent: `${tokenData.SOL.winRate.toFixed(3)}%`,
      pnl: (tokenData.SOL.pnl * 1.0) / LAMPORTS_PER_SOL
    },
    {
      token: 'GRIND',
      play: tokenData.GRIND.count,
      volume: (tokenData.GRIND.volume * 1.0) / DEV_GRIND_DECIMAL,
      winPercent: `${tokenData.GRIND.winRate.toFixed(3)}%`,
      pnl: (tokenData.GRIND.pnl * 1.0) / DEV_GRIND_DECIMAL
    }
  ];
  return (
    <>
      <div className="miscstats_section">
        <div className="table_box">
          <div className="pnl-header">
            <div className="text-blue">
              <span>TOKEN</span>
              <img src={polygonIcon} style={{ marginLeft: 3 }} alt="img" />
            </div>
            <div>PLAYS</div>
            <div>VOLUME</div>
            <div>WIN %</div>
            {pnl && <div>PNL</div>}
          </div>
          {data.map((item, index) => (
            <Row key={index} index={index} data={item} pnl={pnl} />
          ))}
        </div>
      </div>
    </>
  );
}
