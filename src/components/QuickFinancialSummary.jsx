import React from 'react';
import { useFinancial } from '../hooks/useFinancial';
import {
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function QuickFinancialSummary() {
  const {
    dailyRevenue,
    weeklyRevenue,
    monthlyRevenue,
    totalSalaries,
    totalAdminExpenses,
    dailyNetProfit,
    weeklyNetProfit,
    monthlyNetProfit,
    availableCash,
    checkFinancialAlerts,
    loading
  } = useFinancial();

  const alerts = checkFinancialAlerts();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const isHealthy = weeklyNetProfit > 0 && availableCash >= totalSalaries && alerts.length === 0;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      {/* Header */}
      <div className={`px-6 py-4 ${isHealthy ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            Resumen Financiero Integrado
          </h3>
          <div className="flex items-center gap-2">
            {isHealthy ? (
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            ) : (
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
            )}
            <span className={`text-sm font-medium ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
              {isHealthy ? 'Saludable' : 'Atención requerida'}
            </span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-200">
          <div className="space-y-2">
            {alerts.slice(0, 2).map((alert, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-yellow-800">
                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                {alert.message}
              </div>
            ))}
            {alerts.length > 2 && (
              <p className="text-xs text-yellow-600">
                +{alerts.length - 2} alertas más...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Financial Metrics */}
      <div className="p-6 space-y-4">
        {/* Revenue Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
            Ingresos
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Hoy</p>
              <p className="text-lg font-semibold text-green-600">
                ${dailyRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Semana</p>
              <p className="text-lg font-semibold text-green-600">
                ${weeklyRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Mes</p>
              <p className="text-lg font-semibold text-green-600">
                ${monthlyRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
            Gastos
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Sueldos (Semanal)</p>
              <p className="text-lg font-semibold text-blue-600">
                ${totalSalaries.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Admin (Mensual)</p>
              <p className="text-lg font-semibold text-blue-600">
                ${totalAdminExpenses.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Net Profit Section */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Ganancias Netas</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Hoy</p>
              <p className={`text-lg font-semibold ${dailyNetProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                ${dailyNetProfit.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Semana</p>
              <p className={`text-lg font-semibold ${weeklyNetProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                ${weeklyNetProfit.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Mes</p>
              <p className={`text-lg font-semibold ${monthlyNetProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                ${monthlyNetProfit.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Available Cash */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Efectivo Disponible</h4>
              <p className="text-xs text-gray-500">Para gastos e inversiones</p>
            </div>
            <div className="text-right">
              <p className={`text-xl font-bold ${availableCash >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                ${availableCash.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              {availableCash >= totalSalaries ? (
                <p className="text-xs text-green-600">✓ Suficiente para nómina</p>
              ) : (
                <p className="text-xs text-red-600">⚠ Insuficiente para nómina</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="border-t pt-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Sistema integrado - Ventas, Gastos y Sueldos conectados automáticamente
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
