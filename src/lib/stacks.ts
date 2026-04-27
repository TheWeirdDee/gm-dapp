/**
 * THE STACKS BRIDGE
 * 
 * This file is designed to hide the Stacks SDK from the Next.js build-time prerenderer.
 * It uses dynamic logic to ensure no side-effecting code runs outside of the browser.
 */

import { APP_CONFIG } from './config';

export const appDetails = {
  name: 'GM DApp',
  icon: 'https://gm-dapp.vercel.app/logo.png', // Hardcoded static URL to avoid Leather origin check issues
};

export const network = APP_CONFIG.network;

let userSessionInstance: any = null;
const LEATHER_PROVIDER_ID = 'LeatherProvider';

const extractStxAddress = (addresses: Array<{ address?: string; symbol?: string }> = []) => {
  const stxBySymbol = addresses.find((entry) => entry?.symbol === 'STX')?.address;
  if (stxBySymbol) return stxBySymbol.toUpperCase();

  const stxByPrefix = addresses.find((entry) => {
    const addr = entry?.address?.toUpperCase();
    return !!addr && addr.startsWith('S');
  })?.address;

  return stxByPrefix ? stxByPrefix.toUpperCase() : null;
};

const toLegacyUserData = (stxAddress: string) => {
  const normalizedAddress = stxAddress.toUpperCase();
  const isMainnetAddress = normalizedAddress.startsWith('SP') || normalizedAddress.startsWith('SM');

  return {
    profile: {
      stxAddress: {
        mainnet: isMainnetAddress ? normalizedAddress : '',
        testnet: isMainnetAddress ? '' : normalizedAddress,
      },
    },
  };
};

const toReadableWalletError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error ?? 'Wallet connection failed');
  if (message.toLowerCase().includes('origin not allowed')) {
    return `Leather blocked ${window.location.origin}. Allow this site in Leather and try again.`;
  }
  return message;
};

export const getUserSession = () => {
  if (typeof window === 'undefined') return null;
  if (!userSessionInstance) {
    const { UserSession, AppConfig } = require('@stacks/auth');
    const appConfig = new AppConfig(['store_write', 'publish_data']);
    userSessionInstance = new UserSession({ appConfig });
  }
  return userSessionInstance;
};

/**
 * Wrapper for authentication
 */
export const authenticate = async () => {
  if (typeof window === 'undefined') return;

  // `connect` is the correct Leather v8 API — returns a Promise with addresses
  const { connect } = await import('@stacks/connect');

  try {
    const response = await connect({
      network: APP_CONFIG.isMainnet ? 'mainnet' : 'testnet',
    });

    console.log('--- RAW LEATHER RESPONSE ---', response);

    const addresses: any[] = response?.addresses || [];
    const stxAddress =
      addresses.find((a: any) => a.symbol === 'STX')?.address ||
      addresses.find((a: any) => a.address?.startsWith('S'))?.address ||
      addresses[0]?.address;

    console.log('--- EXTRACTED ADDRESS ---', stxAddress);
    if (stxAddress) localStorage.setItem('gm_user_address', stxAddress);
    return stxAddress || null;
  } catch (err: any) {
    console.error('[Connect Error]', err);
    throw new Error(
      err?.message?.includes('Origin not allowed')
        ? 'Another wallet extension is blocking Leather. Disable OKX or other wallet extensions and try again.'
        : err?.message || 'Wallet connection failed'
    );
  }
};

/**
 * Wrapper for userData retrieval
 * Reads from localStorage — avoids session.loadUserData() which crashes in v8
 */
export const getUserData = () => {
  if (typeof window === 'undefined') return null;
  const stxAddress = localStorage.getItem('gm_user_address');
  if (stxAddress) return toLegacyUserData(stxAddress);
  return null;
};

/**
 * GET GM TOKEN BALANCE
 */
