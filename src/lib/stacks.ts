/**
 * THE STACKS BRIDGE
 * 
 * This file is designed to hide the Stacks SDK from the Next.js build-time prerenderer.
 * It uses dynamic logic to ensure no side-effecting code runs outside of the browser.
 */

import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const appDetails = {
  name: 'Gm',
  icon: 'https://gm-dapp.vercel.app/logo.png',
};

export const network = STACKS_TESTNET;

/**
 * PURE FUNCTION for UserSession retrieval.
 * Uses dynamic require to hide dependencies from the build-time tree.
 */
export const getUserSession = () => {
  if (typeof window === 'undefined') return null;
  const { UserSession, AppConfig } = require('@stacks/connect');
  const appConfig = new AppConfig(['store_write', 'publish_data']);
  return new UserSession({ appConfig });
};

/**
 * Wrapper for authentication
 */
export const authenticate = () => {
  const session = getUserSession();
  if (!session) return;
  
  const { authenticate: showAuth } = require('@stacks/connect');
  
  showAuth({
    appDetails,
    onFinish: () => {
      window.location.reload();
    },
    userSession: session,
  });
};

/**
 * Wrapper for userData retrieval
 */
export const getUserData = () => {
  const session = getUserSession();
  if (session && session.isUserSignedIn()) {
    return session.loadUserData();
  }
  return null;
};

/**
 * Wrapper for on-chain data retrieval
 */
export const getUserOnChainData = async (userAddress: string) => {
  if (typeof window === 'undefined') return null;
  
  try {
    const { 
      fetchCallReadOnlyFunction, 
      cvToValue,
      standardPrincipalCV 
    } = require('@stacks/transactions');

    const { APP_CONFIG } = require('./config');

    const result = await fetchCallReadOnlyFunction({
      network: APP_CONFIG.network,
      contractAddress: APP_CONFIG.contractAddress,
      contractName: APP_CONFIG.contractName,
      functionName: 'get-user-data',
      functionArgs: [standardPrincipalCV(userAddress)],
      senderAddress: userAddress,
    });

    // 1. Convert Clarity Value (CV) to a JS value
    const val = cvToValue(result);
    
    // 2. Unwrap the Response (Type.ResponseOk)
    // val will look like: { type: 20, value: { ...tuple... } }
    const unwrapped = (val && typeof val === 'object' && 'value' in val) ? val.value : val;

    // 3. Helper: unwrap a Clarity Optional
    // cvToValue returns { type: 10, value: "Divine" } for Some, or null/undefined for None
    const extractOptional = (optVal: any): string | null => {
      if (!optVal) return null;
      if (typeof optVal === 'string') return optVal;
      if (typeof optVal === 'object' && 'value' in optVal) return String(optVal.value);
      return null;
    };

    return {
      lastGm: Number(unwrapped?.['last-gm'] || 0),
      points: Number(unwrapped?.['points'] || 0),
      streak: Number(unwrapped?.['streak'] || 0),
      username: extractOptional(unwrapped?.username)
    };
  } catch (error) {
    console.error('Error fetching on-chain data:', error);
    return null;
  }
};

/**
 * Wrapper for contract calls
 */
export const callContract = async (options: any) => {
  if (typeof window === 'undefined') return;
  const { openContractCall } = require('@stacks/connect');
  const { APP_CONFIG } = require('./config');
  
  await openContractCall({
    ...options,
    network: APP_CONFIG.network, // Force global network from config
  });
};
