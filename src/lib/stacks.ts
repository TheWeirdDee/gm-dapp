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
  
  console.log('--- FETCHING ON-CHAIN DATA FOR:', userAddress);

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

    console.log('RAW CLARITY RESULT:', result);

    // 1. Convert Clarity Value (CV) to a JS value
    const val = cvToValue(result);
    console.log('CV TO VALUE (RAW JS):', val);
    
    // 2. Unwrap the Response (Type.ResponseOk is 20, Type.ResponseErr is 21)
    let unwrapped = val;
    if (val && typeof val === 'object') {
      if (val.type === 20 || val.type === 'response-ok') {
        unwrapped = val.value;
      } else if (val.type === 21 || val.type === 'response-err') {
        console.error('--- CONTRACT RETURNED ERROR ON-CHAIN ---', val.value);
        return null;
      }
    }
    
    console.log('--- UNWRAPPED CONTRACT STATE ---', unwrapped);

    // 3. Helper: unwrap a Clarity Optional (Type.OptionalSome is 10)
    const extractOptional = (optVal: any): string | null => {
      if (optVal === null || optVal === undefined) return null;
      
      // If it's a "Some" wrapper
      if (typeof optVal === 'object' && (optVal.type === 10 || optVal.type === 'optional-some')) {
        return extractOptional(optVal.value);
      }
      
      if (typeof optVal === 'string') return optVal;
      return String(optVal);
    };

    // 4. Safely extract numeric fields (handling BigInt from cvToValue)
    const getNum = (field: any) => {
      if (field === undefined || field === null) return 0;
      // Convert BigInt to Number explicitly for UI consumption
      try {
        return typeof field === 'bigint' ? Number(field) : Number(field);
      } catch (e) {
        return 0;
      }
    };

    // NOTE: Clarity keys are kebab-case 'last-gm', 'username', etc.
    const finalData = {
      lastGm: getNum(unwrapped?.['last-gm']),
      points: getNum(unwrapped?.['points']),
      streak: getNum(unwrapped?.['streak']),
      username: extractOptional(unwrapped?.username),
      isPro: unwrapped?.['is-pro'] === true,
      proExpiry: getNum(unwrapped?.['pro-expiry']),
      healCount: getNum(unwrapped?.['heal-count']),
      followers: getNum(unwrapped?.['followers']),
      following: getNum(unwrapped?.['following'])
    };

    console.log('--- FINAL DECODED UI STATE ---', finalData);
    if (!finalData.username && !finalData.points && !finalData.streak) {
      console.warn('WARNING: On-chain data exists but seems empty (all zeros). Check if current wallet address has interacted with this contract version.');
    }
    return finalData;

  } catch (error) {
    console.error('CRITICAL ERROR during on-chain fetch:', error);
    return null;
  }
};

export const getOnChainBlockHeight = async () => {
  if (typeof window === 'undefined') return 0;
  
  try {
    const { fetchCallReadOnlyFunction, cvToValue } = require('@stacks/transactions');
    const { APP_CONFIG } = require('./config');

    // --- STRATEGY 1: Try Contract Sync (Most Accurate) ---
    try {
      const result = await fetchCallReadOnlyFunction({
        network: APP_CONFIG.network,
        contractAddress: APP_CONFIG.contractAddress,
        contractName: APP_CONFIG.contractName,
        functionName: 'get-current-burn-height',
        functionArgs: [],
        senderAddress: APP_CONFIG.contractAddress,
      });

      const val = cvToValue(result);
      if (val && typeof val === 'object' && (val.type === 20 || val.type === 'response-ok')) {
        return typeof val.value === 'bigint' ? Number(val.value) : Number(val.value);
      }
    } catch (e) {
      console.warn('Contract height helper not found (contract may be out of sync). Falling back to Hiro API...');
    }

    // --- STRATEGY 2: Fallback to Hiro API ---
    try {
      const response = await fetch('https://stacks-node-api.testnet.stacks.co/extended/v1/block?limit=1');
      const bdata = await response.json();
      const height = bdata.results?.[0]?.burn_block_height || bdata.results?.[0]?.height;
      if (height) return Number(height);
    } catch (e) {
      console.warn('Hiro API unreachable (SSL or network error). Attempting Tertiary Time Fallback...');
    }

    // --- STRATEGY 3: Tertiary Time-Based Fallback ---
    // Use a reference block height and current time to estimate the burns
    // Testnet Block 172000 was at approx 2024-12-01
    // This is better than returning 0 which breaks the UI
    const referenceHeight = 172000;
    const referenceTime = new Date('2024-12-01T00:00:00Z').getTime();
    const msSinceRef = Date.now() - referenceTime;
    const blocksSinceRef = Math.floor(msSinceRef / (10 * 60 * 1000)); // 10 mins per block
    return referenceHeight + blocksSinceRef;

  } catch (error) {
    console.error('CRITICAL: All block height strategies failed. Application state may be inconsistent.');
    return 0; // Absolute last resort
  }
};

/**
 * Wrapper for contract calls
 */
export const callContract = async (options: any) => {
  if (typeof window === 'undefined') return;
  const { openContractCall } = require('@stacks/connect');
  const { APP_CONFIG } = require('./config');
  
  console.log('--- CONTRACT CALL INITIATED ---', {
    functionName: options.functionName,
    contract: `${options.contractAddress}.${options.contractName}`,
    network: APP_CONFIG.network.isMainnet ? 'Mainnet' : 'Testnet',
  });

  await openContractCall({
    ...options,
    network: APP_CONFIG.network, // Force global network from config
  });
};
