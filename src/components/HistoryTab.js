export default function HistoryTab(props) {
  const data = ['Recent History', 'Your History'];
  return (
    <div className="tab_selector">
      {data.map((item, index) => (
        <span
          key={index}
          className={props.tab === index ? 'text-white selected_time' : 'text-white'}
          onClick={() => props.setTab(index)}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
