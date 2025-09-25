import React, { useMemo, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';
import {
  CubeIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { Card, Badge } from '../components/ui/index.jsx';
import RefundForm from '../components/ui/RefundForm.jsx';
import AdminExpenseForm from '../components/ui/AdminExpenseForm.jsx';
import { useInventory } from '../hooks/useInventory';

export default function Dashboard() {
  const { products, sales } = useInventory();
  const { isAdminMode } = useAdmin();

  // Estado para gastos personales del admin (debe estar dentro del componente)
  const [adminExpenses, setAdminExpenses] = useState([
    { id: 1, date: new Date(), amount: 250.00, description: 'Papelería' },
    { id: 2, date: new Date(), amount: 500.00, description: 'Comida de trabajo' }
  ]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const totalExpenses = adminExpenses.length;
  const totalExpenseAmount = adminExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };
  const handleDeleteExpense = (id) => {
    setAdminExpenses(adminExpenses.filter(e => e.id !== id));
  };
  const handleSaveExpense = (expense) => {
    if (expense.id) {
      setAdminExpenses(adminExpenses.map(e => e.id === expense.id ? { ...expense } : e));
    } else {
      setAdminExpenses([...adminExpenses, { ...expense, id: Date.now() }]);
    }
    setShowExpenseForm(false);
    setEditingExpense(null);
  };
  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowExpenseForm(true);
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
    // Solo mostrar "Ventas Hoy" si es admin
    ...(isAdminMode ? [{
      title: 'Ventas Hoy',
      value: `$${metrics.todayRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      change: metrics.revenueChange,
      link: '/sales'
    }] : []),
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
    
    sales.forEach(sale => {
      // Note: In a real app, you'd join with sale_items table
      // For now, we'll simulate this
      products.forEach(product => {
        if (!productSales[product.id]) {
          productSales[product.id] = {
            product,
            totalSold: 0,
            revenue: 0
          };
        }
        // Simulate some sales data
        productSales[product.id].totalSold += Math.floor(Math.random() * 3);
        productSales[product.id].revenue += productSales[product.id].totalSold * product.price;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);
  }, [products, sales]);

  // Simulación de devoluciones (en una app real, obtén esto de la base de datos)
  // Estado para devoluciones editables
  const [refunds, setRefunds] = useState([
    { id: 1, date: new Date(), amount: 120.00, reason: 'Producto dañado', user: 'Juan Pérez' },
    { id: 2, date: new Date(), amount: 80.00, reason: 'Error en compra', user: 'Ana López' }
  ]);
  const [editingRefund, setEditingRefund] = useState(null);
  const [showRefundForm, setShowRefundForm] = useState(false);

  const totalRefunds = refunds.length;
  const totalRefundAmount = refunds.reduce((sum, r) => sum + r.amount, 0);

  const handleEditRefund = (refund) => {
    setEditingRefund(refund);
    setShowRefundForm(true);
  };
  const handleDeleteRefund = (id) => {
    setRefunds(refunds.filter(r => r.id !== id));
  };
  const handleSaveRefund = (refund) => {
    if (refund.id) {
      setRefunds(refunds.map(r => r.id === refund.id ? { ...refund } : r));
    } else {
      setRefunds([...refunds, { ...refund, id: Date.now() }]);
    }
    setShowRefundForm(false);
    setEditingRefund(null);
  };
  const handleAddRefund = () => {
    setEditingRefund(null);
    setShowRefundForm(true);
  };

  return (
    <div className="space-y-6">
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
                      ${sale.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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
                      ${item.revenue.toLocaleString('es-MX')}
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

      {/* Inventory Value solo para admin */}
      {isAdminMode && (
        <>
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Valor Total del Inventario
              </h3>
              <p className="text-3xl font-bold text-nutriala-600">
                ${metrics.totalInventoryValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Basado en costos de productos activos
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-900">Devoluciones</h3>
                <button onClick={handleAddRefund} className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-sm">Agregar</button>
              </div>
              <p className="text-2xl font-bold text-red-500 mb-1">{totalRefunds} devoluciones</p>
              <p className="text-lg font-semibold text-gray-700 mb-2">Total: <span className="text-red-600">${totalRefundAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm mt-2">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-gray-500 font-medium">Fecha</th>
                      <th className="px-2 py-1 text-gray-500 font-medium">Usuario</th>
                      <th className="px-2 py-1 text-gray-500 font-medium">Motivo</th>
                      <th className="px-2 py-1 text-gray-500 font-medium">Monto</th>
                      <th className="px-2 py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {refunds.map(refund => (
                      <tr key={refund.id} className="border-b last:border-b-0">
                        <td className="px-2 py-1">{refund.date.toLocaleDateString('es-MX')}<br/><span className="text-xs text-gray-400">{refund.date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span></td>
                        <td className="px-2 py-1">{refund.user}</td>
                        <td className="px-2 py-1">{refund.reason}</td>
                        <td className="px-2 py-1 text-red-600 font-semibold">${refund.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                        <td className="px-2 py-1 flex gap-2">
                          <button onClick={() => handleEditRefund(refund)} className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-xs">Editar</button>
                          <button onClick={() => handleDeleteRefund(refund.id)} className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Modal para editar/crear devolución */}
              {showRefundForm && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-md relative">
                    <RefundForm
                      refund={editingRefund}
                      onSave={handleSaveRefund}
                      onCancel={() => { setShowRefundForm(false); setEditingRefund(null); }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