export const getGmTokenBalance = async (userAddress: string) => {
  if (typeof window === 'undefined') return 0;
  
  try {
    const { fetchCallReadOnlyFunction, cvToValue, standardPrincipalCV } = require('@stacks/transactions');
    const { APP_CONFIG } = require('./config');

    const result = await fetchCallReadOnlyFunction({
      network: APP_CONFIG.network,
      contractAddress: APP_CONFIG.token.address,
      contractName: APP_CONFIG.token.name,
      functionName: 'get-balance',
      functionArgs: [standardPrincipalCV(userAddress)],
      senderAddress: userAddress,
    });

    const val = cvToValue(result);
    // Standard response-ok unwrap
    if (val && typeof val === 'object' && (val.type === 20 || val.type === 'response-ok')) {
      return typeof val.value === 'bigint' ? Number(val.value) : Number(val.value);
    }
    return 0;
  } catch (error: any) {
    if (error.message?.includes('NoSuchContract')) {
      console.warn(`GM Token contract not found at ${APP_CONFIG.token.address}. This is expected if the protocol hasn't been deployed to the current network yet.`);
      return 0;
    }
    console.error('Error fetching GM balance:', error);
    return 0;
  }
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
      contractAddress: APP_CONFIG.social.address,
      contractName: APP_CONFIG.social.name,
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
      
      // If it's a tuple wrapper from cvToValue
      if (typeof unwrapped === 'object' && unwrapped.type?.startsWith('(tuple') && unwrapped.value) {
        unwrapped = unwrapped.value;
      }
    }
    
    console.log('--- UNWRAPPED CONTRACT STATE ---', unwrapped);

    // 3. Helper: unwrap a Clarity Optional (Type.OptionalSome is 10)
    const extractOptional = (optVal: any): string | null => {
      if (optVal === null || optVal === undefined) return null;
      
      // If it's a "Some" wrapper (type 10)
      if (typeof optVal === 'object' && (optVal.type === 10 || optVal.type === 'optional-some' || optVal.type?.startsWith('(optional'))) {
        if (optVal.value === null || optVal.value === undefined) return null;
        return extractOptional(optVal.value);
      }

      // Explicitly handle "None" (type 9)
      if (typeof optVal === 'object' && (optVal.type === 9 || optVal.type === 'optional-none')) {
        return null;
      }
      
      if (typeof optVal === 'string') return optVal;
      // If we get an unexpected object that isn't a Clarity wrapper, return null
      return null;
    };

    // 4. Safely extract numeric fields (handling BigInt from cvToValue)
    const getNum = (field: any) => {
      if (field === undefined || field === null) return 0;
      if (typeof field === 'object' && 'value' in field) field = field.value;
      try {
        return typeof field === 'bigint' ? Number(field) : Number(field);
      } catch (e) {
        return 0;
      }
    };

    // Helper to check both hyphenated and camelCase keys
    const getVal = (obj: any, key: string) => {
      if (!obj) return undefined;
      const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      return obj[key] !== undefined ? obj[key] : obj[camelKey];
    };

    // NOTE: Clarity keys are kebab-case 'last-gm', 'username', etc.
    const finalData = {
      lastGm: getNum(getVal(unwrapped, 'last-gm')),
      points: getNum(getVal(unwrapped, 'points')),
      streak: getNum(getVal(unwrapped, 'streak')),
      username: extractOptional(getVal(unwrapped, 'username')),
      isPro: getVal(unwrapped, 'is-pro') === true,
      proExpiry: getNum(getVal(unwrapped, 'pro-expiry')),
      healCount: getNum(getVal(unwrapped, 'heal-count')),
      followers: getNum(getVal(unwrapped, 'followers')),
      following: getNum(getVal(unwrapped, 'following')),
      totalTipped: getNum(getVal(unwrapped, 'total-tipped')),
      totalReceived: getNum(getVal(unwrapped, 'total-received'))
    };

    console.log('--- FINAL DECODED UI STATE ---', finalData);
    return finalData;

  } catch (error) {
    console.error('CRITICAL ERROR during on-chain fetch:', error);
    return null;
  }
};

