/**
 * Scans all account indexes in a Hiro Wallet to find which one controls
 * a given SP address and reports its balance.
 * Run: MNEMONIC="word1 word2 ..." node scratch/derive-key.js
 */

const { generateWallet, getStxAddress } = require('@stacks/wallet-sdk');

const MAINNET = 0;
const HIRO_API = 'https://api.mainnet.hiro.so';

async function getBalance(address) {
  try {
    const res  = await fetch(`${HIRO_API}/v2/accounts/${address}?proof=0`);
    const data = await res.json();
    const balHex = data.balance || '0x0';
    const microStx = parseInt(balHex, 16);
    return (microStx / 1_000_000).toFixed(6);
  } catch {
    return '?.??????';
  }
}

async function main() {
  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic) {
    console.error('❌ MNEMONIC env var not set.');
    process.exit(1);
  }

  const TARGET  = 'SP2WKK2W5DR70D2YCHHBEF7R5EMK5NZNQE2Z8T3EF';
  const INDICES = 5; // check accounts 0-4

  console.log(`\nScanning ${INDICES} account indexes for ${TARGET}...\n`);

  // Generate wallet with enough accounts
  const wallet = await generateWallet({
    secretKey: mnemonic.trim(),
    password: '',
    numOfAccounts: INDICES,
  });

  let foundIndex = -1;
  let foundKey   = '';

  for (let i = 0; i < wallet.accounts.length; i++) {
    const account  = wallet.accounts[i];
    const privKey  = account.stxPrivateKey;
    const key64    = privKey.endsWith('01') ? privKey.slice(0, 64) : privKey;
    const address  = getStxAddress({ account, transactionVersion: MAINNET });
    const balance  = await getBalance(address);
    const match    = address === TARGET ? ' ← TARGET ✅' : '';

    console.log(`  Account ${i}: ${address}  (${balance} STX)${match}`);

    if (address === TARGET) {
      foundIndex = i;
      foundKey   = key64;
    }
  }

  if (foundIndex >= 0) {
    console.log(`\n✅ Found target address at account index ${foundIndex}`);
    console.log(`   Private key: ${foundKey}`);
    console.log(`\n📋 Update deploy-mainnet.ts: change DEPLOYER_ADDRESS to ${TARGET}`);
    console.log(`\nRun deployment:`);
    console.log(`  DEPLOYER_PRIVATE_KEY="${foundKey}" npm run deploy:mainnet\n`);
  } else {
    console.log(`\n⚠️  ${TARGET} was NOT found in any of the first ${INDICES} accounts.`);
    console.log(`   The SP2WKK2... address belongs to a DIFFERENT seed phrase.\n`);
    console.log(`   Best option: deploy from your actual wallet (account 0):`);
    const acc0    = wallet.accounts[0];
    const key64   = acc0.stxPrivateKey.replace(/01$/, '');
    const addr0   = getStxAddress({ account: acc0, transactionVersion: MAINNET });
    const bal0    = await getBalance(addr0);
    console.log(`   Address: ${addr0}  (${bal0} STX)`);
    console.log(`   Key:     ${key64}`);
    if (parseFloat(bal0) >= 1.52) {
      console.log(`\n   ✅ Enough STX! Update DEPLOYER_ADDRESS in deploy-mainnet.ts to:`);
      console.log(`      ${addr0}`);
      console.log(`\n   Then run:`);
      console.log(`   DEPLOYER_PRIVATE_KEY="${key64}" npm run deploy:mainnet\n`);
    } else {
      console.log(`\n   ❌ Not enough STX (need ~1.52 STX). Send mainnet STX to ${addr0} first.\n`);
    }
  }
}

main().catch((err) => {
  console.error('Error:', err.message ?? err);
  process.exit(1);
});
