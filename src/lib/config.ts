import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

// 1. Determine Network Type from Environment
const networkType = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet';
const IS_MAINNET = networkType === 'mainnet';

// 2. Export Master Config
export const APP_CONFIG = {
  // SOCIAL PROTOCOL (gm-social-v2)
  social: {
    address: process.env.NEXT_PUBLIC_SOCIAL_ADDRESS || 'SP2WKK2W5DR70D2YCHHBEF7R5EMK5NZNQE2Z8T3EF',
    name: 'gm-social-v2',
  },
  
  // TOKEN ECONOMY (gm-token-v2)
  token: {
    address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS || 'SP2WKK2W5DR70D2YCHHBEF7R5EMK5NZNQE2Z8T3EF',
    name: 'gm-token-v2',
  },

  // Legacy fallback (for backward compatibility during migration)
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'SP2WKK2W5DR70D2YCHHBEF7R5EMK5NZNQE2Z8T3EF',
  contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME || 'gm-social-v2',
  
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
export const getExplorerLink = (txId: string) => {
  const cleanTxId = txId.startsWith('0x') ? txId : `0x${txId}`;
  return `${APP_CONFIG.explorerUrl}/txid/${cleanTxId}`;
};