let cachedBlockHeight = 0;
let lastBlockHeightFetch = 0;

export const getOnChainBlockHeight = async () => {
  if (typeof window === 'undefined') return 0;
  
  if (Date.now() - lastBlockHeightFetch < 60000 && cachedBlockHeight > 0) {
    return cachedBlockHeight;
  }
  
  try {
    const { fetchCallReadOnlyFunction, cvToValue } = require('@stacks/transactions');
    const { APP_CONFIG } = require('./config');

    const fetchHeight = async () => {
      // --- STRATEGY 1: Try Contract Sync (Most Accurate) ---
      try {
        const result = await fetchCallReadOnlyFunction({
          network: APP_CONFIG.network,
          contractAddress: APP_CONFIG.social.address,
          contractName: APP_CONFIG.social.name,
          functionName: 'get-current-burn-height',
          functionArgs: [],
          senderAddress: APP_CONFIG.social.address,
        });

        const val = cvToValue(result);
        if (val && typeof val === 'object' && (val.type === 20 || val.type === 'response-ok')) {
          return typeof val.value === 'bigint' ? Number(val.value) : Number(val.value);
        }
      } catch (e) {
        console.warn('Contract height helper not found (contract may be out of sync). Falling back to Hiro API...');
      }

      // --- STRATEGY 2: Fallback to Hiro API ---
      const hiroEndpoints = [
        APP_CONFIG.network.isMainnet 
          ? 'https://api.mainnet.hiro.so/extended/v1/block?limit=1'
          : 'https://api.testnet.hiro.so/extended/v1/block?limit=1'
      ];

      for (const endpoint of hiroEndpoints) {
        try {
          const response = await fetch(endpoint, { signal: AbortSignal.timeout(5000) });
          if (!response.ok) continue;
          const bdata = await response.json();
          const height = bdata.results?.[0]?.burn_block_height || bdata.results?.[0]?.height;
          if (height) return Number(height);
        } catch (e) {
          console.warn(`Hiro API endpoint reachable failure (${endpoint}):`, e);
        }
      }

      console.warn('All Hiro API endpoints unreachable. Attempting Tertiary Time Fallback...');

      // --- STRATEGY 3: Tertiary Time-Based Fallback ---
      const referenceHeight = 172000;
      const referenceTime = new Date('2024-12-01T00:00:00Z').getTime();
      const msSinceRef = Date.now() - referenceTime;
      const blocksSinceRef = Math.floor(msSinceRef / (10 * 60 * 1000));
      return referenceHeight + blocksSinceRef;
    };
    
    const height = await fetchHeight();
    if (height > 0) {
      cachedBlockHeight = height;
      lastBlockHeightFetch = Date.now();
    }
    return height;

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

  const senderAddress = localStorage.getItem('gm_user_address') || undefined;

  await openContractCall({
    postConditionMode: 0x01, // PostConditionMode.Allow (Simplified development)
    ...options,
    sponsored: false, // EXPLICIT: Disables bugged sponsored-transaction logic in Hiro Wallet
    stxAddress: senderAddress, // Provides address context to prevent internal lookup failures
    appDetails,
    network: APP_CONFIG.network,
    onFinish: async (data: any) => {
      console.log('--- TRANSACTION BROADCASTED ---', data.txId);
      // Run the original onFinish if provided
      if (options.onFinish) options.onFinish(data);
      
      // Start polling for final result (Diagnostics)
      console.log('--- STARTING ON-CHAIN STATUS POLLING ---');
      pollTransactionStatus(data.txId);
    }
  });
};

/**
 * DIAGNOSTIC POLLER
 * Tracks a transaction until it is confirmed or failed on-chain.
 */
async function pollTransactionStatus(txId: string) {
  const { APP_CONFIG } = require('./config');
  const apiUrl = APP_CONFIG.isMainnet 
    ? `https://api.mainnet.hiro.so/extended/v1/tx/${txId}`
    : `https://api.testnet.hiro.so/extended/v1/tx/${txId}`;

  let attempts = 0;
  const maxAttempts = 30; // ~5 minutes

  const check = async () => {
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) return;
      const data = await res.json();

      if (data.tx_status === 'success') {
        console.log(`%c[SUCCESS] Transaction ${txId} confirmed!`, 'color: #10b981; font-weight: bold');
        return;
      }

      if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
        console.error(`%c[FAILED] Transaction ${txId} aborted!`, 'color: #ef4444; font-weight: bold');
        console.error('Failure Reason:', data.tx_result?.repr || 'Unknown');
        return;
      }

      if (attempts < maxAttempts) {
        attempts++;
        setTimeout(check, 10000); // Poll every 10s
      }
    } catch (e) {
      console.warn('Polling error:', e);
    }
  };

  check();
}

