// sagas/index.ts
import { all } from 'redux-saga/effects';
import { userLogin, userRegister, googleLogin } from './auth';

export default function* rootSaga() {
  yield all([
    userLogin(),
    userRegister(),
    googleLogin(),
  ]);
}