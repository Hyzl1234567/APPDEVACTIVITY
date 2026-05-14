import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';

import auth from '../reducers/auth';
import products from '../reducers/products';

// Config
const sagaMiddleware = createSagaMiddleware();

// Combine Reducers
const rootReducer = combineReducers({
  auth,
  products,
});

export default (): { store: Store; runSaga: (saga: any) => any } => {
  let store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

  const runSaga = sagaMiddleware.run;

  return { store, runSaga };
};