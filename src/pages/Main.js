import { useCallback, useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';

import KickFlipBtnIcon from '../assets/img/btn_kickflip.png';
import WipeOutBtnIcon from '../assets/img/btn_wipeout.png';
import kickflipLogo from '../assets/img/kickflip_logo.png';
import AlertBox from '../components/AlertBox';
import AmountChip from '../components/AmountChip';
import ChooseToken from '../components/ChooseToken';
import RecentFlip from '../components/RecentFlip';
import { context } from '../contexts/context';
import {
  checkBalance,
  checkTokenBalance,
  checkTokenVaultBalance,
  checkVaultBalance,
  playGame,
  playGameWithToken
} from '../contexts/helpers';
import Overlay from '../components/Overlay';

export default function Main({ props }) {
  const amountArr = ['0.1', '0.25', '0.5', '1', '2', '3', '5', '10'];
  const grindAmountArr = ['500', '1000', '2500', '5k', '10k', '20k', '50k', '100k'];

  const wallet = useWallet();
  const { token } = useContext(context);
  const { chipAmount, setChipAmount } = useContext(context);
  const [playing, setPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [lastFlip, setLastFlip] = useState(0);
  const [state, setState] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setChipAmount(null);
  }, [token]);

  const onFlip = useCallback(
    async (flip) => {
      if (playing) return;

      if (!token)
        return toast(<AlertBox text="You need to choose a token type before you can proceed." />);
      if (!chipAmount)
        return toast(<AlertBox text="You need to select a token amount before you can proceed." />);

        const deposit = chipAmount.replace('k', '000');
        console.log('token', token);
        console.log('flip', flip);
        console.log('chipAmount', deposit);

      if (token == 'SOL') {
        if (!(await checkBalance(wallet, deposit)))
          return toast(<AlertBox text="You have insufficient tokens. Please obtain more." />);

        if (!(await checkVaultBalance(wallet, deposit)))
          return toast(<AlertBox text="Game vault has insufficient tokens. Please wait." />);
      }
      if (token == 'GRIND') {
        if (!(await checkTokenBalance(wallet, token, deposit)))
          return toast(<AlertBox text="You have insufficient tokens. Please obtain more." />);

        if (!(await checkTokenVaultBalance(wallet, token, deposit)))
          return toast(<AlertBox text="Game vault has insufficient tokens. Please wait." />);
      }

      setLastFlip(flip);
      setState('processing');
      setPlaying(true);
      setShowOverlay(true);

      if (token == 'SOL')
        await playGame(
          wallet,
          flip,
          parseFloat(deposit),
          (txId) => {
            setState('win');
            toast(
              <AlertBox
                text={'Success. txHash=' + txId.slice(0, 10)}
                link={`https://solscan.io/tx/${txId}?cluster=devnet`}
              />
            );
          },
          (txId) => {
            setState('lose');
            toast(
              <AlertBox
                text={'Success. txHash=' + txId.slice(0, 10)}
                link={`https://solscan.io/tx/${txId}?cluster=devnet`}
              />
            );
          },
          (error) => {
            setState('failed');
            setErrorMsg(error?.message ?? JSON.stringify(error));
            toast(<AlertBox text={error?.message ?? JSON.stringify(error)} />);
          }
        );
      else
        await playGameWithToken(
          wallet,
          token,
          flip,
          parseInt(deposit),
          (txId) => {
            setState('win');
            toast(
              <AlertBox
                text={'Success. txHash=' + txId.slice(0, 10)}
                link={`https://solscan.io/tx/${txId}?cluster=devnet`}
              />
            );
          },
          (txId) => {
            setState('lose');
            toast(
              <AlertBox
                text={'Success. txHash=' + txId.slice(0, 10)}
                link={`https://solscan.io/tx/${txId}?cluster=devnet`}
              />
            );
          },
          (error) => {
            setState('failed');
            setErrorMsg(error?.message ?? JSON.stringify(error));
            toast(<AlertBox text={error?.message ?? JSON.stringify(error)} />);
          }
        );
      setPlaying(false);
    },
    [playing, wallet, chipAmount, token]
  );

  return (
    <div className="main-content">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <img
          src={kickflipLogo}
          alt={'kickflip'}
          loading="lazy"
          style={{ maxWidth: '100%' }}
          width={500}
        />

        {!wallet?.publicKey ? (
          <WalletModalProvider>
            <h5 className="connet_wallet_text">PLEASE CONNECT YOUR WALLET TO BEGIN.</h5>
            <div style={{ marginTop: '20px' }}>
              <WalletMultiButton />
            </div>
          </WalletModalProvider>
        ) : (
          <>
            <ChooseToken />
            {token && (
              <div className="chip_container">
                {(token == 'SOL' ? amountArr : grindAmountArr).map((item, key) => (
                  <AmountChip key={key} amount={item} />
                ))}
              </div>
            )}
            {!token && (
              <>
                <h6
                  className="text-white"
                  style={{ marginTop: '20px', fontSize: '15px', fontWeight: 'normal' }}
                >
                  Think you’ll pull off a sick <span className="text-green">KICKFLIP</span> or
                </h6>
                <h6 className="text-white" style={{ fontSize: '15px', fontWeight: 'normal' }}>
                  crash and burn into a gnarly <span className="text-green">WIPEOUT</span>?
                </h6>
              </>
            )}
            <div className="flip_btns">
              <div className="flip_btn" onClick={() => onFlip(0)}>
                <img src={KickFlipBtnIcon} alt="kick flip" />
                <span> KICKFLIP </span>
              </div>
              <div className="flip_btn" onClick={() => onFlip(1)}>
                <img src={WipeOutBtnIcon} alt="wipe out" />
                <span> WIPEOUT </span>
              </div>
            </div>
          </>
        )}

        <h6 className="yellow_small_txt" style={{ marginTop: '20px' }}>
          3% fees apply for every play.
        </h6>
        <h6 className="yellow_small_txt">Refer to the FAQ for more information.</h6>
        <RecentFlip />
        <h6 className="text-green" style={{ margin: '20px 0px', fontSize: '14px' }}>
          Please kickflip responsibly!
        </h6>
      </Box>
      {showOverlay && (
        <Overlay
          status={state}
          flip={lastFlip}
          type={token}
          amount={chipAmount}
          onClose={() => setShowOverlay(false)}
          onRetry={() => onFlip(lastFlip)}
          message={errorMsg}
        />
      )}
    </div>
  );
}
