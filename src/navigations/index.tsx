import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, StatusBar, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';

import AuthNav from './AuthNav';
import MainNav from './MainNav';

interface AuthState {
  auth: {
    data: any;
  };
}

const Navigation: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { data } = useSelector((state: AuthState) => state.auth);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#000000', true);
    }

    StatusBar.setBarStyle('dark-content', true);
  }, [isDarkMode]);

  console.log('TEST: ', JSON.stringify(data, null, 2));

  let isLoggedIn = !!data;

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainNav /> : <AuthNav />}
    </NavigationContainer>
  );
};

export default Navigation;
