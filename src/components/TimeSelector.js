export default function TimeSelector({ title, period, setPeriod }) {
  const data = ['24H', '1W', '1M'];
  const period_data = ['day', 'week', 'month'];

  return (
    <div className="tab_selector">
      <h5 style={{ marginRight: '15px' }}>{title}</h5>
      {period_data.map((item, index) => (
        <span
          key={index}
          className={period === item ? 'text-white selected_time' : 'text-white'}
          onClick={() => {
            setPeriod(item);
          }}
        >
          {data[index]}
        </span>
      ))}
    </div>
  );
}
