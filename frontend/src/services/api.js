const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function loginUser(gmail, password) {
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
