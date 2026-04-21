import React from 'react';
import { View } from 'react-native';

import AppNavigationNi from './src/navigations';

import rootSaga from './src/app/sagas';
import configureStore from './src/app/reducers';

import { Provider } from 'react-redux';

const { store, runSaga } = configureStore();
runSaga(rootSaga);

const App = () => {
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <AppNavigationNi />
      </View>
    </Provider>
  );
};

export default App;