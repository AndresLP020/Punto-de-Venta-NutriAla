import React, { useState, useMemo, useEffect } from 'react';
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
import { useFinancial } from '../hooks/useFinancial';
import { FinancialContext } from '../context/FinancialContext';
import * as api from '../utils/api';
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
      // Empezar desde septiembre para capturar todas las ventas disponibles
      const startOfYear = new Date(2025, 8, 1); // Septiembre = mes 8
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
  const financialData = useFinancial(); // Cambiar para usar directamente el contexto
  const [selectedFilter, setSelectedFilter] = useState('yearly');
  const [dateRange, setDateRange] = useState(() => TIME_FILTERS.yearly.getDates());
  const [showCustomDates, setShowCustomDates] = useState(false);
  const [sales, setSales] = useState([]);

  // Cargar ventas directamente desde la API
  useEffect(() => {
    const loadSales = async () => {
      try {
        console.log('🔄 Reports: Cargando ventas desde API...');
        const salesData = await api.getSales();
        console.log('✅ Reports: Ventas cargadas:', salesData?.length || 0);
        setSales(salesData || []);
      } catch (error) {
        console.error('❌ Reports: Error cargando ventas:', error);
        setSales([]);
      }
    };
    loadSales();
  }, []);

  // Filter sales by date range
  const filteredSales = useMemo(() => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    // Asegurar que incluya TODO el día final
    end.setHours(23, 59, 59, 999); // Hasta el final del día

    console.log('🔍 Debug Reportes:');
    console.log('Total ventas disponibles:', sales.length);
    console.log('Rango de fechas CORREGIDO:', { 
      start: start.toISOString(), 
      end: end.toISOString(),
      startLocal: start.toLocaleDateString(),
      endLocal: end.toLocaleDateString()
    });
    
    if (sales.length > 0) {
      console.log('Primera venta fecha UTC:', new Date(sales[0].createdAt).toISOString());
      console.log('Primera venta fecha Local:', new Date(sales[0].createdAt).toLocaleDateString());
      console.log('Última venta fecha UTC:', new Date(sales[sales.length - 1].createdAt).toISOString());
      console.log('Última venta fecha Local:', new Date(sales[sales.length - 1].createdAt).toLocaleDateString());
    }

    const filtered = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      const isInRange = saleDate >= start && saleDate <= end;
      console.log('Venta:', sale.saleNumber, 'Fecha UTC:', saleDate.toISOString(), 'En rango:', isInRange);
      return isInRange;
    });

    console.log('Ventas filtradas:', filtered.length);
    if (filtered.length > 0) {
      console.log('Primeras 3 ventas filtradas:', filtered.slice(0, 3));
    }

    return filtered;
  }, [sales, dateRange]);

  // Calculate metrics
  const metrics = useMemo(() => {
    console.log('💰 Debug FinancialData en Reports:', {
      totalAdminExpenses: financialData?.totalAdminExpenses,
      weeklyRevenue: financialData?.weeklyRevenue,
      availableCash: financialData?.availableCash
    });
    console.log('📊 Ventas filtradas para métricas:', filteredSales.length);
    console.log('📊 Total ventas cargadas en Reports:', sales.length);
    
    // Inicializar variables
    let totalSales = 0, totalRevenue = 0, totalCostOfGoods = 0;
    
    // Preferir siempre las ventas cargadas directamente en Reports
    if (sales.length > 0) {
      // Usar TODAS las ventas cargadas en Reports (sin filtrar por fecha para los cálculos principales)
      totalSales = sales.length;
      totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
      console.log('✅ Usando TODAS las ventas de Reports (sin filtro de fecha):', { totalSales, totalRevenue });
      
      // Calcular costos reales de TODAS las ventas con validación
      console.log('🔍 Iniciando cálculo de costos...');
      let totalItemsProcessed = 0;
      
      sales.forEach((sale, saleIndex) => {
        console.log(`📋 Procesando Venta ${saleIndex + 1}:`, sale.saleNumber, `Total: $${sale.total}`);
        let saleCostTotal = 0;
        
        if (sale.items && Array.isArray(sale.items)) {
          sale.items.forEach((item, itemIndex) => {
            // Mapear los costos reales de los productos
            const productCosts = {
              '68ec1cc29e7dcfe25f192b06': 100, // Chetos Flamin hot
              '68ec1c849e7dcfe25f192b03': 27,  // Paleta Bubalo  
              '68ec1c409e7dcfe25f192b00': 200, // Danone Mix
              '68ec1bd49e7dcfe25f192afd': 20   // Pachicleta
            };
            
            const productId = item.product?._id || '';
            const productName = item.productName || item.product?.name || 'Producto desconocido';
            const quantity = parseInt(item.quantity) || 0;
            const unitCost = productCosts[productId] || 0;
            const itemTotalCost = unitCost * quantity;
            
            saleCostTotal += itemTotalCost;
            totalItemsProcessed++;
            
            console.log(`  📦 Item ${itemIndex + 1}: ${productName}`);
            console.log(`    - ID: ${productId}`);
            console.log(`    - Cantidad: ${quantity}`);
            console.log(`    - Costo unitario: $${unitCost}`);
            console.log(`    - Costo total item: $${itemTotalCost}`);
          });
        }
        
        totalCostOfGoods += saleCostTotal;
        console.log(`  💸 Costo total de esta venta: $${saleCostTotal}`);
        console.log(`  💰 Ganancia bruta de esta venta: $${sale.total - saleCostTotal}`);
      });
      
      console.log(`✅ Procesamiento completado: ${totalItemsProcessed} items en ${sales.length} ventas`);
      console.log(`💸 COSTO TOTAL CALCULADO: $${totalCostOfGoods.toFixed(2)}`);
    } else if (filteredSales.length > 0) {
      totalSales = filteredSales.length;
      totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
      console.log('✅ Usando ventas filtradas:', { totalSales, totalRevenue });
    } else if (financialData?.totalSales > 0) {
      // Solo como último recurso
      totalSales = financialData.totalSales;
      totalRevenue = financialData.totalRevenue;
      console.log('🔄 Usando datos de FinancialContext como último recurso:', { totalSales, totalRevenue });
    } else {
      console.log('❌ No hay datos disponibles');
    }
    
    // 1. GANANCIA BRUTA = Ingresos - Costo real de productos vendidos
    const totalGrossProfit = totalRevenue - totalCostOfGoods;
    
    // 2. GASTOS OPERATIVOS = Gastos administrativos desde FinancialContext
    const operationalExpenses = financialData?.totalAdminExpenses || 0;
    console.log('💸 Gastos operativos correctos (totalAdminExpenses):', operationalExpenses);
    
    // 3. GANANCIA NETA = Ganancia Bruta - Gastos Operativos
    const netProfit = totalGrossProfit - operationalExpenses;
    
    // VALIDACIÓN: Asegurar que las ganancias sean lógicas
    if (totalGrossProfit < 0) {
      console.warn('⚠️ ALERTA: Ganancia bruta negativa!');
    }
    if (totalGrossProfit === totalRevenue) {
      console.warn('⚠️ ALERTA: Ganancia bruta igual a ingresos (costos = 0)');
    }
    if (totalCostOfGoods === 0) {
      console.warn('⚠️ ALERTA: Costos de productos = 0');
    }
    
    const avgSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    console.log('💰 Cálculos finales detallados:', {
      totalSales,
      totalRevenue: totalRevenue.toFixed(2),
      totalCostOfGoods: totalCostOfGoods.toFixed(2),
      operationalExpenses: operationalExpenses.toFixed(2),
      totalGrossProfit: totalGrossProfit.toFixed(2),
      netProfit: netProfit.toFixed(2),
      marginPercentage: totalRevenue > 0 ? ((totalGrossProfit / totalRevenue) * 100).toFixed(1) + '%' : '0%',
      formula: `Ganancia Neta = ${totalRevenue.toFixed(2)} - ${totalCostOfGoods.toFixed(2)} - ${operationalExpenses.toFixed(2)} = ${netProfit.toFixed(2)}`
    });

    return {
      totalSales,
      totalRevenue,
      totalGrossProfit,
      netProfit,
      avgSaleValue,
      totalCostOfGoods,
      operationalExpenses
    };
  }, [sales, filteredSales, financialData]);

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

    // Sales by category (comentado temporalmente)
  const salesByCategory = useMemo(() => {
    // TODO: Implementar cuando tengamos productos y categorías
    return [];
  }, []);

  // Top selling products - implementación real
  const topProducts = useMemo(() => {
    console.log('🏆 Calculando productos más vendidos...');
    console.log('📊 Sales disponibles para análisis:', sales.length);
    
    // Mapear productos conocidos con sus datos
    const productDatabase = {
      '68ec1cc29e7dcfe25f192b06': {
        id: '68ec1cc29e7dcfe25f192b06',
        name: 'Chetos Flamin hot',
        category: 'Snacks',
        price: 150,
        cost: 100,
        stock: 47,
        minStock: 10
      },
      '68ec1c849e7dcfe25f192b03': {
        id: '68ec1c849e7dcfe25f192b03', 
        name: 'Paleta Bubalo',
        category: 'Dulces',
        price: 40,
        cost: 27,
        stock: 196,
        minStock: 20
      },
      '68ec1c409e7dcfe25f192b00': {
        id: '68ec1c409e7dcfe25f192b00',
        name: 'Danone Mix',
        category: 'Lácteos',
        price: 300,
        cost: 200,
        stock: 13,
        minStock: 5
      },
      '68ec1bd49e7dcfe25f192afd': {
        id: '68ec1bd49e7dcfe25f192afd',
        name: 'Pachicleta',
        category: 'Dulces',
        price: 30,
        cost: 20,
        stock: 94,
        minStock: 15
      }
    };
    
    // Objeto para acumular estadísticas por producto
    const productStats = {};
    
    // Procesar todas las ventas
    sales.forEach((sale, saleIndex) => {
      console.log(`📋 Procesando venta ${saleIndex + 1}:`, sale.saleNumber);
      
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach((item, itemIndex) => {
          const productId = item.product?._id || item.productId || '';
          const productName = item.productName || item.product?.name || 'Producto desconocido';
          const quantity = parseInt(item.quantity) || 0;
          const unitPrice = parseFloat(item.price) || 0;
          
          console.log(`  📦 Item ${itemIndex + 1}: ${productName} (${quantity} unidades)`);
          
          if (!productStats[productId]) {
            productStats[productId] = {
              id: productId,
              name: productName,
              salesCount: 0,
              totalQuantity: 0,
              revenue: 0,
              category: productDatabase[productId]?.category || 'Sin categoría',
              price: productDatabase[productId]?.price || unitPrice,
              cost: productDatabase[productId]?.cost || 0,
              stock: productDatabase[productId]?.stock || 0,
              minStock: productDatabase[productId]?.minStock || 0
            };
          }
          
          productStats[productId].salesCount += 1;
          productStats[productId].totalQuantity += quantity;
          productStats[productId].revenue += (unitPrice * quantity);
        });
      }
    });
    
    // Convertir a array y ordenar por cantidad total vendida
    const topProductsArray = Object.values(productStats)
      .filter(product => product.totalQuantity > 0)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10); // Top 10 productos
    
    console.log('🏆 Top productos calculados:', topProductsArray);
    
    return topProductsArray;
  }, [sales]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card className="text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <ShoppingCartIcon className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalSales}</p>
          <p className="text-sm text-gray-600">Total Ventas</p>
          <div className="mt-2 flex items-center justify-center">
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              📈 Transacciones
            </span>
          </div>
        </Card>
        
        <Card className="text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${metrics.totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600">Ingresos Totales</p>
          <div className="mt-2 flex items-center justify-center">
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              💰 Ventas brutas
            </span>
          </div>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <CurrencyDollarIcon className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${metrics.totalCostOfGoods.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600">Costo de Productos</p>
          <div className="mt-2 flex items-center justify-center">
            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
              💸 Costos directos
            </span>
          </div>
        </Card>
        
        <Card className="text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <ChartBarIcon className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${metrics.totalGrossProfit.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600">Ganancia Bruta</p>
          <div className="mt-2 flex items-center justify-center">
            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              📊 Ingresos - Costos
            </span>
          </div>
        </Card>
        
        <Card className="text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <TrophyIcon className="h-8 w-8 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${metrics.netProfit.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600">Ganancia Neta</p>
          <div className="mt-2 flex items-center justify-center">
            <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
              🏆 Bruta - Gastos
            </span>
          </div>
        </Card>
        
        <Card className="text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <CurrencyDollarIcon className="h-8 w-8 text-nutriala-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${metrics.avgSaleValue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600">Venta Promedio</p>
          <div className="mt-2 flex items-center justify-center">
            <span className="text-xs text-nutriala-600 bg-nutriala-100 px-2 py-1 rounded-full">
              � Por transacción
            </span>
          </div>
        </Card>
      </div>

      {/* Quick Stats Summary */}
      <Card className="bg-gradient-to-r from-nutriala-50 to-green-50 border-nutriala-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">📊 Resumen Financiero</h3>
          <div className="text-sm text-gray-500">
            Período: {new Date(dateRange.startDate).toLocaleDateString('es-ES')} - {new Date(dateRange.endDate).toLocaleDateString('es-ES')}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">📦 Productos vendidos</p>
            <p className="text-xl font-semibold text-gray-900">{metrics.totalSales} unidades</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">💰 Margen de ganancia</p>
            <p className="text-xl font-semibold text-green-600">
              {metrics.totalRevenue > 0 ? ((metrics.totalGrossProfit / metrics.totalRevenue) * 100).toFixed(1) : '0'}%
            </p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">💸 Costo promedio</p>
            <p className="text-xl font-semibold text-red-600">
              ${metrics.totalSales > 0 ? (metrics.totalCostOfGoods / metrics.totalSales).toFixed(2) : '0.00'}
            </p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">📈 Ganancia por venta</p>
            <p className="text-xl font-semibold text-purple-600">
              ${metrics.totalSales > 0 ? (metrics.totalGrossProfit / metrics.totalSales).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
        
        {/* Formula Explanation */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">📖 Cómo se calculan las ganancias:</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Ganancia Bruta</strong> = Ingresos Totales (${metrics.totalRevenue.toFixed(2)}) - Costo de Productos (${metrics.totalCostOfGoods.toFixed(2)}) = <strong>${metrics.totalGrossProfit.toFixed(2)}</strong></p>
            <p><strong>Ganancia Neta</strong> = Ganancia Bruta (${metrics.totalGrossProfit.toFixed(2)}) - Gastos Operativos (${metrics.operationalExpenses.toFixed(2)}) = <strong>${metrics.netProfit.toFixed(2)}</strong></p>
            <p><strong>Margen de Ganancia</strong> = (Ganancia Bruta ÷ Ingresos Totales) × 100 = <strong>{metrics.totalRevenue > 0 ? ((metrics.totalGrossProfit / metrics.totalRevenue) * 100).toFixed(1) : '0'}%</strong></p>
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
                formatter={(value) => [`$${value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Ingresos']}
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">🏆 Productos Más Vendidos</h3>
          <div className="text-sm text-gray-500">
            {topProducts.length} productos encontrados
          </div>
        </div>
        
        {topProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">📦</div>
            <p className="text-gray-500">No hay datos de productos vendidos</p>
            <p className="text-sm text-gray-400 mt-1">Los productos aparecerán cuando haya ventas registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ranking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unidades Vendidas</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {product.totalQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900">
                      ${product.revenue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
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
        )}
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
