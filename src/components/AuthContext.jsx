import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedIsAdmin = localStorage.getItem('isAdmin');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAdmin(savedIsAdmin === 'true');
    }
  }, []);

  const login = (username, password, isAdminLogin = false) => {
    // Admin login
    if (isAdminLogin) {
      const correctUsername = 'admin';
      const correctPassword = 'admin123';
      
      if (username !== correctUsername && password !== correctPassword) {
        return { 
          success: false, 
          type: 'admin', 
          error: 'both',
          correctUsername,
          correctPassword 
        };
      }
      if (username !== correctUsername) {
        return { 
          success: false, 
          type: 'admin', 
          error: 'username',
          correctUsername,
          correctPassword 
        };
      }
      if (password !== correctPassword) {
        return { 
          success: false, 
          type: 'admin', 
          error: 'password',
          correctUsername,
          correctPassword 
        };
      }
      
      // Login berhasil
      const adminUser = { username: 'admin' };
      setUser(adminUser);
      setIsAdmin(true);
      localStorage.setItem('user', JSON.stringify(adminUser));
      localStorage.setItem('isAdmin', 'true');
      return { success: true, type: 'admin' };
    } 
    // User login
    else {
      const correctUsername = 'azmi';
      const correctPassword = 'azmi123';
      
      if (username !== correctUsername && password !== correctPassword) {
        return { 
          success: false, 
          type: 'user', 
          error: 'both',
          correctUsername,
          correctPassword 
        };
      }
      if (username !== correctUsername) {
        return { 
          success: false, 
          type: 'user', 
          error: 'username',
          correctUsername,
          correctPassword 
        };
      }
      if (password !== correctPassword) {
        return { 
          success: false, 
          type: 'user', 
          error: 'password',
          correctUsername,
          correctPassword 
        };
      }
      
      // Login berhasil
      const regularUser = { username: 'azmi' };
      setUser(regularUser);
      setIsAdmin(false);
      localStorage.setItem('user', JSON.stringify(regularUser));
      localStorage.setItem('isAdmin', 'false');
      return { success: true, type: 'user' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
  };

  const value = {
    user,
    isAdmin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};