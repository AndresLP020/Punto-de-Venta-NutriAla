import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export function AdminProvider({ children }) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Admin credentials (en una app real, esto sería más seguro)
  const ADMIN_PASSWORD = 'admin123';

  // Check if user is already in admin mode from localStorage
  useEffect(() => {
    const savedAdminMode = localStorage.getItem('nutriala_admin_mode');
    if (savedAdminMode === 'true') {
      setIsAdminMode(true);
    }
  }, []);

  const enterAdminMode = async (password) => {
    setIsAuthenticating(true);
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    localStorage.removeItem('nutriala_admin_mode');
  };

  const value = {
    isAdminMode,
    isAuthenticating,
    enterAdminMode,
    exitAdminMode
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
