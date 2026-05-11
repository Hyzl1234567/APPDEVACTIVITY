// firebase.ts
import { GoogleSignin } from '@react-native-google-signin/google-signin';

let googleConfigured = false;

export const configureGoogleSignIn = () => {
  if (!googleConfigured) {
    GoogleSignin.configure({
      webClientId: '512408116637-vgb799pif9ood7h4vomi630p09e1gomm.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      scopes: ['profile', 'email'],
    });
    googleConfigured = true;
    console.log('✅ Google Sign-In configured');
  }
};

export const signInWithGoogle = async () => {
  configureGoogleSignIn();
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    await GoogleSignin.signOut();
    const userInfo = await GoogleSignin.signIn();
    console.log('🟢 Google Sign-In user info:', userInfo);
    return userInfo;
  } catch (error: any) {
    console.log('🔴 Google Sign-In error:', error);
    throw error;
  }
};

export const signOutGoogle = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (error: any) {
    console.log('Sign out error:', error);
  }
};