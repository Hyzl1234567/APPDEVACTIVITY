import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { Platform, StatusBar, useColorScheme } from 'react-native';

import AuthNav from './AuthNav';
import MainNav from './MainNav';
import { useSelector } from 'react-redux';

export default () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { data } = useSelector(state => state.auth);

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
