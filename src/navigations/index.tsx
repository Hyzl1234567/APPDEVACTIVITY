// src/navigations/index.ts
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, StatusBar, useColorScheme, View, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

import AuthNav from './AuthNav';
import MainNav from './MainNav';

interface AuthState {
  auth: {
    data: any;
    loading: boolean;
    error: string | null;
  };
}

const Navigation: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { data, loading } = useSelector((state: AuthState) => state.auth);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#000000', true);
    }
    StatusBar.setBarStyle('dark-content', true);
  }, [isDarkMode]);

  console.log('NAV STATE:', { hasData: !!data, loading });

  // Show loading spinner while authenticating
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#d5e8c3' }}>
        <ActivityIndicator size="large" color="#1D4A23" />
      </View>
    );
  }

  const isLoggedIn = !!data;

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainNav /> : <AuthNav />}
    </NavigationContainer>
  );
};

export default Navigation;