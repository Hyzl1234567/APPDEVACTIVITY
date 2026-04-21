import { call, put, takeEvery } from 'redux-saga/effects';
import { authLogin, authRegister } from '../api/auth';

import {
  USER_LOGIN,
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,

  USER_REGISTER,
  USER_REGISTER_REQUEST,
  USER_REGISTER_COMPLETED,
  USER_REGISTER_ERROR,
} from '../actions';

/* ===================== LOGIN ===================== */
export function* userLoginAsync(action: { type: string; payload: any }): Generator {
  console.log("LOGIN SAGA STARTED");

  yield put({ type: USER_LOGIN_REQUEST });

  try {
    const response = yield call(authLogin, action.payload);

    console.log("LOGIN API RESPONSE:", response);

    yield put({
      type: USER_LOGIN_COMPLETED,
      payload: response,
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);

    yield put({
      type: USER_LOGIN_ERROR,
      payload: (error as Error).message,
    });
  }
}

export function* userLogin(): Generator {
  yield takeEvery(USER_LOGIN, userLoginAsync);
}

/* ===================== REGISTER ===================== */
export function* userRegisterAsync(action: { type: string; payload: any }): Generator {
  console.log("REGISTER SAGA STARTED");
  console.log("REGISTER PAYLOAD:", action.payload);

  yield put({ type: USER_REGISTER_REQUEST });

  try {
    const response = yield call(authRegister, action.payload);

    console.log("REGISTER API RESPONSE:", response);

    yield put({
      type: USER_REGISTER_COMPLETED,
      payload: response,
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);

    yield put({
      type: USER_REGISTER_ERROR,
      payload: (error as Error).message,
    });
  }
}

export function* userRegister(): Generator {
  yield takeEvery(USER_REGISTER, userRegisterAsync);
}