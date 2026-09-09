import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

function parseToken(token) {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('medAuthToken'));
  const [user, setUser] = useState(() => parseToken(localStorage.getItem('medAuthToken')));

  useEffect(() => {
    if (token) {
      localStorage.setItem('medAuthToken', token);
      setUser(parseToken(token));
    } else {
      localStorage.removeItem('medAuthToken');
      setUser(null);
    }
  }, [token]);

  const login = (tokenValue) => setToken(tokenValue);
  const logout = () => setToken(null);

  const value = useMemo(
    () => ({ token, user, login, logout, isAuthenticated: Boolean(user) }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
