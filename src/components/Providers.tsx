'use client';

import { Provider, useDispatch } from 'react-redux';
import { store } from '../lib/store';
import { useEffect } from 'react';
import { userSession, getUserData } from '../lib/stacks';
import { setUserData } from '../lib/features/userSlice';

function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const stxAddress = userData.profile.stxAddress;
      const addressString = typeof stxAddress === 'string' 
        ? stxAddress 
        : (stxAddress?.mainnet || stxAddress?.testnet || userData.authResponseToken);

      dispatch(setUserData({
        address: addressString,
        profile: userData.profile
      }));
    }
  }, [dispatch]);

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
