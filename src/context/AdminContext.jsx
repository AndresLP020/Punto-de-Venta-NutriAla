import React, { useState, useEffect } from 'react';
import { AdminContext } from './AdminContextDef';

export function AdminProvider({ children }) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const savedAdminMode = localStorage.getItem('nutriala_admin_mode');
      
      if (token) {
        setIsAuthenticated(true);
        if (savedAdminMode === 'true') {
          setIsAdminMode(true);
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const enterAdminMode = async (password) => {
    setIsAuthenticating(true);
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const ADMIN_PASSWORD = 'admin123';
    
    if (password === ADMIN_PASSWORD) {
      setIsAdminMode(true);
      localStorage.setItem('nutriala_admin_mode', 'true');
      setIsAuthenticating(false);
      
      return { success: true };
    } else {
      setIsAuthenticating(false);
      return { success: false, error: 'Contraseña incorrecta' };
    }
  };

  const exitAdminMode = () => {
    setIsAdminMode(false);
    setIsAuthenticated(false);
    localStorage.removeItem('nutriala_admin_mode');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
  };

  const value = {
    isAdminMode,
    isAuthenticated,
    isAuthenticating,
    isLoading,
    setIsAuthenticated,
    enterAdminMode,
    exitAdminMode
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
