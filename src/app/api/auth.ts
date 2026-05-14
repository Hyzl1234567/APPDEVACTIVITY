// src/app/api/auth.ts

export const BASE_URL: string = 'http://192.168.101.21:8000/api';

const options: { headers: { Accept: string; 'Content-Type': string } } = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface LoginParams {
  username: string;
  password: string;
}

interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

interface GoogleLoginParams {
  idToken: string;
  email: string;
  name: string;
  photo: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function authLogin(params: LoginParams): Promise<any> {
  console.log('LOGIN PAYLOAD:', params);

  const response = await fetch(BASE_URL + '/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const raw = await response.text();
  console.log('SERVER RESPONSE:', raw.substring(0, 300));

  try {
    const data = JSON.parse(raw);
    if (response.ok) return data;
    throw new Error(data.message || data.error || 'Login failed');
  } catch {
    throw new Error(`Login failed (status ${response.status})`);
  }
}

export async function authRegister(params: RegisterParams): Promise<any> {
  const response = await fetch(BASE_URL + '/register', {
    method: 'POST',
    ...options,
    body: JSON.stringify(params),
  });

  const raw = await response.text();
  console.log('REGISTER RESPONSE:', raw.substring(0, 300));

  try {
    const data = JSON.parse(raw);
    if (response.ok) return data;
    throw new Error(data.message || data.error || 'Registration failed');
  } catch {
    throw new Error(`Registration failed (status ${response.status})`);
  }
}

export async function authGoogleLogin(params: GoogleLoginParams): Promise<any> {
  console.log('GOOGLE LOGIN PAYLOAD:', params);

  const response = await fetch(BASE_URL + '/auth/google', {
    method: 'POST',
    ...options,
    body: JSON.stringify(params),
  });

  const raw = await response.text();
  console.log('GOOGLE LOGIN STATUS:', response.status);
  console.log('GOOGLE LOGIN RESPONSE:', raw.substring(0, 300));

  try {
    const data = JSON.parse(raw);
    if (response.ok) return data;
    throw new Error(data.message || data.error || 'Google login failed');
  } catch {
    throw new Error(`Google login failed (status ${response.status})`);
  }
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(categoryId?: number): Promise<any> {
  const url = categoryId
    ? `${BASE_URL}/products?category=${categoryId}`
    : `${BASE_URL}/products`;

  const response = await fetch(url, {
    method: 'GET',
    ...options,
  });

  const raw = await response.text();

  try {
    const data = JSON.parse(raw);
    if (response.ok) return data;
    throw new Error(data.message || data.error || 'Failed to fetch products');
  } catch {
    throw new Error(`Failed to fetch products (status ${response.status})`);
  }
}

export async function getCategories(): Promise<any> {
  const response = await fetch(`${BASE_URL}/categories`, {
    method: 'GET',
    ...options,
  });

  const raw = await response.text();

  try {
    const data = JSON.parse(raw);
    if (response.ok) return data;
    throw new Error(data.message || data.error || 'Failed to fetch categories');
  } catch {
    throw new Error(`Failed to fetch categories (status ${response.status})`);
  }
}