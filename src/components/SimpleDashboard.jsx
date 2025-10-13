import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { productsAPI, checkServerHealth } from '../utils/api';

export default function SimpleDashboard() {
  const { user } = useAuth();
  const [serverStatus, setServerStatus] = useState('checking');
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Verificar servidor
        const isHealthy = await checkServerHealth();
        setServerStatus(isHealthy ? 'online' : 'offline');

        if (isHealthy) {
          // Cargar productos
          const response = await productsAPI.getAll({ limit: 1 });
          setProductsCount(response.totalProducts || 0);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setServerStatus('offline');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          🥗 ¡Bienvenido a Nutri-Ala POS!
        </h1>
        <p className="text-gray-600 mt-2">
          Hola {user?.fullName || 'Usuario'}, aquí tienes un resumen de tu sistema
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Server Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${
              serverStatus === 'online' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Estado del Servidor</h3>
              <p className={`text-sm ${
                serverStatus === 'online' ? 'text-green-600' : 'text-red-600'
              }`}>
                {serverStatus === 'online' ? 'MongoDB + API Conectado' : 'Desconectado'}
              </p>
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-3">📦</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Productos</h3>
              <p className="text-2xl font-bold text-blue-600">{productsCount}</p>
              <p className="text-sm text-gray-500">En inventario</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-3">👤</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Usuario Activo</h3>
              <p className="text-sm font-medium text-purple-600">{user?.role || 'N/A'}</p>
              <p className="text-sm text-gray-500">{user?.email || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a 
            href="/products" 
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📦</div>
            <p className="font-medium">Productos</p>
          </a>
          <a 
            href="/sales" 
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🛒</div>
            <p className="font-medium">Ventas</p>
          </a>
          <a 
            href="/customers" 
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">👥</div>
            <p className="font-medium">Clientes</p>
          </a>
          <a 
            href="/reports" 
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📊</div>
            <p className="font-medium">Reportes</p>
          </a>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">💡 Información del Sistema</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>✅ <strong>Base de datos:</strong> MongoDB "NutriAla" conectada</p>
          <p>✅ <strong>API:</strong> Node.js + Express funcionando</p>
          <p>✅ <strong>Autenticación:</strong> JWT activo</p>
          <p>✅ <strong>Frontend:</strong> React + Vite</p>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Última actualización: {new Date().toLocaleString('es-ES')}
        </div>
      </div>
    </div>
  );
}