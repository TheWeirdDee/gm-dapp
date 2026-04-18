import { fetchCallReadOnlyFunction, cvToJSON, cvToValue, standardPrincipalCV } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

async function test() {
  const address = 'ST1MQE0HMB765Z9EVF0CM6SPMMKW4VPDDSVRTT2RF';
  const network = STACKS_TESTNET;
  
  try {
    const result = await fetchCallReadOnlyFunction({
      network,
      contractAddress: 'ST1MQE0HMB765Z9EVF0CM6SPMMKW4VPDDSVRTT2RF',
      contractName: 'gm-social-v6',
      functionName: 'get-user-data',
      functionArgs: [standardPrincipalCV(address)],
      senderAddress: address,
    });

    console.log('--- cvToJSON ---');
    console.dir(cvToJSON(result), { depth: null });
    
    console.log('--- cvToValue ---');
    console.dir(cvToValue(result), { depth: null });
    
  } catch(e) {
    console.error(e);
  }
}

test();
