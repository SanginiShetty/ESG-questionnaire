
const TOKEN_KEY = 'esg_token';
const USER_KEY = 'esg_user';

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const setUser = (user: unknown) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getUser = (): unknown => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};