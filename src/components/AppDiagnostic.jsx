import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginModal from './LoginModal';
import { checkServerHealth } from '../utils/api';

export default function AppDiagnostic() {
  const [serverStatus, setServerStatus] = useState('checking');
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated, user, isLoading, error } = useAuth();

  useEffect(() => {
    const checkServer = async () => {
      try {
        const isHealthy = await checkServerHealth();
        setServerStatus(isHealthy ? 'online' : 'offline');
      } catch {
        setServerStatus('offline');
      }
    };
    
    checkServer();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🥗 Nutri-Ala POS - Diagnóstico del Sistema
        </h1>

        {/* Estado del servidor */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Estado del Servidor</h2>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              serverStatus === 'online' ? 'bg-green-500' : 
              serverStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-gray-700">
              {serverStatus === 'online' ? 'Servidor conectado (MongoDB + API)' :
               serverStatus === 'offline' ? 'Servidor desconectado' : 'Verificando...'}
            </span>
          </div>
          {serverStatus === 'offline' && (
            <div className="mt-3 p-3 bg-red-50 rounded-md">
              <p className="text-red-700 text-sm">
                ⚠️ El servidor no está respondiendo. Verifica que esté ejecutándose en puerto 5000
              </p>
            </div>
          )}
        </div>

        {/* Estado de autenticación */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Estado de Autenticación</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 rounded-md">
              <p className="text-red-700 text-sm">Error: {error}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-700">
                {isAuthenticated ? 'Usuario autenticado' : 'No autenticado'}
              </span>
            </div>
            
            {user && (
              <div className="ml-6 text-sm text-gray-600">
                <p><strong>Usuario:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Rol:</strong> {user.role}</p>
              </div>
            )}
          </div>

          {!isAuthenticated && serverStatus === 'online' && (
            <button
              onClick={() => setShowLogin(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión
            </button>
          )}
        </div>

        {/* Instrucciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Instrucciones</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>1. <strong>Servidor:</strong> Debe estar corriendo en puerto 5000</p>
            <p>2. <strong>MongoDB:</strong> Debe estar conectado a la base "NutriAla"</p>
            <p>3. <strong>Login:</strong> admin@nutri-ala.com / admin123</p>
            <p>4. Una vez autenticado, podrás acceder a todas las funcionalidades</p>
          </div>
          
          {serverStatus === 'offline' && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-md">
              <p className="text-yellow-700 text-sm">
                <strong>Para iniciar el servidor:</strong><br/>
                En terminal: <code>cd server && npm run dev</code>
              </p>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              ✅ Sistema OK - Recargar Aplicación
            </button>
          </div>
        )}
      </div>

      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
    </div>
  );
}