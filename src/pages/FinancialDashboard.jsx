import React from 'react';
import QuickFinancialSummary from '../components/QuickFinancialSummary';

export default function FinancialDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">💰 Dashboard Financiero</h1>
        <p className="text-gray-600 mt-2">
          Resumen completo de las finanzas del negocio con datos en tiempo real
        </p>
      </div>
      
      <QuickFinancialSummary />
      
      {/* Status Cards */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">💡 Información</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Datos en tiempo real:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>✅ Conectado a MongoDB</li>
              <li>✅ Ventas sincronizadas automáticamente</li>
              <li>✅ Cálculos financieros dinámicos</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Después de realizar ventas:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>📊 Los ingresos se actualizan automáticamente</li>
              <li>💰 El efectivo disponible se recalcula</li>
              <li>📈 Las métricas se refrescan en tiempo real</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
