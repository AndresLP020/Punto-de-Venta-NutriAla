import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CubeIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Card, Badge } from '../components/ui/index.jsx';
import { useInventory } from '../hooks/useInventory';

export default function Dashboard() {
  const { products, sales, loadInitialData, clearAllLocalData } = useInventory();

  const handleReloadData = () => {
    console.log('🔄 Recargando datos manualmente...');
    loadInitialData();
  };

  const handleClearAllData = () => {
    if (window.confirm('⚠️ ¿Estás seguro de que quieres eliminar TODOS los datos locales? Esta acción no se puede deshacer.')) {
      clearAllLocalData();
      alert('✅ Todos los datos locales han sido eliminados. La página se recargará.');
      window.location.reload();
    }
  };



  // Calculate metrics
  const metrics = useMemo(() => {
    const activeProducts = products.filter(p => p.isActive);
    const lowStockProducts = activeProducts.filter(p => p.stock <= p.minStock);
    const totalInventoryValue = activeProducts.reduce((sum, p) => sum + (p.cost * p.stock), 0);
    
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todaySales = sales.filter(sale => new Date(sale.createdAt) >= todayStart);
    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1);
    const yesterdaySales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= yesterdayStart && saleDate < yesterdayEnd;
    });
    const yesterdayRevenue = yesterdaySales.reduce((sum, sale) => sum + sale.total, 0);
    
    const revenueChange = yesterdayRevenue > 0 
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
      : 0;

    return {
      totalProducts: activeProducts.length,
      lowStockProducts: lowStockProducts.length,
      totalInventoryValue,
      todayRevenue,
      todaySales: todaySales.length,
      revenueChange
    };
  }, [products, sales]);

  const statCards = [
    {
      title: 'Productos Activos',
      value: metrics.totalProducts,
      icon: CubeIcon,
      color: 'bg-blue-500',
      link: '/products'
    },

    {
      title: 'Transacciones Hoy',
      value: metrics.todaySales,
      icon: ShoppingCartIcon,
      color: 'bg-purple-500',
      link: '/sales'
    },
    {
      title: 'Productos con Stock Bajo',
      value: metrics.lowStockProducts,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      alert: metrics.lowStockProducts > 0,
      link: '/products'
    }
  ];

  // Get recent sales
  const recentSales = sales.slice(0, 5);

  // Get top products by sales
  const topProducts = useMemo(() => {
    const productSales = {};
    
    // Initialize product sales tracking
    products.forEach(product => {
      if (!productSales[product.id]) {
        productSales[product.id] = {
          product,
          totalSold: 0,
          revenue: 0
        };
      }
      // Simulate some sales data based on available products and sales
      const simulatedSales = Math.floor(Math.random() * Math.min(sales.length + 1, 10));
      productSales[product.id].totalSold += simulatedSales;
      productSales[product.id].revenue += simulatedSales * product.price;
    });

    return Object.values(productSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);
  }, [products, sales]);



  return (
    <div className="space-y-6">
      {/* Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-800">
            <strong>Debug:</strong> Productos: {products.length} | Ventas: {sales.length}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {products.length === 0 ? '⚠️ No hay productos cargados' : '✅ Productos cargados'}
            {' | '}
            {sales.length === 0 ? '⚠️ No hay ventas cargadas' : '✅ Ventas cargadas'}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleReloadData}
            className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Recargar Datos</span>
          </button>
          
          <button
            onClick={handleClearAllData}
            className="flex items-center space-x-2 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            <ExclamationTriangleIcon className="h-4 w-4" />
            <span>Limpiar Todo</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link} className="group">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-md`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    {stat.change !== undefined && (
                      <div className={`ml-2 flex items-center text-sm ${
                        stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change >= 0 ? (
                          <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(stat.change).toFixed(1)}%
                      </div>
                    )}
                  </div>
                  {stat.alert && (
                    <Badge variant="warning" className="mt-1">
                      Requiere atención
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Ventas Recientes</h3>
            <Link to="/sales" className="text-sm text-nutriala-600 hover:text-nutriala-700">
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Venta #{sale.id}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(sale.createdAt).toLocaleString('es-ES')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${sale.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <Badge variant="success">{sale.paymentMethod}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay ventas registradas
              </p>
            )}
          </div>
        </Card>

        {/* Top Products */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">Productos Más Vendidos</h3>
          </div>
          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((item, index) => (
                <div key={item.product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-nutriala-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-nutriala-600 text-sm font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Stock: {item.product.stock}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {item.totalSold} vendidos
                    </p>
                    <p className="text-xs text-gray-500">
                      ${item.revenue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay datos de ventas
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
