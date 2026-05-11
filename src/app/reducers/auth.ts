// app/reducers/auth.ts
import {
  USER_LOGIN,
  USER_LOGIN_REQUEST,
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_RESET,
  GOOGLE_LOGIN,
  GOOGLE_LOGIN_REQUEST,
  GOOGLE_LOGIN_COMPLETED,
  GOOGLE_LOGIN_ERROR,
} from '../actions';

interface AuthState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  data: null,
  loading: false,
  error: null,
};

export default (state = initialState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case USER_LOGIN:
      return { ...state, data: null, error: null, loading: false };
    
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    
    case USER_LOGIN_COMPLETED:
      return { ...state, loading: false, data: payload, error: null };
    
    case USER_LOGIN_ERROR:
      return { ...state, loading: false, error: payload };

    case GOOGLE_LOGIN:
      return { ...state, data: null, error: null, loading: false };
    
    case GOOGLE_LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    
    case GOOGLE_LOGIN_COMPLETED:
      console.log('🔵 REDUCER: GOOGLE_LOGIN_COMPLETED with payload:', payload);
      return { ...state, loading: false, data: payload, error: null };
    
    case GOOGLE_LOGIN_ERROR:
      return { ...state, loading: false, error: payload };

    case USER_LOGIN_RESET:
      return initialState;

    default:
      return state;
  }
};