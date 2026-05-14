// src/app/sagas/products.ts

import { call, put, takeLatest } from 'redux-saga/effects';
import { getProducts, getCategories } from '../api/auth';
import {
  FETCH_PRODUCTS,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_ERROR,
  FETCH_CATEGORIES,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_ERROR,
} from '../reducers/products';

function* fetchProductsSaga(action: any): Generator<any, void, any> {
  try {
    yield put({ type: FETCH_PRODUCTS_REQUEST });
    const categoryId = action.payload?.categoryId;
    const data = yield call(getProducts, categoryId);
    yield put({ type: FETCH_PRODUCTS_SUCCESS, payload: data });
  } catch (error: any) {
    console.log('🔴 FETCH PRODUCTS ERROR:', error.message);
    yield put({ type: FETCH_PRODUCTS_ERROR, payload: error.message });
  }
}

function* fetchCategoriesSaga(): Generator<any, void, any> {
  try {
    yield put({ type: FETCH_CATEGORIES_REQUEST });
    const data = yield call(getCategories);
    yield put({ type: FETCH_CATEGORIES_SUCCESS, payload: data });
  } catch (error: any) {
    console.log('🔴 FETCH CATEGORIES ERROR:', error.message);
    yield put({ type: FETCH_CATEGORIES_ERROR, payload: error.message });
  }
}

export default function* productsSaga() {
  yield takeLatest(FETCH_PRODUCTS,   fetchProductsSaga);
  yield takeLatest(FETCH_CATEGORIES, fetchCategoriesSaga);
}