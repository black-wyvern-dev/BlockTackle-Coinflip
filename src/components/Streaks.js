import { useMemo } from 'react';

const Row = ({ text, num, index, winning }) => {
  return (
    <div className={index % 2 === 1 ? 'misc_row' : 'misc_row misc_row_odd'}>
      <div>
        <span className="text-blue">{text}</span>
      </div>
      <div>
        <span className={winning ? 'text-green' : 'text-red'}>{num}</span>
      </div>
    </div>
  );
};
export default function Streaks({ players = [], winning }) {
  const title = winning ? 'WINNING' : 'LOSING';

  const data = useMemo(() => {
    return players.map((player) => {
      return {
        text: player.address.slice(0, 4) + '...' + player.address.slice(-4),
        num: `${player.count}x ${winning ? 'Wins' : 'Losses'}`
      };
    });
  }, [players]);

  return (
    <div className="miscstats_section">
      <div className="table_box">
        <div className="text-white">{'TOP 5 ' + title + ' STREAKS'}</div>
        {data.map((item, index) => (
          <Row key={index} index={index} text={item.text} num={item.num} winning={winning} />
        ))}
      </div>
    </div>
  );
}
