import React, { createContext, useReducer, useEffect } from 'react';
import { authAPI, setAuthToken, getAuthToken } from '../utils/api';

const AuthContext = createContext();

// Estados de autenticación
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Estado inicial
const initialState = {
  user: null,
  token: getAuthToken(),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Reducer para manejar el estado de autenticación
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

// Provider del contexto de autenticación
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar token al inicializar la aplicación
  useEffect(() => {
    const verifyToken = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          dispatch({ type: AUTH_ACTIONS.LOGIN_START });
          const response = await authAPI.verifyToken();
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: response.user,
              token,
            },
          });
        } catch (error) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_ERROR,
            payload: error.message,
          });
          // Limpiar token inválido
          localStorage.removeItem('authToken');
        }
      }
    };

    verifyToken();
  }, []);

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const response = await authAPI.login(credentials);
      
      // Guardar token en localStorage
      setAuthToken(response.token);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: response.user,
          token: response.token,
        },
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    authAPI.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Función para registrar usuario (solo admin)
  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: response.user,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permission) => {
    return state.user?.permissions?.[permission] || false;
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  const value = {
    // Estado
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Funciones
    login,
    logout,
    register,
    updateProfile,
    clearError,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;