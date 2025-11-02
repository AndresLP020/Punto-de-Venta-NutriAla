import { useState, useContext } from 'react';
import { AdminContext } from '../context/AdminContextDef';

export function useAuth() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AdminContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://nutri-ala-backend.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Guardar token en localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('nutriala_admin_mode', 'true');
        
        // Actualizar estado de autenticación
        setIsAuthenticated(true);
        
        setIsLoading(false);
        return { success: true };
      } else {
        setError(data.message || 'Error al iniciar sesión');
        setIsLoading(false);
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error de login:', error);
      const errorMessage = 'Error de conexión con el servidor';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    // Limpiar token y datos de sesión
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('nutriala_admin_mode');
    setIsAuthenticated(false);
    setError(null);
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuthStatus
  };
}