import React, { useState, useContext } from 'react';
import { context } from '../contexts/context';
import PolygonIcon from '../assets/img/Polygon.svg';
import PolygonIconUp from '../assets/img/Polygon_up.svg';

const useOutsideClick = (callback) => {
  const ref = React.useRef();

  React.useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref, callback]);

  return ref;
};

export default function SelectTokenBtn() {
  const { token, setToken } = useContext(context);
  const tokens = ['GRIND', 'SOL'];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(token);
  const toggling = () => setIsOpen(!isOpen);
  const onOptionClicked = (value) => () => {
    setSelectedOption(value);
    setIsOpen(false);
    setToken(value);
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  const ref = useOutsideClick(handleClickOutside);

  return (
    <div style={{ position: 'relative', zIndex: 10 }} ref={ref}>
      <div
        className={isOpen ? 'select_token_click select_token' : 'select_token'}
        onClick={toggling}
      >
        <span className={selectedOption ? 'text-yellow' : ''}>{selectedOption || 'SELECT'}</span>
        <img src={isOpen ? PolygonIconUp : PolygonIcon} alt="icon" />
      </div>
      {isOpen && (
        <div className="dropdown_list_container">
          <ul className="dropdown_list">
            {tokens.map((option, key) => (
              <li key={key} onClick={onOptionClicked(option)}>
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
