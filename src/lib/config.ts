import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';


const networkType = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet';
const IS_MAINNET = networkType === 'mainnet';


export const APP_CONFIG = {

  social: {
    address: 'SP1MQE0HMB765Z9EVF0CM6SPMMKW4VPDDSRKP54QX',
    name: 'gm-social-final-v5',
  },
  

  token: {
    address: 'SP1MQE0HMB765Z9EVF0CM6SPMMKW4VPDDSRKP54QX',
    name: 'gm-social-token-v4',
  },

  // Legacy fallback (for backward compatibility during migration)
  contractAddress: process.env.NEXT_PUBLIC_SOCIAL_ADDRESS || 'ST1MQE0HMB765Z9EVF0CM6SPMMKW4VPDDSVRTT2RF',
  contractName: 'gm-social-final-v1',
  

  network: IS_MAINNET ? STACKS_MAINNET : STACKS_TESTNET,
  isMainnet: IS_MAINNET,
  

  explorerUrl: IS_MAINNET 
    ? 'https://explorer.hiro.so' 
    : 'https://explorer.hiro.so?chain=testnet',
  
  // DEFAULT FEE (in micro-STX)
  // Setting this to 100,000 (0.1 STX) ensures ultra-fast confirmation
  defaultFee: 100000,
};


export const getExplorerLink = (id: string) => {
  if (!id) return APP_CONFIG.explorerUrl;
  const isAddress = id.startsWith('S');
  const path = isAddress ? 'address' : 'txid';
  const cleanId = (isAddress || id.startsWith('0x')) ? id : `0x${id}`;
  return `${APP_CONFIG.explorerUrl}/${path}/${cleanId}`;
};
