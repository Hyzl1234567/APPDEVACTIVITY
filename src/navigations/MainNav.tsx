import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from '../utils';

import Home from '../screens/HomeScreen';
import Profile from '../screens/ProfileScreen';
import ErrorScreen from '../screens/ErrorScreen';

const Stack = createStackNavigator();

const MainNavigation: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTES.HOME}>
      <Stack.Screen name={ROUTES.HOME} component={Home} />
      <Stack.Screen name={ROUTES.PROFILE} component={Profile} />
      <Stack.Screen name={ROUTES.ERROR} component={ErrorScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
