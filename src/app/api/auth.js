const BASE_URL = 'http://10.101.152.204:8000/api';
 const options = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export async function authLogin({ username, password }) {

  console.log("LOGIN PAYLOAD:", { username, password });

  const response = await fetch(BASE_URL + '/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  console.log("SERVER RESPONSE:", data);

  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Login failed');
  }
}