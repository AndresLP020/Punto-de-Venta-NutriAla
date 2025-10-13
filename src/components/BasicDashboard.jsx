import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../utils/api';

export default function BasicDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    todaySales: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [products, customers, sales] = await Promise.all([
        api.getProducts(),
        api.getCustomers(),
        api.getSales()
      ]);

      const today = new Date().toDateString();
      const todaySales = sales.filter(sale => 
        new Date(sale.createdAt).toDateString() === today
      );

      setStats({
        totalProducts: products.length,
        totalCustomers: customers.length,
        todaySales: todaySales.length,
        totalRevenue: sales.reduce((sum, sale) => sum + sale.total, 0)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user?.name || 'Usuario'}
        </h1>
        <p className="text-gray-600">Panel de control - Nutri-Ala</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📦</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="text-2xl mr-3">👥</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🛒</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Hoy</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.todaySales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="text-2xl mr-3">💰</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">🔥 Acciones Rápidas</h2>
          <div className="space-y-3">
            <button 
              className="w-full text-left p-3 rounded border hover:bg-gray-50"
              onClick={() => window.location.href = '/sales'}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">🛒</span>
                <div>
                  <div className="font-medium">Nueva Venta</div>
                  <div className="text-sm text-gray-600">Registrar una nueva venta</div>
                </div>
              </div>
            </button>
            
            <button 
              className="w-full text-left p-3 rounded border hover:bg-gray-50"
              onClick={() => window.location.href = '/products'}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">📦</span>
                <div>
                  <div className="font-medium">Gestionar Productos</div>
                  <div className="text-sm text-gray-600">Agregar o editar productos</div>
                </div>
              </div>
            </button>
            
            <button 
              className="w-full text-left p-3 rounded border hover:bg-gray-50"
              onClick={() => window.location.href = '/customers'}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">👥</span>
                <div>
                  <div className="font-medium">Gestionar Clientes</div>
                  <div className="text-sm text-gray-600">Ver o agregar clientes</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">📊 Resumen del Sistema</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Estado del Servidor</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                ✅ Conectado
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Base de Datos</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                ✅ MongoDB
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Usuario Actual</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {user?.role || 'user'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}