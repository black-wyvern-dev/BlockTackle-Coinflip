import { useEffect, useState } from 'react';
import Faq from './Faq';
import Initial from './Initial';
import CloseIcon from '../../assets/img/icon_close.png';
import { APP_VERSION } from '../../config';

export default function Modals(props) {
  const [hideNext, setHideNext] = useState(false);

  useEffect(() => {
    const savedHide = localStorage.getItem('hideFromNext');
    const savedVersion = localStorage.getItem('appVersion');
    if (savedVersion !== APP_VERSION) {
      localStorage.setItem('appVersion', APP_VERSION);
      localStorage.setItem('hideFromNext', false);
      return;
    }

    if (props.isInitial && savedHide === 'true') {
      props.closeModal();
    }
  }, []);

  const handleHideNextChanged = (e) => {
    setHideNext(e.target.checked);
    localStorage.setItem('hideFromNext', e.target.checked);
  };

  return (
    <div className="overlay">
      {props.isInitial ? (
        <>
          <div className="modal_section">
            <Initial />
            <div className="modal_confirm">
              <input
                type="checkbox"
                style={{ marginRight: '10px' }}
                value={hideNext}
                onChange={handleHideNextChanged}
              />
              <h5 className="faq_answer">Don't show again until the next update</h5>
            </div>
            <div className="modal_close" onClick={() => props.closeModal()}>
              <img src={CloseIcon} alt="close" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="faq_section">
            <h1 className="caption_text text-white">FREQUENTLY ASKED QUESTIONS</h1>
            <Faq />
          </div>
          <div className="faq_close" onClick={() => props.closeModal()}>
            <img src={CloseIcon} alt="close" />
          </div>
        </>
      )}
    </div>
  );
}