/**
 * TIP AUTHOR
 * Transfers STX to an author and awards reputation
 */
export const tipAuthor = async (recipient: string, amountStx: number) => {
  if (typeof window === 'undefined') return;
  
  const { 
    uintCV, 
    standardPrincipalCV,
    Pc,
    PostConditionMode,
    FungibleConditionCode
  } = require('@stacks/transactions');
  const { APP_CONFIG } = require('./config');
  
  const amountMicroStx = Math.round(amountStx * 1000000);
  const senderAddress = localStorage.getItem('gm_user_address');
  
  if (!senderAddress) throw new Error("Wallet not connected");

  // Post-condition: Ensure ONLY the specified amount of STX can leave the wallet
  const postCondition = Pc.principal(senderAddress)
    .willSendEq(amountMicroStx)
    .ustx();

  await callContract({
    contractAddress: APP_CONFIG.social.address,
    contractName: APP_CONFIG.social.name,
    functionName: 'tip-author',
    functionArgs: [
      standardPrincipalCV(recipient),
      uintCV(amountMicroStx)
    ],
    postConditionMode: PostConditionMode.Deny, // Strict mode - only allowed transfers pass
    postConditions: [postCondition],
    onFinish: (data: any) => {
      console.log('--- TIP BROADCASTED ---', data.txId);
    },
    onCancel: () => {
      console.log('--- TIP CANCELLED ---');
    }
  });
};
/**
 * SIGN IN WITH WALLET
 * Requests a secure nonce then a signature from the user's wallet.
 */
export async function signInWithWallet(address: string): Promise<{ token: string; signature: string } | null> {
  if (typeof window === 'undefined') return null;
  
  const { showSignMessage } = await import('@stacks/connect');
  
  // 1. Fetch a fresh nonce from the backend
  const nonceRes = await fetch('/api/auth/nonce', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address })
  });

  if (!nonceRes.ok) {
    const errorData = await nonceRes.json();
    console.error('--- NONCE ERROR DETAILS ---', errorData);
    throw new Error(errorData.details || 'Failed to get auth nonce');
  }
  const { nonce } = await nonceRes.json();

  const message = `Sign in to GM DApp\nNonce: ${nonce}`;
  
  return new Promise((resolve, reject) => {
    console.log('--- REQUESTING MESSAGE SIGNATURE FROM LEATHER ---');
    console.log('Network configured as:', APP_CONFIG.network);
    
    showSignMessage({
      message,
      network: APP_CONFIG.isMainnet ? 'mainnet' : 'testnet', // Leather v8 prefers string network identifiers
      appDetails,
      onFinish: async (data: any) => {
        try {
          console.log('--- SIGNATURE SUCCESS, VERIFYING ON BACKEND ---');
          // 2. Verify everything on the backend
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              address,
              signature: data.signature,
              publicKey: data.publicKey
            })
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Verification failed');
          }
          
          const { token } = await response.json();
          resolve({ token, signature: data.signature });
        } catch (err) {
          reject(err);
        }
      },
      onCancel: () => reject(new Error('User cancelled')),
    });
  });
}
