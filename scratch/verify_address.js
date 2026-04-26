const { mnemonicToSeedSync } = require('bip39');
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const { getAddressFromPublicKey, AddressVersion, AddressHashMode } = require('@stacks/transactions');

const bip32 = BIP32Factory(ecc);

const mnemonic = "uncover later dignity basket tree young fancy census business split wet select cigar flee danger shrug bring velvet chicken nerve square fantasy speed census";
const seed = mnemonicToSeedSync(mnemonic);
const master = bip32.fromSeed(seed);
for (let i = 0; i < 5; i++) {
  const child = master.derivePath(`m/44'/5757'/0'/0/${i}`);
  const address = getAddressFromPublicKey(child.publicKey, AddressVersion.TestnetSingleSig);
  console.log(`Index ${i}:`, address);
}
