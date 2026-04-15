import { describe, expect, it, beforeEach } from 'vitest';
import { initSimnet } from '@stacks/clarinet-sdk';
import { Cl } from '@stacks/transactions';

describe('gm-social contract', () => {
  let simnet: any;
  const accounts = new Map();
  const WALLET_1 = 'ST1SJ3DTE5DN7XW54F2A5D2K9TXZ4V2S061E4K2E';

  beforeEach(async () => {
    simnet = await initSimnet();
  });

  it('allows a user to say GM', () => {
    const { result } = simnet.callPublicFn(
      'gm-social',
      'say-gm',
      [],
      WALLET_1
    );

    expect(result).toBeOk(Cl.tuple({
      points: Cl.uint(5),
      streak: Cl.uint(1),
    }));
  });

  it('prevents saying GM twice in the same day (Clarity 4 stacks-block-time logic)', () => {
    // First GM
    simnet.callPublicFn('gm-social', 'say-gm', [], WALLET_1);

    // Second GM in the same block/time (fails)
    const { result } = simnet.callPublicFn(
      'gm-social',
      'say-gm',
      [],
      WALLET_1
    );

    // ERR-COOLDOWN-ACTIVE (u101)
    expect(result).toBeErr(Cl.uint(101));
  });

  it('allows saying GM after 24 hours (86400 seconds)', () => {
    // First GM
    simnet.callPublicFn('gm-social', 'say-gm', [], WALLET_1);

    // Advance time by 86401 seconds
    simnet.setBurnBlockTimestamp(simnet.getBurnBlockTimestamp() + 86401);

    // Second GM (success)
    const { result } = simnet.callPublicFn(
      'gm-social',
      'say-gm',
      [],
      WALLET_1
    );

    expect(result).toBeOk(Cl.tuple({
      points: Cl.uint(10),
      streak: Cl.uint(2),
    }));
  });
});
