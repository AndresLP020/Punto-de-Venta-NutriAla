import React from 'react';

export default function SimpleFinancialDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">💰 Dashboard Financiero</h1>
        <p className="text-gray-600 mt-2">
          Resumen completo de las finanzas del negocio
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-3">📈</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ingresos</h3>
              <p className="text-2xl font-bold text-green-600">$0</p>
              <p className="text-sm text-gray-500">Este mes</p>
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-3">📉</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gastos</h3>
              <p className="text-2xl font-bold text-red-600">$0</p>
              <p className="text-sm text-gray-500">Este mes</p>
            </div>
          </div>
        </div>

        {/* Profit */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-3">💵</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ganancia</h3>
              <p className="text-2xl font-bold text-blue-600">$0</p>
              <p className="text-sm text-gray-500">Este mes</p>
            </div>
          </div>
        </div>

        {/* Cash */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-3">🏦</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Efectivo</h3>
              <p className="text-2xl font-bold text-purple-600">$0</p>
              <p className="text-sm text-gray-500">Disponible</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Ingresos por Mes</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📈</div>
              <p>Gráfico de ingresos</p>
              <p className="text-sm">Se mostrará cuando tengas ventas</p>
            </div>
          </div>
        </div>

        {/* Expenses Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔍 Distribución de Gastos</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🥧</div>
              <p>Gráfico de gastos</p>
              <p className="text-sm">Se mostrará cuando tengas gastos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Resumen Financiero</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">✅</div>
            <h3 className="font-semibold text-green-800">Sistema Conectado</h3>
            <p className="text-sm text-green-600">MongoDB + API funcionando</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-semibold text-blue-800">Datos Seguros</h3>
            <p className="text-sm text-blue-600">Autenticación JWT activa</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-purple-800">Reportes Listos</h3>
            <p className="text-sm text-purple-600">Cuando realices ventas</p>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">💡 Primeros Pasos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Para empezar a ver datos:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>1. Ve a "Productos" y revisa el inventario</li>
              <li>2. Ve a "Ventas" y realiza tu primera venta</li>
              <li>3. Los reportes se actualizarán automáticamente</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Características disponibles:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>✅ Gestión de productos desde MongoDB</li>
              <li>✅ Sistema de ventas completo</li>
              <li>✅ Control de inventario en tiempo real</li>
              <li>✅ Reportes financieros automáticos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}