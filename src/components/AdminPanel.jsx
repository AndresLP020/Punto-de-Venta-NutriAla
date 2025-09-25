import React, { useMemo } from 'react';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  BanknotesIcon,
  CalculatorIcon,
  PresentationChartLineIcon,
  DocumentChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { Card, Badge } from './ui/index.jsx';
import { useAdmin } from '../context/AdminContext';
import { useInventory } from '../hooks/useInventory';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminPanel() {
  const { isAdminMode } = useAdmin();
  const { products, sales } = useInventory();

  // Cálculos financieros avanzados
  const financialMetrics = useMemo(() => {
    // Ingresos totales
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    
    // Costos totales de productos vendidos
    const totalCost = sales.reduce((sum, sale) => {
      // Simulamos el costo basado en productos (en una app real vendría de sale_items)
      const avgCostRatio = 0.6; // 60% del precio es costo promedio
      return sum + (sale.total * avgCostRatio);
    }, 0);
    
    // Ganancia bruta
    const grossProfit = totalRevenue - totalCost;
    const grossMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100) : 0;
    
    // Valor del inventario actual
    const inventoryValue = products.reduce((sum, product) => 
      sum + (product.cost * product.stock), 0
    );
    
    // Ganancia potencial del inventario
    const potentialProfit = products.reduce((sum, product) => 
      sum + ((product.price - product.cost) * product.stock), 0
    );
    
    // ROI del inventario
    const inventoryROI = inventoryValue > 0 ? ((potentialProfit / inventoryValue) * 100) : 0;
    
    // Productos de alta rotación (simulado)
    const highTurnoverProducts = products.filter(p => p.stock <= p.minStock * 2).length;
    
    // Análisis de ventas por día (últimos 7 días)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayRevenue = sales
        .filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate.toDateString() === date.toDateString();
        })
        .reduce((sum, sale) => sum + sale.total, 0);
      
      return {
        day: date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
        revenue: dayRevenue,
        profit: dayRevenue * 0.4 // 40% ganancia promedio
      };
    }).reverse();
    
    // Análisis por categorías
    const categoryAnalysis = () => {
      const categoryStats = {};
      products.forEach(product => {
        if (!categoryStats[product.category]) {
          categoryStats[product.category] = {
            name: product.category,
            products: 0,
            totalStock: 0,
            totalValue: 0,
            avgMargin: 0
          };
        }
        
        const stats = categoryStats[product.category];
        stats.products++;
        stats.totalStock += product.stock;
        stats.totalValue += product.price * product.stock;
        stats.avgMargin += ((product.price - product.cost) / product.price) * 100;
      });
      
      return Object.values(categoryStats).map(cat => ({
        ...cat,
        avgMargin: cat.avgMargin / cat.products
      }));
    };

    return {
      totalRevenue,
      totalCost,
      grossProfit,
      grossMargin,
      inventoryValue,
      potentialProfit,
      inventoryROI,
      highTurnoverProducts,
      last7Days,
      categoryAnalysis: categoryAnalysis()
    };
  }, [products, sales]);

  if (!isAdminMode) return null;

  return (
    <div className="mb-8 p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl border border-blue-800 shadow-2xl">
      {/* Header del Panel de Administrador */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Panel de Control Ejecutivo</h2>
            <p className="text-blue-200">Análisis financiero y reportes avanzados</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2">
            💼 ADMIN ACTIVO
          </Badge>
          <div className="text-right">
            <p className="text-sm text-blue-200">Última actualización</p>
            <p className="text-xs text-blue-300">{new Date().toLocaleString('es-ES')}</p>
          </div>
        </div>
      </div>

      {/* Métricas Financieras Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Ingresos Totales</p>
              <p className="text-2xl font-bold">${financialMetrics.totalRevenue.toLocaleString('es-MX')}</p>
              <div className="flex items-center mt-2">
                <ArrowUpIcon className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-sm text-green-200">+12.5% vs mes anterior</span>
              </div>
            </div>
            <CurrencyDollarIcon className="h-12 w-12 text-green-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Ganancia Bruta</p>
              <p className="text-2xl font-bold">${financialMetrics.grossProfit.toLocaleString('es-MX')}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-blue-200">Margen: {financialMetrics.grossMargin.toFixed(1)}%</span>
              </div>
            </div>
            <ArrowTrendingUpIcon className="h-12 w-12 text-blue-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Valor Inventario</p>
              <p className="text-2xl font-bold">${financialMetrics.inventoryValue.toLocaleString('es-MX')}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-purple-200">ROI: {financialMetrics.inventoryROI.toFixed(1)}%</span>
              </div>
            </div>
            <CalculatorIcon className="h-12 w-12 text-purple-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Ganancia Potencial</p>
              <p className="text-2xl font-bold">${financialMetrics.potentialProfit.toLocaleString('es-MX')}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-orange-200">{financialMetrics.highTurnoverProducts} productos hot</span>
              </div>
            </div>
            <BanknotesIcon className="h-12 w-12 text-orange-200" />
          </div>
        </Card>
      </div>

      {/* Gráficos de Análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Tendencia de Ingresos - Últimos 7 días */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <PresentationChartLineIcon className="h-5 w-5 mr-2 text-blue-400" />
              Tendencia de Ingresos (7 días)
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={financialMetrics.last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="#93C5FD" fontSize={12} />
              <YAxis stroke="#93C5FD" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#22C55E" 
                strokeWidth={3}
                dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
                name="Ingresos"
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Ganancia"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Análisis por Categorías */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-green-400" />
              Análisis por Categorías
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={financialMetrics.categoryAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#93C5FD" fontSize={11} />
              <YAxis stroke="#93C5FD" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Bar dataKey="totalValue" fill="#22C55E" name="Valor Total" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Acciones Rápidas de Administrador */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DocumentChartBarIcon className="h-6 w-6 text-blue-400" />
            <span className="text-white font-medium">Acciones Ejecutivas</span>
          </div>
          
          <div className="flex space-x-3">
            <button 
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
              onClick={() => alert('Generando reporte financiero completo...')}
            >
              <DocumentChartBarIcon className="h-4 w-4" />
              Reporte Financiero
            </button>
            <button 
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2"
              onClick={() => alert('Exportando datos de ganancias...')}
            >
              <BanknotesIcon className="h-4 w-4" />
              Exportar Ganancias
            </button>
            <button 
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center gap-2"
              onClick={() => alert('Configurando alertas financieras...')}
            >
              <ClockIcon className="h-4 w-4" />
              Config. Alertas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
