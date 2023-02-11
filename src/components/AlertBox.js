import WarningIcon from '../assets/img/warning_icon.png';
export default function AlertBox({ text, link }) {
  return (
    <div className="alert_box">
      <div className="warning_icon">
        <img src={WarningIcon} alt="warning" />
      </div>
      <div className="warning_text">
        {link ? (
          <a href={link} target="#">
            {text}
          </a>
        ) : (
          text
        )}
      </div>
    </div>
  );
}
