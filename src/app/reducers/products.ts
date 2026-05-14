// src/app/reducers/products.ts

export const FETCH_PRODUCTS         = 'FETCH_PRODUCTS';
export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_ERROR   = 'FETCH_PRODUCTS_ERROR';

export const FETCH_CATEGORIES         = 'FETCH_CATEGORIES';
export const FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_ERROR   = 'FETCH_CATEGORIES_ERROR';

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
  size: string | null;
  quantity: number;
  category: Category | null;
}

interface ProductsState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
};

export default (state = initialState, action: any): ProductsState => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_PRODUCTS_REQUEST:
    case FETCH_CATEGORIES_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_PRODUCTS_SUCCESS:
      return { ...state, loading: false, products: payload };

    case FETCH_CATEGORIES_SUCCESS:
      return { ...state, loading: false, categories: payload };

    case FETCH_PRODUCTS_ERROR:
    case FETCH_CATEGORIES_ERROR:
      return { ...state, loading: false, error: payload };

    default:
      return state;
  }
};