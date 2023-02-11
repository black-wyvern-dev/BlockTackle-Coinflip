import { useEffect, useState } from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import CloseIcon from '../assets/img/icon_close.png';
import Video from './Video';
import { FlipType, ResultType } from '../contexts/types';

export default function Overlay({ status, flip, type, amount, onClose, onRetry, message }) {
  const [movie, setMovie] = useState('/movie/processing.webm');
  const [replay, setReplay] = useState(true);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (
      (status === ResultType.WIN && flip === FlipType.KICKFLIP) ||
      (status === ResultType.LOSE && flip === FlipType.WIPEOUT)
    ) {
      setMovie('/movie/win.webm');
      setReplay(true);
    } else if (
      (status === ResultType.WIN && flip === FlipType.WIPEOUT) ||
      (status === ResultType.LOSE && flip === FlipType.KICKFLIP)
    ) {
      setMovie('/movie/lose.webm');
      setReplay(true);
    } else {
      setMovie('/movie/processing.webm');
      setReplay(true);
    }
  }, [status]);

  return (
    <div className="overlay">
      <div className="overlay_content">
        <div className="movie">
          <Video type="video/webm" source={movie} replay={replay} />
        </div>
        {(status === 'processing' || status === 'failed') && (
          <>
            <div className="status">
              <h3>Attempting to kickflip</h3>
              <p>Confirming deposit...</p>
            </div>
            <div className="result">
              <h3 className="">
                {' '}
                <span>{flip ? 'WIPEOUT' : 'KICKFLIP'}</span> for <span>{amount + ' ' + type}</span>{' '}
              </h3>
              {status === 'failed' && (
                <div className="error">
                  <p>{message ?? 'Unknown Error'}</p>
                  <div className="retry_btn" onClick={onRetry}>
                    <span>RETRY</span>
                  </div>
                </div>
              )}
              <h5 className=""> {'Solana network conditions may affect kickflipping times.'} </h5>
            </div>
          </>
        )}

        {status === 'lose' && (
          <>
            <div className="result">
              <div className="error">
                <h3 className="">
                  {flip
                    ? 'WRONG CHOICE! YOUR SKATER LANDED A KICKFLIP!'
                    : 'OUCH! YOUR SKATER WIPED OUT!'}
                  <br />
                </h3>
                <span>-{amount + ' ' + type}</span>
                <div className="retry_btn" style={{ background: 'white' }} onClick={onClose}>
                  <span>CLOSE</span>
                </div>
              </div>
            </div>
          </>
        )}

        {status === 'win' && (
          <>
            <div className="result">
              <div className="win">
                <h3 className="">
                  {flip ? (
                    <>
                      YOU CALLED IT! YOUR SKATER <span>WIPED OUT!</span>
                    </>
                  ) : (
                    <>
                      CONGRATS, YOUR SKATER DID A <span>KICKFLIP!</span>
                    </>
                  )}
                  <br />
                </h3>
                <span>+{amount + ' ' + type}</span>
                <div className="retry_btn" onClick={onClose}>
                  <span>CLOSE</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="faq_close" onClick={onClose}>
        <img src={CloseIcon} alt="close" />
      </div>
      {status === 'win' && <Confetti width={width} height={height} />}
    </div>
  );
}
