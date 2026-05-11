// sagas/authSaga.ts
import { call, put, takeEvery } from 'redux-saga/effects';
import { authLogin, authRegister, authGoogleLogin } from '../api/auth';

import {
  USER_LOGIN,
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
  USER_REGISTER,
  USER_REGISTER_REQUEST,
  USER_REGISTER_COMPLETED,
  USER_REGISTER_ERROR,
  GOOGLE_LOGIN,
  GOOGLE_LOGIN_REQUEST,
  GOOGLE_LOGIN_COMPLETED,
  GOOGLE_LOGIN_ERROR,
} from '../actions';

/* ===================== LOGIN ===================== */
export function* userLoginAsync(action: { type: string; payload: any }): Generator {
  console.log('LOGIN SAGA STARTED');

  yield put({ type: USER_LOGIN_REQUEST });

  try {
    const response = yield call(authLogin, action.payload);
    console.log('LOGIN API RESPONSE:', response);

    yield put({
      type: USER_LOGIN_COMPLETED,
      payload: response,
    });
  } catch (error) {
    console.log('LOGIN ERROR:', error);

    yield put({
      type: USER_LOGIN_ERROR,
      payload: (error as Error).message,
    });
  }
}

export function* userLogin(): Generator {
  yield takeEvery(USER_LOGIN, userLoginAsync);
}

/* ===================== GOOGLE LOGIN ===================== */
export function* googleLoginAsync(action: { type: string; payload: any }): Generator {
  console.log('🔵 GOOGLE LOGIN SAGA STARTED');
  console.log('📦 PAYLOAD:', action.payload);

  yield put({ type: GOOGLE_LOGIN_REQUEST });

  try {
    const response = yield call(authGoogleLogin, action.payload);
    console.log('🟢 GOOGLE LOGIN API RESPONSE:', response);

    yield put({
      type: GOOGLE_LOGIN_COMPLETED,
      payload: response,
    });
    
    console.log('✅ GOOGLE_LOGIN_COMPLETED dispatched');
  } catch (error) {
    console.log('🔴 GOOGLE LOGIN ERROR:', error);

    yield put({
      type: GOOGLE_LOGIN_ERROR,
      payload: (error as Error).message,
    });
  }
}

export function* googleLogin(): Generator {
  yield takeEvery(GOOGLE_LOGIN, googleLoginAsync);
}

/* ===================== REGISTER ===================== */
export function* userRegisterAsync(action: { type: string; payload: any }): Generator {
  console.log('REGISTER SAGA STARTED');
  console.log('REGISTER PAYLOAD:', action.payload);

  yield put({ type: USER_REGISTER_REQUEST });

  try {
    const response = yield call(authRegister, action.payload);
    console.log('REGISTER API RESPONSE:', response);

    yield put({
      type: USER_REGISTER_COMPLETED,
      payload: response,
    });
  } catch (error) {
    console.log('REGISTER ERROR:', error);

    yield put({
      type: USER_REGISTER_ERROR,
      payload: (error as Error).message,
    });
  }
}

export function* userRegister(): Generator {
  yield takeEvery(USER_REGISTER, userRegisterAsync);
}