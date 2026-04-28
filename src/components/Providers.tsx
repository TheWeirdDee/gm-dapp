'use client';

import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from '../lib/store';
import { useState, useEffect } from 'react';
import { getUserSession } from '../lib/stacks';
import { setUserData, setUsername, fetchOnChainStats, updateStats, setSessionToken } from '../lib/features/userSlice';

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
    const storedAddress = localStorage.getItem('gm_user_address');
    const storedToken = localStorage.getItem('gm_session_token');
    const effectiveAddress = initialUser?.address || storedAddress;
    
    if (effectiveAddress) {
      console.log('--- HYDRATOR: Recovering session for', effectiveAddress);
      
      // If we have a stored token but not in Redux (or server missed it)
      if (storedToken) {
        dispatch(setSessionToken(storedToken));
      }

      if (!initialUser) {
        // Fallback for non-cookie based sessions
        try {
          const session = getUserSession();
          if (session?.isUserSignedIn()) {
            const userData = session.loadUserData();
            dispatch(setUserData({
              address: effectiveAddress,
              profile: userData.profile
            }));
          } else {
            // Minimal hydration if we only have the address
            dispatch(setUserData({
              address: effectiveAddress,
              profile: { stxAddress: effectiveAddress }
            }));
          }
        } catch (e) {
          console.warn('--- HYDRATOR: Stacks session corrupted. Clearing cache. ---', e);
          localStorage.removeItem('blockstack-session'); // The exact key used by @stacks/auth
          localStorage.removeItem('gm_user_address');
          localStorage.removeItem('gm_session_token');
          // Start fresh
          window.location.reload(); 
        }
      }
      
      // Fetch full on-chain stats (bio, streak, etc)
      dispatch(fetchOnChainStats(effectiveAddress) as any);
    } else {
      console.log('--- HYDRATOR: No active session found ---');
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
