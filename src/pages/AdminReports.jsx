import React, { useMemo } from 'react';
import {
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  TrophyIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';
import { Card, Button } from '../components/ui/index.jsx';
import { useInventory } from '../hooks/useInventory';
import { useAdmin } from '../context/AdminContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminReports() {
  const { products, sales } = useInventory();
  const { isAdminMode } = useAdmin();

  // Cálculos financieros avanzados para reportes
  const reportMetrics = useMemo(() => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalCost = sales.reduce((sum, sale) => sum + (sale.total * 0.6), 0);
    const grossProfit = totalRevenue - totalCost;
    const grossMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100) : 0;

    // Análisis temporal (últimos 30 días)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayRevenue = sales
        .filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate.toDateString() === date.toDateString();
        })
        .reduce((sum, sale) => sum + sale.total, 0);
      
      return {
        day: date.getDate(),
        date: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        revenue: dayRevenue,
        profit: dayRevenue * 0.35,
        costs: dayRevenue * 0.65
      };
    }).reverse();

    // Top productos por valor de inventario
    const topProducts = products
      .map(product => ({
        name: product.name,
        value: product.price * product.stock,
        profit: (product.price - product.cost) * product.stock,
        margin: ((product.price - product.cost) / product.price) * 100,
        category: product.category
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Análisis por categorías mejorado
    const categoryAnalysis = {};
    products.forEach(product => {
      if (!categoryAnalysis[product.category]) {
        categoryAnalysis[product.category] = {
          name: product.category,
          products: 0,
          totalValue: 0,
          totalProfit: 0,
          avgMargin: 0,
          avgPrice: 0
        };
      }
      
      const stats = categoryAnalysis[product.category];
      stats.products++;
      stats.totalValue += product.price * product.stock;
      stats.totalProfit += (product.price - product.cost) * product.stock;
      stats.avgMargin += ((product.price - product.cost) / product.price) * 100;
      stats.avgPrice += product.price;
    });

    const categories = Object.values(categoryAnalysis).map(cat => ({
      ...cat,
      avgMargin: cat.avgMargin / cat.products,
      avgPrice: cat.avgPrice / cat.products
    }));

    return {
      totalRevenue,
      totalCost,
      grossProfit,
      grossMargin,
      last30Days,
      topProducts,
      categories
    };
  }, [products, sales]);

  // Redirigir si no está en modo admin
  if (!isAdminMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <ShieldCheckIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-4">
            Esta sección requiere privilegios de administrador.
          </p>
          <p className="text-sm text-gray-500">
            Activa el modo administrador desde el botón del header para acceder.
          </p>
        </Card>
      </div>
    );
  }

  const exportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      metrics: reportMetrics,
      summary: {
        totalProducts: products.length,
        totalSales: sales.length,
        period: "Último mes"
      }
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `reporte-ejecutivo-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-8">
      {/* Header Ejecutivo */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <DocumentArrowDownIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Reportes Ejecutivos</h1>
              <p className="text-blue-200">Panel de control financiero y análisis de rendimiento</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-blue-200">Período de Análisis</p>
              <p className="font-semibold">Últimos 30 días</p>
            </div>
            <Button
              onClick={exportReport}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex items-center gap-2"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              Exportar Reporte
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-green-100 text-sm font-medium">Ingresos Totales</p>
              <p className="text-3xl font-bold">${reportMetrics.totalRevenue.toLocaleString('es-MX')}</p>
              <div className="flex items-center mt-2">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-sm text-green-200">+{reportMetrics.grossMargin.toFixed(1)}% margen</span>
              </div>
            </div>
            <CurrencyDollarIcon className="h-12 w-12 text-green-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-blue-100 text-sm font-medium">Ganancia Bruta</p>
              <p className="text-3xl font-bold">${reportMetrics.grossProfit.toLocaleString('es-MX')}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-blue-200">Margen: {reportMetrics.grossMargin.toFixed(1)}%</span>
              </div>
            </div>
            <CalculatorIcon className="h-12 w-12 text-blue-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-purple-100 text-sm font-medium">Costos Operativos</p>
              <p className="text-3xl font-bold">${reportMetrics.totalCost.toLocaleString('es-MX')}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-purple-200">60% del total</span>
              </div>
            </div>
            <BanknotesIcon className="h-12 w-12 text-purple-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-orange-100 text-sm font-medium">Productos Analizados</p>
              <p className="text-3xl font-bold">{products.length}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-orange-200">{reportMetrics.categories.length} categorías</span>
              </div>
            </div>
            <ChartBarIcon className="h-12 w-12 text-orange-200" />
          </div>
        </Card>
      </div>

      {/* Gráficos de Análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tendencia de 30 días */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
              Tendencia Financiera (30 días)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={reportMetrics.last30Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'revenue' ? 'Ingresos' : name === 'profit' ? 'Ganancia' : 'Costos']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1"
                  stroke="#22C55E" 
                  fill="#22C55E"
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stackId="2"
                  stroke="#3B82F6" 
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Productos */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrophyIcon className="h-5 w-5 mr-2 text-yellow-600" />
              Top 10 Productos por Valor
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {reportMetrics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${product.value.toLocaleString('es-MX')}</p>
                    <p className="text-sm text-green-600">+${product.profit.toLocaleString('es-MX')} ganancia</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Análisis por Categorías */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-purple-600" />
            Análisis Detallado por Categorías
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportMetrics.categories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'totalValue' ? `$${value.toLocaleString()}` : 
                  name === 'totalProfit' ? `$${value.toLocaleString()}` :
                  `${value.toFixed(1)}%`,
                  name === 'totalValue' ? 'Valor Total' :
                  name === 'totalProfit' ? 'Ganancia Total' : 'Margen Promedio'
                ]}
              />
              <Bar dataKey="totalValue" fill="#22C55E" name="Valor Total" />
              <Bar dataKey="totalProfit" fill="#3B82F6" name="Ganancia Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Footer del Reporte */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-gray-600" />
            <h4 className="text-lg font-semibold text-gray-900">Reporte Generado en Modo Administrador</h4>
          </div>
          <p className="text-gray-600 mb-2">
            Este reporte contiene información financiera sensible y análisis detallado del rendimiento empresarial.
          </p>
          <p className="text-sm text-gray-500">
            Generado el {new Date().toLocaleString('es-ES')} | NutriAla Sistema de Inventario
          </p>
        </div>
      </Card>
    </div>
  );
}
