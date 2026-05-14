// sagas/index.ts
import { all } from 'redux-saga/effects';
import { userLogin, userRegister, googleLogin } from './auth';
import productsSaga from './products';

export default function* rootSaga() {
  yield all([
    userLogin(),
    userRegister(),
    googleLogin(),
    productsSaga(),
  ]);
}