'use client';

import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from '../lib/store';
import { useState, useEffect } from 'react';
import { getUserSession } from '../lib/stacks';
import { setUserData, setUsername, fetchOnChainStats } from '../lib/features/userSlice';

function AuthHydrator({ 
  children, 
  initialAddress 
}: { 
  children: React.ReactNode, 
  initialAddress: string | null 
}) {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  // 1. Instant Hydration (on first render)
  if (!mounted && initialAddress) {
    dispatch(setUserData({
      address: initialAddress,
      profile: { stxAddress: initialAddress } // Minimal profile to bridge hydration
    }));
  }

  useEffect(() => {
    setMounted(true);
    
    // 2. Deep Hydration (fetch on-chain state if we have an address)
    const effectiveAddress = initialAddress || localStorage.getItem('gm_user_address');
    
    if (effectiveAddress) {
      if (!initialAddress) {
        // Fallback for non-cookie based dev sessions
        const session = getUserSession();
        if (session?.isUserSignedIn()) {
          const userData = session.loadUserData();
          dispatch(setUserData({
            address: effectiveAddress,
            profile: userData.profile
          }));
        }
      }
      
      // Fetch full on-chain stats (bio, streak, etc)
      dispatch(fetchOnChainStats(effectiveAddress) as any);
    }
  }, [dispatch, initialAddress]);

  return <>{children}</>;
}

export function Providers({ 
  children, 
  initialAddress 
}: { 
  children: React.ReactNode, 
  initialAddress: string | null 
}) {
  return (
    <Provider store={store}>
      <AuthHydrator initialAddress={initialAddress}>
        {children}
      </AuthHydrator>
    </Provider>
  );
}
