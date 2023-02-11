import { useMemo } from 'react';

const Row = ({ text, num, index }) => {
  return (
    <div className={index % 2 === 1 ? 'misc_row' : 'misc_row misc_row_odd'}>
      <div>
        <span className="text-yellow">{text}</span>
      </div>
      <div>
        <span className="text-white">{num}</span>
      </div>
    </div>
  );
};
export default function MiscStats({ stats }) {
  const data = useMemo(() => {
    return [
      {
        text: 'Top Win Streak',
        num: stats.topWinStreak
      },
      {
        text: 'Top Lose Streak',
        num: stats.topLoseStreak
      },
      {
        text: 'Kickflips Won',
        num: stats.kickWon
      },
      {
        text: 'Kickflips Lost',
        num: stats.kickLost
      },
      {
        text: 'Wipeouts Won',
        num: stats.wipeWon
      },
      {
        text: 'Wipeouts Lost',
        num: stats.wipeLost
      },
      {
        text: 'Luckiest Token',
        num: stats.luckToken
      },
      {
        text: 'Unluckiest Token',
        num: stats.unluckToken
      }
    ];
  }, [stats]);

  return (
    <div className="miscstats_section">
      <div className="table_box">
        <div className="text-white">MISC.STATS</div>
        {data.map((item, index) => (
          <Row key={index} index={index} text={item.text} num={item.num} />
        ))}
      </div>
    </div>
  );
}
