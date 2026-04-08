import { AppConfig, UserSession, authenticate as showAuth } from '@stacks/connect';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

const appConfig = new AppConfig(['store_write', 'publish_data']);

export const userSession = new UserSession({ appConfig });

export const network = STACKS_TESTNET; // Defaulting to testnet for development

export const appDetails = {
  name: 'Gm',
  icon: 'https://gm-dapp.vercel.app/logo.png', // Fallback icon URL
};

export const authenticate = () => {
  showAuth({
    appDetails,
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
};

export const getUserData = () => {
  if (userSession.isUserSignedIn()) {
    return userSession.loadUserData();
  }
  return null;
};
