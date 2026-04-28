import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

// 1. Determine Network Type from Environment
const networkType = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet';
const IS_MAINNET = networkType === 'mainnet';

// 2. Export Master Config
export const APP_CONFIG = {
  // SOCIAL PROTOCOL (gm-social-v2)
  social: {
    address: process.env.NEXT_PUBLIC_SOCIAL_ADDRESS || 'ST1MQE0HMB765Z9EVF0CM6SPMMKW4VPDDSVRTT2RF',
    name: 'gm-social-final-v1',
  },
  
  // TOKEN ECONOMY (gm-token-v2)
  token: {
    address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS || 'ST1MQE0HMB765Z9EVF0CM6SPMMKW4VPDDSVRTT2RF',
    name: 'gm-token-final-v1',
  },

  // Legacy fallback (for backward compatibility during migration)
  contractAddress: process.env.NEXT_PUBLIC_SOCIAL_ADDRESS || 'ST1MQE0HMB765Z9EVF0CM6SPMMKW4VPDDSVRTT2RF',
  contractName: 'gm-social-final-v1',
  
  // Set Network Object
  network: IS_MAINNET ? STACKS_MAINNET : STACKS_TESTNET,
  isMainnet: IS_MAINNET,
  
  // Set Explorer Base URL
  explorerUrl: IS_MAINNET 
    ? 'https://explorer.hiro.so' 
    : 'https://explorer.hiro.so?chain=testnet'
};

/**
 * Generates a link to the Stacks Explorer for a given transaction ID.
 */
export const getExplorerLink = (id: string) => {
  if (!id) return APP_CONFIG.explorerUrl;
  const isAddress = id.startsWith('S');
  const path = isAddress ? 'address' : 'txid';
  const cleanId = (isAddress || id.startsWith('0x')) ? id : `0x${id}`;
  return `${APP_CONFIG.explorerUrl}/${path}/${cleanId}`;
};
