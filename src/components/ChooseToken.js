import { useContext, useMemo } from 'react';
import { context } from '../contexts/context';
import IconInfo from '../assets/img/icon_info.svg';
import SelectTokenBtn from './SelectTokenBtn';

export default function ChooseToken() {
  const { token } = useContext(context);
  const minFlipAmount = useMemo(() => {
    if (token == 'SOL') return '0.1';
    if (token == 'GRIND') return '500';
    return '0';
  }, [token]);
  const maxFlipAmount = useMemo(() => {
    if (token == 'SOL') return '10';
    if (token == 'GRIND') return '100k';
    return '0';
  }, [token]);

  return (
    <div className="choose_token">
      <h3>CHOOSE A TOKEN</h3>
      <img style={{ padding: '0px 10px' }} src={IconInfo} alt="icon info" />
      <SelectTokenBtn />
      <div className="normal_font" style={{ marginLeft: '10px' }}>
        <div>
          Min. Flip: <span className="text-green">{minFlipAmount}</span>
        </div>
        <div>
          Max. Flip: <span className="text-green">{maxFlipAmount}</span>
        </div>
      </div>
    </div>
  );
}
