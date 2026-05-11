import React, { useEffect } from 'react';
import { View } from 'react-native';

import AppNavigationNi from './src/navigations';

import rootSaga from './src/app/sagas';
import configureStore from './src/app/reducers';

import { Provider } from 'react-redux';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

const { store, runSaga } = configureStore();
runSaga(rootSaga);

const App = () => {

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '512408116637-vgb799pif9ood7h4vomi630p09e1gomm.apps.googleusercontent.com',
    });
  }, []);

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <AppNavigationNi />
      </View>
    </Provider>
  );
};

export default App;