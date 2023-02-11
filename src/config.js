import { PublicKey } from '@solana/web3.js';

export const BACKEND_URL =
  'https://ayf1pkhvx0.execute-api.us-west-2.amazonaws.com/prod/v1/kickflip';
export const SLACK_NOTIFY_URL =
  'https://ayf1pkhvx0.execute-api.us-west-2.amazonaws.com/prod/v1/kickflip/trigger_alarm';
export const PROGRAM_ID = '';

export const PUBLISH_NETWIRK = 'devnet'; // "devnet" or "mainnet"
export const DEV_GRIND_MINT = new PublicKey('grnd8GAcyi7MgEdwNJ7qx6kFHbsxfeTsPKysjbyXBHk');
export const DEV_GRIND_DECIMAL = 1e6;

export const ADMIN_KEY = '';

export const INIT_WALLETKEY = '';

export const LOCK_TIME = 1000 * 60 * 10; // 10 is days

export const REWARD_EPOCH = 1000 * 60 * 2; // Daily

export const REWARD_UNIT = 0.02; // SOL

export const LAND_CREATOR = '';
export const FARMER_CREATOR = '';
export const ANIMAL_CREATOR = '';

export const LAND_MAX = 1;
export const FARMER_MAX = 3;
export const ANIMAL_MAX = 3;

export const APP_VERSION = 'v0.0.001';
