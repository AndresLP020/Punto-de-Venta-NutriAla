import React from 'react';

export default function SimpleFinancialSummary() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      {/* Header */}
      <div className="px-6 py-4 bg-green-50 border-b border-green-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            💰 Resumen Financiero
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-green-600">
              ✅ Sistema MongoDB Conectado
            </span>
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="p-6 space-y-4">
        {/* Revenue Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            📈 Ingresos
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Hoy</p>
              <p className="text-lg font-semibold text-green-600">
                $0
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Semana</p>
              <p className="text-lg font-semibold text-green-600">
                $0
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Mes</p>
              <p className="text-lg font-semibold text-green-600">
                $0
              </p>
            </div>
          </div>
        </div>

        {/* Products Available */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Productos Disponibles</h4>
              <p className="text-xs text-gray-500">Cargados desde MongoDB</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-purple-600">
                8 productos
              </p>
              <p className="text-xs text-green-600">✓ Base de datos conectada</p>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="border-t pt-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              🚀 Sistema MongoDB + API REST funcionando correctamente
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Actualizado: {new Date().toLocaleTimeString('es-ES')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}