'use client';

import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from '../lib/store';
import { useState, useEffect } from 'react';
import { getUserSession } from '../lib/stacks';
import { setUserData, setUsername, fetchOnChainStats } from '../lib/features/userSlice';

function AuthHydrator({ 
  children, 
  initialUser 
}: { 
  children: React.ReactNode, 
  initialUser: { address: string; username: string | null; avatar: string | null } | null 
}) {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  // 1. Instant Hydration (on first render)
  if (!mounted && initialUser) {
    dispatch(setUserData({
      address: initialUser.address,
      profile: { stxAddress: initialUser.address } // Minimal profile to bridge hydration
    }));
    
    // Set metadata instantly to avoid flash
    dispatch(updateStats({
      username: initialUser.username,
      avatar: initialUser.avatar
    }));
  }

  useEffect(() => {
    setMounted(true);
    
    // 2. Deep Hydration (fetch on-chain state if we have an address)
    const effectiveAddress = initialUser?.address || localStorage.getItem('gm_user_address');
    
    if (effectiveAddress) {
      if (!initialUser) {
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
  }, [dispatch, initialUser]);

  return <>{children}</>;
}

export function Providers({ 
  children, 
  initialUser 
}: { 
  children: React.ReactNode, 
  initialUser: { address: string; username: string | null; avatar: string | null } | null 
}) {
  return (
    <Provider store={store}>
      <AuthHydrator initialUser={initialUser}>
        {children}
      </AuthHydrator>
    </Provider>
  );
}
