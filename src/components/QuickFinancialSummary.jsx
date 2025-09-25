import React from 'react';
import { 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { Card } from './ui/index.jsx';
import { useInventory } from '../hooks/useInventory';

export default function QuickFinancialSummary() {
  const { products, sales } = useInventory();

  // Cálculos rápidos para el resumen
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProfit = totalRevenue * 0.35; // 35% ganancia promedio
  const lowStockAlert = products.filter(p => p.stock <= p.minStock).length;
  const highValueProducts = products.filter(p => (p.price * p.stock) > 5000).length;

  return (
    <div className="mb-6">
      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 text-white border-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-300">Ingresos</p>
                <p className="font-bold">${totalRevenue.toLocaleString('es-MX')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ArrowTrendingUpIcon className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-300">Ganancia</p>
                <p className="font-bold">${totalProfit.toLocaleString('es-MX')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-300">Alto Valor</p>
                <p className="font-bold">{highValueProducts} productos</p>
              </div>
            </div>
            
            {lowStockAlert > 0 && (
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-yellow-300">Stock Bajo</p>
                  <p className="font-bold text-yellow-400">{lowStockAlert} alertas</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-400">Resumen Ejecutivo</p>
            <p className="text-xs text-gray-500">Actualizado: {new Date().toLocaleTimeString('es-ES')}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
