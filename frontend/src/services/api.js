const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
export const isDemoLoginEnabled =
  import.meta.env.VITE_DEMO_LOGIN?.trim().toLowerCase() === 'true';

const DEMO_USER = {
  gmail: 'testing@gmail.com',
  password: 'testing123',
};

export async function loginUser(gmail, password) {
  const normalizedGmail = gmail.trim().toLowerCase();
  const isDemoUser =
    normalizedGmail === DEMO_USER.gmail && password === DEMO_USER.password;

  if (isDemoUser) {
    return {
      id: 'demo-user',
      name: 'Usuario de prueba',
      gmail: DEMO_USER.gmail,
    };
  }

  if (isDemoLoginEnabled) {
    throw new Error('Correo o contrasena incorrectos');
  }

  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gmail, password }),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'No fue posible iniciar sesión.');
  }

  return result.data;
}
