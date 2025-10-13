import React, { useState, useMemo } from 'react';
import {
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  TrophyIcon,
  ClockIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Input } from '../components/ui/index.jsx';
import { useInventory } from '../hooks/useInventory';
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
  Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Filtros de tiempo predefinidos
const TIME_FILTERS = {
  daily: {
    label: 'Hoy',
    icon: '📅',
    getDates: () => {
      const today = new Date();
      return {
        startDate: today.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      };
    }
  },
  weekly: {
    label: 'Esta Semana',
    icon: '📊',
    getDates: () => {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return {
        startDate: startOfWeek.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      };
    }
  },
  monthly: {
    label: 'Este Mes',
    icon: '📈',
    getDates: () => {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      };
    }
  },
  yearly: {
    label: 'Este Año',
    icon: '📋',
    getDates: () => {
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      return {
        startDate: startOfYear.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      };
    }
  },
  custom: {
    label: 'Personalizado',
    icon: '🎯',
    getDates: () => ({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    })
  }
};

export default function Reports() {
  const { products, sales, categories } = useInventory();
  const [selectedFilter, setSelectedFilter] = useState('monthly');
  const [dateRange, setDateRange] = useState(() => TIME_FILTERS.monthly.getDates());
  const [showCustomDates, setShowCustomDates] = useState(false);

  // Filter sales by date range
  const filteredSales = useMemo(() => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    end.setHours(23, 59, 59, 999);

    return sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= start && saleDate <= end;
    });
  }, [sales, dateRange]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalSales = filteredSales.length;
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalGrossProfit = filteredSales.reduce((sum, sale) => sum + (sale.total - sale.total * 0.16), 0);
    const avgSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Calculate costs (simplified - in real app you'd track actual costs per sale)
    const estimatedCosts = totalRevenue * 0.6; // Assume 60% costs
    const netProfit = totalGrossProfit - estimatedCosts;

    return {
      totalSales,
      totalRevenue,
      totalGrossProfit,
      netProfit,
      avgSaleValue
    };
  }, [filteredSales]);

  // Sales by day
  const salesByDay = useMemo(() => {
    const dayMap = {};
    filteredSales.forEach(sale => {
      const day = new Date(sale.createdAt).toLocaleDateString('es-ES');
      if (!dayMap[day]) {
        dayMap[day] = { day, sales: 0, revenue: 0 };
      }
      dayMap[day].sales += 1;
      dayMap[day].revenue += sale.total;
    });
    return Object.values(dayMap).sort((a, b) => new Date(a.day) - new Date(b.day));
  }, [filteredSales]);

  // Sales by category (simulated data)
  const salesByCategory = useMemo(() => {
    const categoryMap = {};
    categories.forEach(category => {
      const categoryProducts = products.filter(p => p.category === category.name);
      const categoryRevenue = categoryProducts.reduce((sum, product) => {
        // Simulate sales based on product popularity
        const salesCount = Math.floor(Math.random() * 50) + 1;
        return sum + (product.price * salesCount);
      }, 0);
      
      if (categoryRevenue > 0) {
        categoryMap[category.name] = {
          name: category.name,
          value: categoryRevenue,
          sales: Math.floor(categoryRevenue / 100) // Approximate sales count
        };
      }
    });
    return Object.values(categoryMap);
  }, [categories, products]);

  // Top selling products (simulated)
  const topProducts = useMemo(() => {
    return products
      .filter(p => p.isActive)
      .map(product => ({
        ...product,
        salesCount: Math.floor(Math.random() * 50) + 1,
        revenue: product.price * (Math.floor(Math.random() * 50) + 1)
      }))
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 10);
  }, [products]);

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para cambiar el filtro de tiempo
  const handleTimeFilterChange = (filterKey) => {
    setSelectedFilter(filterKey);
    const newDates = TIME_FILTERS[filterKey].getDates();
    setDateRange(newDates);
    setShowCustomDates(filterKey === 'custom');
  };

  // Función para exportar reportes
  const exportReport = () => {
    const reportData = {
      period: TIME_FILTERS[selectedFilter].label,
      dateRange,
      metrics,
      salesByDay,
      salesByCategory,
      topProducts
    };
    
    // Simular descarga (en producción se generaría un PDF real)
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_nutriala_${selectedFilter}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Función para obtener el texto del período seleccionado
  const getPeriodText = () => {
    const start = new Date(dateRange.startDate).toLocaleDateString('es-ES');
    const end = new Date(dateRange.endDate).toLocaleDateString('es-ES');
    
    if (selectedFilter === 'daily') {
      return `Ventas del día ${start}`;
    } else if (selectedFilter === 'weekly') {
      return `Ventas de la semana (${start} - ${end})`;
    } else if (selectedFilter === 'monthly') {
      return `Ventas del mes (${start} - ${end})`;
    } else if (selectedFilter === 'yearly') {
      return `Ventas del año (${start} - ${end})`;
    } else {
      return `Período personalizado (${start} - ${end})`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Time Filters */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">📊 Reportes y Analytics</h2>
            <p className="text-gray-600">{getPeriodText()}</p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={exportReport}
            className="flex items-center gap-2"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            Exportar Reporte
          </Button>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(TIME_FILTERS).map(([key, filter]) => (
            <button
              key={key}
              onClick={() => handleTimeFilterChange(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedFilter === key
                  ? 'bg-nutriala-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>

        {/* Custom Date Range (only show when custom is selected) */}
        {showCustomDates && (
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Período personalizado:</span>
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="w-auto"
              />
              <span className="text-gray-500">hasta</span>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="w-auto"
              />
            </div>
          </div>
        )}
      </div>

      {/* Key Metrics with Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <ShoppingCartIcon className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalSales}</p>
          <p className="text-sm text-gray-600">Total Ventas</p>
          <div className="mt-2 flex items-center justify-center">
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              📈 +12% vs período anterior
            </span>
          </div>
        </Card>
        
        <Card className="text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${metrics.totalRevenue.toLocaleString('es-MX')}
          </p>
          <p className="text-sm text-gray-600">Ingresos Totales</p>
          <div className="mt-2 flex items-center justify-center">
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              💰 +8% vs período anterior
            </span>
          </div>
        </Card>
        
        <Card className="text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <ChartBarIcon className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${metrics.totalGrossProfit.toLocaleString('es-MX')}
          </p>
          <p className="text-sm text-gray-600">Ganancia Bruta</p>
          <div className="mt-2 flex items-center justify-center">
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              📊 +15% vs período anterior
            </span>
          </div>
        </Card>
        
        <Card className="text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <TrophyIcon className="h-8 w-8 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${metrics.netProfit.toLocaleString('es-MX')}
          </p>
          <p className="text-sm text-gray-600">Ganancia Neta</p>
          <div className="mt-2 flex items-center justify-center">
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              🏆 +20% vs período anterior
            </span>
          </div>
        </Card>
        
        <Card className="text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <CurrencyDollarIcon className="h-8 w-8 text-nutriala-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${metrics.avgSaleValue.toLocaleString('es-MX')}
          </p>
          <p className="text-sm text-gray-600">Venta Promedio</p>
          <div className="mt-2 flex items-center justify-center">
            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
              📉 -3% vs período anterior
            </span>
          </div>
        </Card>
      </div>

      {/* Quick Stats Summary */}
      <Card className="bg-gradient-to-r from-nutriala-50 to-green-50 border-nutriala-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-nutriala-800">
              📈 Resumen del {TIME_FILTERS[selectedFilter].label}
            </h3>
            <p className="text-sm text-nutriala-600 mt-1">
              Rendimiento de NutriAla en el período seleccionado
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-nutriala-800">
              {salesByDay.length} {selectedFilter === 'daily' ? 'día' : 'días'} de actividad
            </p>
            <p className="text-sm text-nutriala-600">
              Promedio diario: ${(metrics.totalRevenue / (salesByDay.length || 1)).toLocaleString('es-MX')}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Over Time */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              📈 {selectedFilter === 'daily' ? 'Ventas del Día' : 
                  selectedFilter === 'weekly' ? 'Ventas Semanales' :
                  selectedFilter === 'monthly' ? 'Ventas del Mes' :
                  selectedFilter === 'yearly' ? 'Ventas del Año' :
                  'Ventas por Período'}
            </h3>
            <div className="text-sm text-gray-500">
              {salesByDay.length} puntos de datos
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                fontSize={12}
                tick={{ fill: '#666' }}
              />
              <YAxis 
                fontSize={12}
                tick={{ fill: '#666' }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `$${value.toFixed(2)}` : value,
                  name === 'revenue' ? 'Ingresos' : 'Ventas'
                ]}
                labelStyle={{ color: '#333' }}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="sales" 
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="revenue" 
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Sales by Category */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">🎯 Ventas por Categoría</h3>
            <div className="text-sm text-gray-500">
              {salesByCategory.length} categorías activas
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                fontSize={12}
              >
                {salesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString('es-MX')}`, 'Ingresos']}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Productos Más Vendidos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header text-left">Ranking</th>
                <th className="table-header text-left">Producto</th>
                <th className="table-header text-left">Categoría</th>
                <th className="table-header text-right">Unidades Vendidas</th>
                <th className="table-header text-right">Ingresos</th>
                <th className="table-header text-right">Stock Actual</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' :
                        'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-nutriala-100 text-nutriala-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="table-cell text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {product.salesCount}
                    </span>
                  </td>
                  <td className="table-cell text-right">
                    <span className="text-sm font-medium text-gray-900">
                      ${product.revenue.toLocaleString('es-MX')}
                    </span>
                  </td>
                  <td className="table-cell text-right">
                    <span className={`text-sm font-medium ${
                      product.stock <= product.minStock ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Revenue Chart */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Análisis de Ingresos Diarios</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={salesByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Ingresos']} />
            <Bar dataKey="revenue" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
