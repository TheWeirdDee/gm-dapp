/**
 * GM DAPP — Mainnet Deployment (ESM .mjs — bypasses all CJS/require issues)
 *
 * Run: DEPLOYER_PRIVATE_KEY="your-64-char-key" node scratch/deploy-mainnet.mjs
 */

import { makeContractDeploy, makeContractCall, broadcastTransaction, contractPrincipalCV, PostConditionMode } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const DEPLOYER_ADDRESS    = 'SP1MQE0HMB765Z9EVF0CM6SPMMKW4VPDDSRKP54QX';
const RAW_KEY             = process.env.DEPLOYER_PRIVATE_KEY ?? '';
// Stacks @stacks/transactions v7 expects the 66-char key (with '01' compression marker)
const DEPLOYER_PRIVATE_KEY = RAW_KEY.length === 64 ? RAW_KEY + '01' : RAW_KEY;

const TOKEN_CONTRACT_NAME  = 'gm-token-final-v1';
const SOCIAL_CONTRACT_NAME = 'gm-social-final-v1';
const CONTRACTS_DIR        = join(__dirname, '..', 'contracts');
const HIRO_API             = 'https://api.mainnet.hiro.so';
const NETWORK              = STACKS_MAINNET;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
async function getAccountNonce(address) {
  const res  = await fetch(`${HIRO_API}/v2/accounts/${address}?proof=0`);
  if (!res.ok) throw new Error(`Failed to fetch nonce: ${res.status}`);
  const data = await res.json();
  return data.nonce;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function pollUntilConfirmed(txId) {
  const cleanId = txId.startsWith('0x') ? txId : `0x${txId}`;
  console.log(`  ⏳ https://explorer.hiro.so/txid/${cleanId}`);
  for (let i = 0; i < 60; i++) {
    await sleep(15_000);
    try {
      const res  = await fetch(`${HIRO_API}/extended/v1/tx/${cleanId}`);
      if (!res.ok) { process.stdout.write('.'); continue; }
      const data = await res.json();
      if (data.tx_status === 'success') { console.log('\n  ✅ Confirmed!'); return; }
      if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
        throw new Error(`TX aborted: ${data.tx_result?.repr ?? 'unknown'}`);
      }
      process.stdout.write(` [${data.tx_status}]`);
    } catch (err) {
      if (err.message?.includes('aborted')) throw err;
      process.stdout.write('.');
    }
  }
  throw new Error('Timeout after 15 min');
}

async function broadcast(tx, label) {
  console.log(`\n📡 Broadcasting: ${label}`);
  const result = await broadcastTransaction({ transaction: tx, network: NETWORK });
  if (result && 'error' in result) {
    throw new Error(`Broadcast failed for ${label}: ${JSON.stringify(result)}`);
  }
  const txId = result.txid;
  console.log(`  TX: https://explorer.hiro.so/txid/0x${txId}`);
  return txId;
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  if (!RAW_KEY) {
    console.error('\n❌ DEPLOYER_PRIVATE_KEY is not set.');
    console.error('   DEPLOYER_PRIVATE_KEY="your-key" node scratch/deploy-mainnet.mjs\n');
    process.exit(1);
  }

  console.log('═══════════════════════════════════════════════════');
  console.log('  GM DAPP — Mainnet Deployment (ESM)');
  console.log(`  Deployer: ${DEPLOYER_ADDRESS}`);
  console.log(`  Key: ${DEPLOYER_PRIVATE_KEY.slice(0,8)}... (${DEPLOYER_PRIVATE_KEY.length} chars)`);
  console.log('═══════════════════════════════════════════════════\n');

  const tokenSource  = readFileSync(join(CONTRACTS_DIR, 'gm-token.clar'), 'utf8');
  const socialSource = readFileSync(join(CONTRACTS_DIR, 'gm-social.clar'), 'utf8');

  let nonce = await getAccountNonce(DEPLOYER_ADDRESS);
  console.log(`📋 Starting nonce: ${nonce}`);

  // ── STEP 1: Deploy gm-token-final-v1 ────────────────────────────────────
  console.log('\n── STEP 1/4: Deploy gm-token-final-v1');
  const tokenDeploy = await makeContractDeploy({
    contractName: TOKEN_CONTRACT_NAME,
    codeBody: tokenSource,
    senderKey: DEPLOYER_PRIVATE_KEY,
    network: NETWORK,
    nonce: BigInt(nonce),
    postConditionMode: PostConditionMode.Allow,
    fee: 500_000n,
  });
  await pollUntilConfirmed(await broadcast(tokenDeploy, TOKEN_CONTRACT_NAME));
  nonce++;

  // ── STEP 2: Deploy gm-social-final-v1 ───────────────────────────────────
  console.log('\n── STEP 2/4: Deploy gm-social-final-v1');
  const socialDeploy = await makeContractDeploy({
    contractName: SOCIAL_CONTRACT_NAME,
    codeBody: socialSource,
    senderKey: DEPLOYER_PRIVATE_KEY,
    network: NETWORK,
    nonce: BigInt(nonce),
    postConditionMode: PostConditionMode.Allow,
    fee: 1_000_000n,
  });
  await pollUntilConfirmed(await broadcast(socialDeploy, SOCIAL_CONTRACT_NAME));
  nonce++;

  // ── STEP 3: set-token-contract on social ────────────────────────────────
  console.log('\n── STEP 3/4: set-token-contract on gm-social-final-v1');
  const setTokenTx = await makeContractCall({
    contractAddress: DEPLOYER_ADDRESS,
    contractName: SOCIAL_CONTRACT_NAME,
    functionName: 'set-token-contract',
    functionArgs: [contractPrincipalCV(DEPLOYER_ADDRESS, TOKEN_CONTRACT_NAME)],
    senderKey: DEPLOYER_PRIVATE_KEY,
    network: NETWORK,
    nonce: BigInt(nonce),
    postConditionMode: PostConditionMode.Allow,
    fee: 10_000n,
  });
  await pollUntilConfirmed(await broadcast(setTokenTx, 'set-token-contract'));
  nonce++;

  // ── STEP 4: set-governor on token ───────────────────────────────────────
  console.log('\n── STEP 4/4: set-governor on gm-token-final-v1');
  const setGovTx = await makeContractCall({
    contractAddress: DEPLOYER_ADDRESS,
    contractName: TOKEN_CONTRACT_NAME,
    functionName: 'set-governor',
    functionArgs: [contractPrincipalCV(DEPLOYER_ADDRESS, SOCIAL_CONTRACT_NAME)],
    senderKey: DEPLOYER_PRIVATE_KEY,
    network: NETWORK,
    nonce: BigInt(nonce),
    postConditionMode: PostConditionMode.Allow,
    fee: 10_000n,
  });
  await pollUntilConfirmed(await broadcast(setGovTx, 'set-governor'));

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  ✅ MAINNET DEPLOYMENT COMPLETE');
  console.log('═══════════════════════════════════════════════════');
  console.log(`\n  Token:  ${DEPLOYER_ADDRESS}.${TOKEN_CONTRACT_NAME}`);
  console.log(`  Social: ${DEPLOYER_ADDRESS}.${SOCIAL_CONTRACT_NAME}`);
  console.log('\n  Restart your dev server to activate mainnet mode.');
}

main().catch(err => {
  console.error('\n❌ Deployment failed:', err.message ?? err);
  process.exit(1);
});
