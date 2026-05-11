// src/screens/auth/Login.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { USER_LOGIN, GOOGLE_LOGIN } from '../../app/actions';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '512408116637-vgb799pif9ood7h4vomi630p09e1gomm.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  scopes: ['profile', 'email'],
});

type LoginScreenNavigationProp = {
  navigate: (screen: string) => void;
};

interface LoginProps {
  navigation: LoginScreenNavigationProp;
}

interface AuthState {
  auth: {
    data: any;
    loading: boolean;
    error: string | null;
  };
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const authState = useSelector((state: AuthState) => state.auth);

  const [emailAdd, setEmailAdd] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  useEffect(() => {
    if (authState.data) {
      console.log('✅ LOGIN SUCCESS - Redux updated:', authState.data);
    }
  }, [authState.data]);

  useEffect(() => {
    if (authState.error) {
      Alert.alert('Login Failed', authState.error);
      console.log('❌ LOGIN ERROR:', authState.error);
    }
  }, [authState.error]);

  const handleLogin = (): void => {
    console.log('LOGIN BUTTON PRESSED');

    if (!emailAdd || !password) {
      Alert.alert('Missing Information', 'Please enter both username and password.');
      return;
    }

    dispatch({
      type: USER_LOGIN,
      payload: {
        username: emailAdd,
        password: password,
      },
    });
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      setIsGoogleLoading(true);
      console.log('🔵 STEP 1: Starting Google Sign-In');

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.log('🔵 STEP 2: Play Services OK');

      await GoogleSignin.signOut();
      console.log('🔵 STEP 3: Signed out previous account');

      console.log('🔵 STEP 4: Opening Google sign-in popup...');
      const userInfo = await GoogleSignin.signIn();
      console.log('🔵 STEP 5: COMPLETE - Got Google user info');

      // Extract Google ID token and user info
      const googleIdToken: string =
        (userInfo as any)?.data?.idToken ||
        (userInfo as any)?.idToken ||
        '';
      const email: string =
        (userInfo as any)?.data?.user?.email ||
        (userInfo as any)?.user?.email ||
        '';
      const name: string =
        (userInfo as any)?.data?.user?.name ||
        (userInfo as any)?.user?.name ||
        '';
      const photo: string =
        (userInfo as any)?.data?.user?.photo ||
        (userInfo as any)?.user?.photo ||
        '';

      console.log('📧 Email:', email);
      console.log('👤 Name:', name);
      console.log('🔑 Google ID Token exists:', !!googleIdToken);

      if (!googleIdToken || !email) {
        Alert.alert('Error', 'Failed to get account information from Google');
        return;
      }

      // --- STEP: Exchange Google token for Firebase token ---
      console.log('🔵 STEP 6: Exchanging Google token with Firebase...');
      const googleCredential = auth.GoogleAuthProvider.credential(googleIdToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const firebaseToken = await userCredential.user.getIdToken();
      console.log('🔵 STEP 7: Got Firebase ID token ✅');
      // ------------------------------------------------------

      // Show confirmation dialog
      Alert.alert(
        'EcoBrew Ordering System',
        'Continue with this Google account?\n\n' +
          '👤 ' + name + '\n' +
          '📧 ' + email,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              console.log('User cancelled');
            },
          },
          {
            text: 'Continue',
            onPress: () => {
              console.log('User confirmed, dispatching...');

              dispatch({
                type: GOOGLE_LOGIN,
                payload: {
                  idToken: firebaseToken, // ← Firebase token, not Google token
                  email,
                  name,
                  photo,
                },
              });

              console.log('🔵 STEP 8: Dispatched GOOGLE_LOGIN to saga');
            },
          },
        ],
        { cancelable: true },
      );

    } catch (error: any) {
      console.log('🔴 ERROR CODE:', error.code);
      console.log('🔴 ERROR MESSAGE:', error.message);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled sign-in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Sign-in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services not available on this device');
      } else if (error.code === '12501') {
        Alert.alert('Sign-In Failed', 'Error 12501: Check SHA-1 fingerprint in Firebase Console');
      } else {
        Alert.alert('Google Sign-In Error', error.message || 'Something went wrong');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1D4A23" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>☕</Text>
            </View>
            <Text style={styles.subtitleText}>Nature in Every Cup</Text>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={[styles.inputContainer, focusedInput === 'email' && styles.inputContainerFocused]}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor="#999"
                  value={emailAdd}
                  onChangeText={setEmailAdd}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputContainer, focusedInput === 'password' && styles.inputContainerFocused]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Text style={styles.eyeText}>{showPassword ? '😶‍🌫️' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity style={styles.rememberMeContainer}>
                <Text style={styles.checkbox}>☑️</Text>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={styles.loginButtonText}>LOGIN</Text>
              <Text style={styles.buttonIcon}>→</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.googleButton, isGoogleLoading && styles.googleButtonDisabled]}
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Text style={styles.googleButtonText}>Signing in...</Text>
              ) : (
                <>
                  <Text style={styles.googleIcon}>G</Text>
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footerText}>© 2026 EcoBrew Ordering System</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d5e8c3' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  headerSection: { alignItems: 'center', marginBottom: 40 },
  logoContainer: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: '#1D4A23',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  logoEmoji: { fontSize: 60 },
  welcomeText: { fontSize: 32, fontWeight: 'bold', color: '#1D4A23', marginBottom: 5 },
  subtitleText: { fontSize: 14, color: '#666', textAlign: 'center' },
  formSection: {
    backgroundColor: '#99CC67', borderRadius: 20, padding: 25,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#1D4A23', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA',
    borderRadius: 12, borderWidth: 2, borderColor: '#E0E0E0', paddingHorizontal: 15, height: 50,
  },
  inputContainerFocused: { borderColor: '#99CC67', backgroundColor: '#FFF' },
  inputIcon: { marginRight: 10, fontSize: 20 },
  input: { flex: 1, fontSize: 16, color: '#333', paddingVertical: 0 },
  eyeIcon: { padding: 5 },
  eyeText: { fontSize: 20 },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  rememberMeContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { fontSize: 18, marginRight: 5 },
  rememberMeText: { fontSize: 14, color: '#666' },
  forgotPasswordText: { fontSize: 14, color: '#1D4A23', fontWeight: '600' },
  loginButton: {
    backgroundColor: '#1D4A23', borderRadius: 12, height: 55,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#1D4A23', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  loginButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  buttonIcon: { marginLeft: 10, color: '#FFF', fontSize: 20 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  dividerText: { marginHorizontal: 15, color: '#999', fontSize: 14, fontWeight: '500' },
  googleButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 12, height: 55, marginBottom: 20,
    borderWidth: 1, borderColor: '#E0E0E0', shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  googleButtonDisabled: { opacity: 0.6 },
  googleIcon: { fontSize: 20, fontWeight: 'bold', color: '#4285F4', marginRight: 10 },
  googleButtonText: { fontSize: 15, fontWeight: '600', color: '#333' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerText: { fontSize: 14, color: '#666' },
  registerLink: { fontSize: 14, color: '#1D4A23', fontWeight: 'bold' },
  footerText: { textAlign: 'center', color: '#999', fontSize: 12, marginTop: 30 },
});

export default Login;
