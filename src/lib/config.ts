import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

const IS_MAINNET = false;

export const APP_CONFIG = {
  contractAddress: IS_MAINNET ? 'SP...' : 'ST1MQE0HMB765Z9EVF0CM6SPMMKW4VPDDSVRTT2RF',
  contractName: 'gm-social',
  network: IS_MAINNET ? STACKS_MAINNET : STACKS_TESTNET,
  explorerUrl: IS_MAINNET 
    ? 'https://explorer.hiro.so' 
    : 'https://explorer.hiro.so?chain=testnet'
};

export const getExplorerLink = (txId: string) => {
  const cleanTxId = txId.startsWith('0x') ? txId : `0x${txId}`;
  return `${APP_CONFIG.explorerUrl}/txid/${cleanTxId}`;
};
