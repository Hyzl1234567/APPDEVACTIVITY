const BASE_URL: string = 'http://192.168.101.11:8000/api';

const options: { headers: { Accept: string; 'Content-Type': string; } } = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

interface LoginParams {
  username: string;
  password: string;
}

interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export async function authLogin(params: LoginParams): Promise<any> {
  console.log("LOGIN PAYLOAD:", params);

  const response = await fetch(BASE_URL + '/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  console.log("SERVER RESPONSE:", data);

  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Login failed');
  }
}

export async function authRegister(params: RegisterParams): Promise<any> {
  const response = await fetch(BASE_URL + '/register', {
    method: 'POST',
    ...options,
    body: JSON.stringify(params),
  });

  const data = await response.json();
  console.log('REGISTER RESPONSE:', data);

  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Registration failed');
  }
}