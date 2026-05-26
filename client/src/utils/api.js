import axios from 'axios';
import { getToken, setAuth, clearAuth } from './auth';

const authUrl = import.meta.env.VITE_API_AUTH_URL;

let refreshPromise = null;

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${authUrl}/refresh`, {}, { withCredentials: true })
      .then((res) => {
        const token = res.data.accessToken || res.data.token;
        setAuth({ token, user: res.data.user });
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

export const authFetch = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && token) {
    try {
      const newToken = await refreshAccessToken();
      headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    } catch {
      clearAuth();
      throw new Error('Session expired');
    }
  }

  return response;
};

export const logoutUser = async () => {
  try {
    await axios.post(`${authUrl}/logout`, {}, { withCredentials: true });
  } catch {
    // Clear local session even if server logout fails
  }
  clearAuth();
};

export const logoutAllDevices = async () => {
  const token = getToken();
  await axios.post(
    `${authUrl}/logout-all`,
    {},
    {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  clearAuth();
};
