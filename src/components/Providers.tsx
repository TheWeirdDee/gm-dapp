'use client';

import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from '../lib/store';
import { useState, useEffect } from 'react';
import { getUserSession } from '../lib/stacks';
import { setUserData, setUsername, fetchOnChainStats } from '../lib/features/userSlice';

function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const session = getUserSession();
    if (session && session.isUserSignedIn()) {
      const userData = session.loadUserData();
      const stxAddress = userData.profile.stxAddress;
      const addressString = typeof stxAddress === 'string' 
        ? stxAddress 
        : (stxAddress?.mainnet || stxAddress?.testnet || userData.authResponseToken);

      dispatch(setUserData({
        address: addressString,
        profile: userData.profile
      }));
      
      // HYDRATION: Fetch real data from the blockchain immediately on mount
      dispatch(fetchOnChainStats(addressString) as any);
    }
  }, [dispatch]);

  // Listen for store changes to persist mockData
  const user = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (typeof window !== 'undefined' && user.address && user.mockData) {
      localStorage.setItem(`gm_profile_${user.address}`, JSON.stringify(user.mockData));
    }
  }, [user.mockData, user.address]);

  // Process hydration but allow children to render during build/SSR
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydrator>
        {children}
      </AuthHydrator>
    </Provider>
  );
}
