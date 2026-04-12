import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

// 1. Determine Network Type from Environment
const networkType = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet';
const IS_MAINNET = networkType === 'mainnet';

// 2. Export Master Config
export const APP_CONFIG = {
  // Use environment variables or fallback to the current verified Testnet deployment
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'ST1MQE0HMB765Z9EVF0CM6SPMMKW4VPDDSVRTT2RF',
  contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME || 'gm-social-v2',
  
  // Set Network Object
  network: IS_MAINNET ? STACKS_MAINNET : STACKS_TESTNET,
  
  // Set Explorer Base URL
  explorerUrl: IS_MAINNET 
    ? 'https://explorer.hiro.so' 
    : 'https://explorer.hiro.so?chain=testnet'
};

/**
 * Generates a link to the Stacks Explorer for a given transaction ID.
 */
export const getExplorerLink = (txId: string) => {
  const cleanTxId = txId.startsWith('0x') ? txId : `0x${txId}`;
  return `${APP_CONFIG.explorerUrl}/txid/${cleanTxId}`;
};
