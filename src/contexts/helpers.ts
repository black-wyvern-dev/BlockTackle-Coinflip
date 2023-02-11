import axios from 'axios';
import { Program, web3 } from '@project-serum/anchor';
import { AccountInfo, PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';

import IDL from './anchor_idl/idl/coinflip.json';
import { GlobalPool, PlayerPool, TokenInfo, TokenType } from './types';
import { BACKEND_URL, DEV_GRIND_DECIMAL, DEV_GRIND_MINT, SLACK_NOTIFY_URL } from '../config';

export const solConnection = new web3.Connection(web3.clusterApiUrl('devnet'));

const ASSOCIATED_TOKEN_PROGRAM_ID: PublicKey = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
);
const PROGRAM_ID = '7ttfENVhNwb21KjZiLHgXLsX2sC1rKoJgnTVL4wb54t1';
const GLOBAL_AUTHORITY_SEED = 'global-authority';
const VAULT_AUTHORITY_SEED = 'vault-authority';
const TOKEN_INFO_SEED = "token-info";
const PLAYER_POOL_SIZE = 112;
const LAMPORTS = 1000000000;

export const getUserPoolState = async (userAddress: PublicKey): Promise<PlayerPool | null> => {
  if (!userAddress) return null;
  let cloneWindow: any = window;
  let provider = new anchor.Provider(
    solConnection,
    cloneWindow['solana'],
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

  let playerPoolKey = await PublicKey.createWithSeed(userAddress, 'player-pool', program.programId);
  console.log('Player Pool: ', playerPoolKey.toBase58());
  try {
    let poolState = await program.account.playerPool.fetch(playerPoolKey);
    return poolState as unknown as PlayerPool;
  } catch {
    return null;
  }
};

export const getGlobalState = async (): Promise<GlobalPool | null> => {
  let cloneWindow: any = window;
  let provider = new anchor.Provider(
    solConnection,
    cloneWindow['solana'],
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

  const [globalAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );
  try {
    let globalState = await program.account.globalPool.fetch(globalAuthority);
    return globalState as unknown as GlobalPool;
  } catch {
    return null;
  }
};

export const getTokenInfo = async (
  mint: PublicKey,
): Promise<TokenInfo | null> => {
  let cloneWindow: any = window;
  let provider = new anchor.Provider(
    solConnection,
    cloneWindow['solana'],
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

  const [tokenInfoAccount] = await PublicKey.findProgramAddress(
    [Buffer.from(TOKEN_INFO_SEED), mint.toBuffer()],
    program.programId
  );
  try {
    let tokenInfo = await program.account.tokenInfo.fetch(tokenInfoAccount);
    return tokenInfo as unknown as TokenInfo;
  } catch {
    return null;
  }
}

export const initUserPoolTx = async (userAddress: PublicKey, program: Program) => {
  let playerPoolKey = await PublicKey.createWithSeed(userAddress, 'player-pool', program.programId);
  console.log(playerPoolKey.toBase58());

  let tx = new Transaction();

  let ix = SystemProgram.createAccountWithSeed({
    fromPubkey: userAddress,
    basePubkey: userAddress,
    seed: 'player-pool',
    newAccountPubkey: playerPoolKey,
    lamports: await solConnection.getMinimumBalanceForRentExemption(PLAYER_POOL_SIZE),
    space: PLAYER_POOL_SIZE,
    programId: program.programId
  });

  tx.add(ix);
  tx.add(
    program.instruction.initializePlayerPool({
      accounts: {
        owner: userAddress,
        playerPool: playerPoolKey
      },
      instructions: [],
      signers: []
    })
  );

  return tx;
};

export const createPlayGameTx = async (
  userAddress: PublicKey,
  setNum: number,
  deposit: number,
  program: Program
) => {
  const [globalAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );
  console.log('GlobalAuthority: ', globalAuthority.toBase58());

  const [rewardVault] = await PublicKey.findProgramAddress(
    [Buffer.from(VAULT_AUTHORITY_SEED)],
    program.programId
  );
  console.log('RewardVault: ', rewardVault.toBase58());

  let playerPoolKey = await PublicKey.createWithSeed(userAddress, 'player-pool', program.programId);
  console.log(playerPoolKey.toBase58());

  const state = await getGlobalState();
  if (!state) return null;

  let tx = new Transaction();
  let poolAccount = await solConnection.getAccountInfo(playerPoolKey);
  if (poolAccount === null || poolAccount.data === null) {
    console.log('init User Pool');
    let tx1 = await initUserPoolTx(userAddress, program);
    tx.add(tx1);
  }

  tx.add(
    program.instruction.playGame(new anchor.BN(setNum), new anchor.BN(deposit * LAMPORTS), {
      accounts: {
        owner: userAddress,
        playerPool: playerPoolKey,
        globalAuthority,
        rewardVault: rewardVault,
        loyaltyWallet: state.loyaltyWallet,
        systemProgram: SystemProgram.programId
      },
      signers: []
    })
  );

  return tx;
};

export const createClaimTx = async (userAddress: PublicKey, player: PublicKey, program: Program) => {

  const [globalAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );
  console.log('GlobalAuthority: ', globalAuthority.toBase58());

  const [rewardVault] = await PublicKey.findProgramAddress(
    [Buffer.from(VAULT_AUTHORITY_SEED)],
    program.programId
  );

  let playerPoolKey = await PublicKey.createWithSeed(
    player,
    "player-pool",
    program.programId,
  );
  console.log(playerPoolKey.toBase58());
  let tx = new Transaction();

  console.log("===> Claiming The Reward");
  tx.add(program.instruction.claimReward(
    {
      accounts: {
        payer: userAddress,
        player,
        playerPool: playerPoolKey,
        globalAuthority,
        rewardVault: rewardVault,
        systemProgram: SystemProgram.programId,
        instructionSysvarAccount: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY
      }
    }));

  return tx;
}

export const playGame = async (
  wallet: WalletContextState,
  setValue: number,
  deposit: number,
  onWin: Function,
  onLose: Function,
  onFailed: Function
) => {
  if (!wallet.publicKey) return;

  try {
    let cloneWindow: any = window;
    let provider = new anchor.Provider(
      solConnection,
      cloneWindow['solana'],
      anchor.Provider.defaultOptions()
    );
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    // const userPool = await getUserPoolState(wallet.publicKey);
    // const pending = userPool?.claimableReward ?? 0;

    // if (pending > 0) {
    //   onFailed('There is pending reward. Should wait until processed');
    //   return;

    // console.log('Claiming pending reward!!');

    // const tx = await createClaimTx(wallet.publicKey, wallet.publicKey, program);
    // if (!tx) return;
    // let txHash = await wallet.sendTransaction(tx, solConnection);
    // await solConnection.confirmTransaction(txHash, 'confirmed');

    // await new Promise((resolve, reject) => {
    //   solConnection.onAccountChange(wallet.publicKey!, (data: AccountInfo<Buffer> | null) => {
    //     if (!data) reject();
    //     resolve(true);
    //   });
    // });
    // };

    const tx = await createPlayGameTx(wallet.publicKey, setValue, deposit, program);
    if (!tx) return;

    let txHash = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txHash, 'confirmed');

    axios
      .post(`${BACKEND_URL}/claim`, {
        wallet: wallet.publicKey.toBase58(),
        signature: txHash,
      })
      .then((res) => {
        console.log('==> Claim response');
        console.log(res.data);
      })
      .catch((e) => {
        console.log('==> Claim error response');
        console.log(e);
      })

    await new Promise((resolve, reject) => {
      solConnection.onAccountChange(wallet.publicKey!, (data: AccountInfo<Buffer> | null) => {
        if (!data) reject();
        resolve(true);
      });
    });
    const lastPlay = await getUserPoolState(wallet.publicKey);
    if (!lastPlay) throw new Error('User pool does not created');

    console.log('Success. txHash=' + txHash);
    lastPlay?.gameData.rewardAmount.toNumber() > 0 ? onWin(txHash) : onLose(txHash);
  } catch (e) {
    console.log(e);
    onFailed(e);
  }
};

export const createPlayGameWithTokenTx = async (userAddress: PublicKey, mint: PublicKey, setNum: number, deposit: number, program: Program) => {
  const [globalAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );
  console.log('GlobalAuthority: ', globalAuthority.toBase58());

  const rewardVault = await getAssociatedTokenAccount(globalAuthority, mint);
  console.log('RewardVault: ', rewardVault.toBase58());

  let playerPoolKey = await PublicKey.createWithSeed(
    userAddress,
    "player-pool",
    program.programId,
  );
  console.log(playerPoolKey.toBase58());

  const [tokenInfo] = await PublicKey.findProgramAddress(
    [Buffer.from(TOKEN_INFO_SEED), mint.toBuffer()],
    program.programId
  );

  const userTokenAccount = await getAssociatedTokenAccount(userAddress, mint);

  const state = await getGlobalState();
  if (!state) return;

  const loyaltyTokenAccount = await getAssociatedTokenAccount(state.loyaltyWallet, mint);

  let tx = new Transaction();
  let poolAccount = await solConnection.getAccountInfo(playerPoolKey);
  if (poolAccount === null || poolAccount.data === null) {
    console.log('init User Pool');
    let tx1 = await initUserPoolTx(userAddress, program);
    tx.add(tx1)
  }

  tx.add(program.instruction.playGameWithToken(
    new anchor.BN(setNum), new anchor.BN(deposit), {
    accounts: {
      owner: userAddress,
      playerPool: playerPoolKey,
      globalAuthority,
      mint,
      tokenInfo,
      rewardVault: rewardVault,
      userTokenAccount,
      loyaltyWallet: state.loyaltyWallet,
      loyaltyTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    },
    signers: [],
  }));

  return tx;
}

export const createClaimWithTokenTx = async (userAddress: PublicKey, player: PublicKey, mint: PublicKey, program: Program) => {
  const [globalAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );
  console.log('GlobalAuthority: ', globalAuthority.toBase58());

  const rewardVault = await getAssociatedTokenAccount(globalAuthority, mint);

  let playerPoolKey = await PublicKey.createWithSeed(
    player,
    "player-pool",
    program.programId,
  );
  console.log(playerPoolKey.toBase58());

  const [tokenInfo] = await PublicKey.findProgramAddress(
    [Buffer.from(TOKEN_INFO_SEED), mint.toBuffer()],
    program.programId
  );

  const userTokenAccount = await getAssociatedTokenAccount(userAddress, mint);

  let tx = new Transaction();

  console.log("===> Claiming The Token Reward");
  tx.add(program.instruction.claimRewardWithToken(
    {
      accounts: {
        payer: userAddress,
        player,
        playerPool: playerPoolKey,
        globalAuthority,
        mint,
        tokenInfo,
        rewardVault: rewardVault,
        userTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      }
    }));

  return tx;
}

export const playGameWithToken = async (
  wallet: WalletContextState,
  token: string,
  setValue: number,
  chipAmount: number,
  onWin: Function,
  onLose: Function,
  onFailed: Function
) => {
  if (!wallet.publicKey) return;

  let mint: PublicKey;
  let deposit: number = chipAmount;

  if (token == 'GRIND') {
    mint = DEV_GRIND_MINT;
    deposit *= DEV_GRIND_DECIMAL;
  } else {
    onFailed('Unknown Token');
    return;
  }

  try {
    let cloneWindow: any = window;
    let provider = new anchor.Provider(
      solConnection,
      cloneWindow['solana'],
      anchor.Provider.defaultOptions()
    );
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    const tx = await createPlayGameWithTokenTx(wallet.publicKey, mint, setValue, deposit, program);
    if (!tx) return;

    let txHash = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txHash, 'confirmed');

    axios
      .post(`${BACKEND_URL}/claim`, {
        wallet: wallet.publicKey.toBase58(),
        signature: txHash,
        token,
      })
      .then((res) => {
        console.log('==> Claim token response');
        console.log(res.data);
      })
      .catch((e) => {
        console.log('==> Claim token error response');
        console.log(e);
      })

    await new Promise((resolve, reject) => {
      solConnection.onAccountChange(wallet.publicKey!, (data: AccountInfo<Buffer> | null) => {
        if (!data) reject();
        resolve(true);
      });
    });
    const lastPlay = await getUserPoolState(wallet.publicKey);
    if (!lastPlay) throw new Error('User pool does not created');

    console.log('Success. txHash=' + txHash);
    lastPlay?.gameData.rewardAmount.toNumber() > 0 ? onWin(txHash) : onLose(txHash);
  } catch (e) {
    console.log(e);
    onFailed(e);
  }
};

export const checkBalance = async (
  wallet: WalletContextState,
  balance: number
): Promise<boolean> => {
  if (!wallet.publicKey) return false;

  try {
    console.log('Fetching wallet balance ...');
    const curBalance = await solConnection.getBalance(wallet.publicKey, 'confirmed');
    if (curBalance > balance * 1e9 + 10000) return true;
  } catch (e) {
    console.log(e);
  }
  return false;
};

export const checkVaultBalance = async (
  wallet: WalletContextState,
  balance: number
): Promise<boolean> => {
  if (!wallet.publicKey) return false;

  try {
    console.log('Fetching vault balance ...');

    const [rewardVault] = await PublicKey.findProgramAddress(
      [Buffer.from(VAULT_AUTHORITY_SEED)],
      new PublicKey(PROGRAM_ID),
    );
    console.log('RewardVault: ', rewardVault.toBase58());

    const curBalance = await solConnection.getBalance(rewardVault, 'confirmed');
    if (curBalance > balance * 1e9 + 10000) return true;

    axios
      .post(`${SLACK_NOTIFY_URL}`, {
        solVault: rewardVault.toBase58(),
        text: "Treasury balance is insufficient",
      })
      .then((res) => {
        console.log('==> Notify slack insufficient sol vault balance');
        console.log(res.data);
      })
      .catch((e) => {
        console.log('==> Notify slack insufficient error response');
        console.log(e);
      })
  } catch (e) {
    console.log(e);
  }
  return false;
};

export const checkTokenBalance = async (
  wallet: WalletContextState,
  token: TokenType,
  balance: number
): Promise<boolean> => {
  if (!wallet.publicKey) return false;

  let mint, decimal;
  if (token === TokenType.GRIND) { mint = DEV_GRIND_MINT; decimal = DEV_GRIND_DECIMAL }
  else return false;

  try {
    console.log('Fetching wallet token balance ...');
    const tokenAccount = await getAssociatedTokenAccount(wallet.publicKey, mint);
    const curBalance = await solConnection.getTokenAccountBalance(tokenAccount, 'confirmed');
    console.log(curBalance.value.uiAmount, balance, (curBalance?.value?.uiAmount ?? 0) > balance);
    if ((curBalance.value.uiAmount ?? 0) > balance) return true;
  } catch (e) {
    console.log(e);
  }
  return false;
};

export const checkTokenVaultBalance = async (
  wallet: WalletContextState,
  token: TokenType,
  balance: number
): Promise<boolean> => {
  if (!wallet.publicKey) return false;

  let mint, decimal;
  if (token === TokenType.GRIND) { mint = DEV_GRIND_MINT; decimal = DEV_GRIND_DECIMAL }
  else return false;

  const [globalAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    new PublicKey(PROGRAM_ID)
  );
  console.log('GlobalAuthority: ', globalAuthority.toBase58());

  const rewardVault = await getAssociatedTokenAccount(globalAuthority, mint);
  console.log('RewardVault: ', rewardVault.toBase58());

  try {
    console.log('Fetching wallet token vault balance ...');
    const curBalance = await solConnection.getTokenAccountBalance(rewardVault, 'confirmed');
    console.log(curBalance.value.uiAmount, balance, (curBalance?.value?.uiAmount ?? 0) > balance);
    if ((curBalance.value.uiAmount ?? 0) > balance) return true;

    axios
      .post(`${SLACK_NOTIFY_URL}`, {
        grindVault: rewardVault.toBase58(),
        text: "Treasury balance is insufficient",
      })
      .then((res) => {
        console.log('==> Notify slack insufficient sol vault balance');
        console.log(res.data);
      })
      .catch((e) => {
        console.log('==> Notify slack insufficient error response');
        console.log(e);
      })
  } catch (e) {
    console.log(e);
  }
  return false;
};

const getAssociatedTokenAccount = async (
  ownerPubkey: PublicKey,
  mintPk: PublicKey
): Promise<PublicKey> => {
  let associatedTokenAccountPubkey = (
    await PublicKey.findProgramAddress(
      [
        ownerPubkey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mintPk.toBuffer() // mint address
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
  return associatedTokenAccountPubkey;
};

export const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
  walletAddress: anchor.web3.PublicKey,
  splTokenMintAddress: anchor.web3.PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false
    }
  ];
  return new anchor.web3.TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([])
  });
};

export const getATokenAccountsNeedCreate = async (
  connection: anchor.web3.Connection,
  walletAddress: anchor.web3.PublicKey,
  owner: anchor.web3.PublicKey,
  nfts: anchor.web3.PublicKey[]
) => {
  let instructions = [],
    destinationAccounts = [];
  for (const mint of nfts) {
    const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
    const response = await connection.getAccountInfo(destinationPubkey);
    if (!response) {
      const createATAIx = createAssociatedTokenAccountInstruction(
        destinationPubkey,
        walletAddress,
        owner,
        mint
      );
      instructions.push(createATAIx);
    }
    destinationAccounts.push(destinationPubkey);
  }
  return {
    instructions,
    destinationAccounts
  };
};
