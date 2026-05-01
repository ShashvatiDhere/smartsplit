import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../api/endpoints';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUser();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error('Profile fetch failed:', error.message);
      
      const status = error.response?.status;
      
      // If we already have a user (from login), just keep it. 
      // Otherwise, set a placeholder.
      if (!user) {
        if (status === 404 || status === 403 || !status) {
          setUser({ name: 'User', id: 'unknown' });
        } else if (status === 401) {
          setToken(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (data) => {
    console.log('DEBUG: Login Response Data:', data);
    
    const newToken = data.token || data.accessToken || data.jwtToken || (typeof data === 'string' ? data : null);
                     
    if (newToken && typeof newToken === 'string') {
      setToken(newToken);
      
      // If backend sends userId and name, save them immediately
      if (data.userId && data.userName) {
        setUser({
          id: data.userId,
          name: data.userName,
          email: data.userEmail || null
        });
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
