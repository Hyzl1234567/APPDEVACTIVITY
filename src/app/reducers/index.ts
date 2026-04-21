import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { persistReducer, persistStore, Persistor } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import AsyncStorage from '@react-native-async-storage/async-storage';

import auth from '../reducers/auth';

// Config
const sagaMiddleware = createSagaMiddleware();
const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['auth'],
};

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  blacklist: [],
};

// Combine Reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, auth),
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export default (): { store: Store; persistor: Persistor; runSaga: (saga: any) => any } => {
  let store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));

  let persistor = persistStore(store);

  const runSaga = sagaMiddleware.run;

  return { store, persistor, runSaga };
};
