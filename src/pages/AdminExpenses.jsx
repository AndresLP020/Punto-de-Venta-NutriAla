import React, { useState } from 'react';
import AdminExpenseForm from '../components/ui/AdminExpenseForm.jsx';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useFinancial } from '../hooks/useFinancial';

export default function AdminExpenses() {
  const {
    adminExpenses,
    totalAdminExpenses,
    monthlyRevenue,
    monthlyNetProfit,
    availableCash,
    addAdminExpense,
    updateAdminExpense,
    deleteAdminExpense,
    checkFinancialAlerts
  } = useFinancial();

  // Debug: Mostrar información del contexto financiero
  console.log('🔍 AdminExpenses Debug:', {
    adminExpenses,
    totalAdminExpenses,
    monthlyRevenue,
    monthlyNetProfit,
    availableCash,
    adminExpensesLength: adminExpenses?.length || 0
  });

  const categories = [
    'Todos',
    'Salud',
    'Automotriz',
    'Escuelas',
    'Diversos',
    'Sueldos',
    'Viáticos',
    'Entretenimiento',
    'Servicios básicos de casa',
    'Compras familiares',
    'Gastos de la empresa',
  ];
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // Filtrar y ordenar: más reciente primero
  let filteredExpenses = (selectedCategory === 'Todos'
    ? adminExpenses
    : adminExpenses.filter(e => e.category === selectedCategory)
  );

  // Filtrar por rango de fechas personalizado si está seleccionado
  if (customDateFrom && customDateTo) {
    const from = new Date(customDateFrom);
    const to = new Date(customDateTo);
    to.setHours(23,59,59,999);
    filteredExpenses = filteredExpenses.filter(e => {
      const d = new Date(e.date);
      return d >= from && d <= to;
    });
  }
  filteredExpenses = filteredExpenses.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalExpenseAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Alertas financieras
  const alerts = checkFinancialAlerts();

  // Resúmenes por periodo y categoría
  const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  const isSameWeek = (d1, d2) => {
    const startOfWeek = d => {
      const date = new Date(d);
      date.setDate(date.getDate() - date.getDay());
      date.setHours(0,0,0,0);
      return date;
    };
    return startOfWeek(d1).getTime() === startOfWeek(d2).getTime();
  };
  const isSameMonth = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
  const isSameYear = (d1, d2) => d1.getFullYear() === d2.getFullYear();

  // Agrupar por periodo y categoría, y ordenar gastos de mayor a menor
  function groupByPeriodAndCategory(expenses, periodFn) {
    const grouped = {};
    expenses.forEach(e => {
      let periodKey;
      const expenseDate = new Date(e.date);
      if (periodFn === isSameDay) periodKey = expenseDate.toLocaleDateString('es-MX');
      else if (periodFn === isSameWeek) {
        const d = new Date(expenseDate);
        d.setDate(d.getDate() - d.getDay());
        periodKey = d.toLocaleDateString('es-MX');
      } else if (periodFn === isSameMonth) periodKey = `${expenseDate.getMonth()+1}/${expenseDate.getFullYear()}`;
      else if (periodFn === isSameYear) periodKey = `${expenseDate.getFullYear()}`;
      if (!grouped[periodKey]) grouped[periodKey] = {};
      if (!grouped[periodKey][e.category]) grouped[periodKey][e.category] = [];
      grouped[periodKey][e.category].push(e);
    });
    // Ordenar periodos por gasto total descendente
    return Object.entries(grouped)
      .map(([period, cats]) => {
        // Calcular total por periodo
        let total = 0;
        Object.values(cats).forEach(arr => arr.forEach(e => { total += e.amount; }));
        return { period, total, categories: cats };
      })
      .sort((a, b) => b.total - a.total);
  }

  const dailySummary = groupByPeriodAndCategory(filteredExpenses, isSameDay);
  const weeklySummary = groupByPeriodAndCategory(filteredExpenses, isSameWeek);
  const monthlySummary = groupByPeriodAndCategory(filteredExpenses, isSameMonth);
  const yearlySummary = groupByPeriodAndCategory(filteredExpenses, isSameYear);

  const PERIOD_OPTIONS = [
    { label: 'Diario', value: 'daily' },
    { label: 'Semanal', value: 'weekly' },
    { label: 'Mensual', value: 'monthly' },
    { label: 'Anual', value: 'yearly' },
  ];
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const getSummaryByPeriod = () => {
    switch (selectedPeriod) {
      case 'daily': return dailySummary;
      case 'weekly': return weeklySummary;
      case 'monthly': return monthlySummary;
      case 'yearly': return yearlySummary;
      default: return dailySummary;
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      await deleteAdminExpense(id);
    }
  };

  const handleSaveExpense = async (expenseData) => {
    try {
      if (editingExpense) {
        await updateAdminExpense(editingExpense.id, expenseData);
      } else {
        await addAdminExpense(expenseData);
      }
      setShowExpenseForm(false);
      setEditingExpense(null);
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowExpenseForm(true);
  };

  return (
    <div className="w-full min-h-[calc(100vh-0px)] bg-gray-50 flex flex-col items-center justify-start py-10 px-2 md:px-8 animate-fade-in">
      {/* Cabecera con icono y resumen */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-6">
          <span className="inline-flex items-center justify-center bg-blue-100 rounded-full p-6 shadow-lg animate-bounce-in">
            <CurrencyDollarIcon className="h-14 w-14 text-blue-600" />
          </span>
          <div>
            <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight drop-shadow">Gastos del Administrador</h2>
            <p className="text-lg text-gray-500 mt-2">Control y registro de gastos personales</p>
          </div>
        </div>
        <button onClick={handleAddExpense} className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:scale-105 transition-transform text-lg">+ Agregar Gasto</button>
      </div>

      {/* Debug Info */}
      <div className="w-full max-w-5xl mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-800">
              <strong>Debug:</strong> Gastos Admin: {adminExpenses?.length || 0} | Total: ${totalAdminExpenses?.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {adminExpenses?.length === 0 ? '⚠️ No hay gastos administrativos registrados' : '✅ Gastos cargados desde base de datos'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-600">
              Ingresos: ${monthlyRevenue?.toFixed(2) || '0.00'} | Ganancia: ${monthlyNetProfit?.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-blue-600">
              Efectivo: ${availableCash?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      </div>

      {/* Alertas financieras */}
      {alerts.length > 0 && (
        <div className="w-full max-w-5xl mb-6 space-y-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'error' 
                  ? 'bg-red-50 border-red-400 text-red-800' 
                  : 'bg-yellow-50 border-yellow-400 text-yellow-800'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  {alert.type === 'error' ? '⚠️' : '⚡'}
                </span>
                {alert.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen financiero integrado */}
      <div className="w-full max-w-5xl mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-lg font-semibold text-green-700">Ingresos Mensuales</div>
          <div className="text-2xl font-bold text-green-900">${monthlyRevenue.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits: 2})}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-lg font-semibold text-red-700">Gastos Administrativos</div>
          <div className="text-2xl font-bold text-red-900">${totalAdminExpenses.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits: 2})}</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <div className="text-lg font-semibold text-emerald-700">Ganancia Neta Mensual</div>
          <div className={`text-2xl font-bold ${monthlyNetProfit >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>
            ${monthlyNetProfit.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits: 2})}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-lg font-semibold text-purple-700">Efectivo Disponible</div>
          <div className={`text-2xl font-bold ${availableCash >= 0 ? 'text-purple-900' : 'text-red-900'}`}>
            ${availableCash.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits: 2})}
          </div>
        </div>
      </div>

      {/* Filtros, fechas y resumen destacado */}
      <div className="w-full max-w-5xl mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4 animate-fade-in">
        <div className="flex flex-col gap-3 md:gap-4 w-full md:w-2/3">
          <div className="flex flex-wrap gap-2 mb-2">
            {categories.map(cat => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full font-semibold shadow text-base transition-colors border-2 ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Selector de fechas personalizado */}
          <div className="flex flex-wrap gap-4 items-center mb-2">
            <div>
              <label className="block text-sm font-medium text-blue-700">Desde</label>
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={customDateFrom}
                onChange={e => setCustomDateFrom(e.target.value)}
                max={customDateTo || undefined}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700">Hasta</label>
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={customDateTo}
                onChange={e => setCustomDateTo(e.target.value)}
                min={customDateFrom || undefined}
              />
            </div>
            {(customDateFrom || customDateTo) && (
              <button
                className="ml-2 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                onClick={() => { setCustomDateFrom(''); setCustomDateTo(''); }}
                type="button"
              >
                Limpiar fechas
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 bg-blue-50 rounded-2xl px-10 py-6 shadow-inner">
            <CurrencyDollarIcon className="h-10 w-10 text-blue-400" />
            <div>
              <span className="block text-xl font-bold text-blue-700">Total Gastado (Filtrado)</span>
              <span className="block text-3xl font-extrabold text-blue-900">${totalExpenseAmount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
        {/* Selector de periodo y resumen por periodo/categoría */}
        <div className="flex flex-col gap-2 w-full md:w-1/3 bg-blue-100 rounded-xl p-4 shadow-inner max-h-[32rem] overflow-y-auto">
          <span className="text-blue-800 font-bold text-lg mb-1">Resumen por periodo y categoría</span>
          <div className="mb-2">
            <label className="block text-blue-700 font-semibold mb-1">Selecciona periodo:</label>
            <select
              className="w-full rounded border px-2 py-1"
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
            >
              {PERIOD_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <ul className="ml-2 text-blue-900 text-sm">
            {getSummaryByPeriod().map(({ period, total, categories: cats }) => (
              <li key={period} className="mb-2">
                <span className="font-bold">{period}:</span> <span className="font-bold">${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <ul className="ml-4 mt-1">
                  {Object.entries(cats)
                    .map(([cat, arr]) => ({
                      cat,
                      arr,
                      total: arr.reduce((sum, e) => sum + e.amount, 0)
                    }))
                    .sort((a, b) => b.total - a.total)
                    .map(({ cat, arr, total: catTotal }) => (
                      <li key={cat} className="mb-1">
                        <span className="font-semibold text-blue-600">{cat}:</span> <span className="text-blue-800 font-bold">${catTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <ul className="ml-2">
                          {arr.slice().sort((a, b) => b.amount - a.amount).map(e => (
                            <li key={e.id} className="flex justify-between">
                              <span>{e.description}</span>
                              <span className="font-bold">${e.amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tabla moderna de gastos */}
      <div className="w-full max-w-5xl overflow-x-auto animate-fade-in-up">
        <table className="min-w-full text-left text-lg rounded-2xl overflow-hidden shadow-2xl bg-white">
          <thead className="bg-blue-200">
            <tr>
              <th className="px-6 py-4 text-blue-800 font-extrabold">Fecha</th>
              <th className="px-6 py-4 text-blue-800 font-extrabold">Descripción</th>
              <th className="px-6 py-4 text-blue-800 font-extrabold">Categoría</th>
              <th className="px-6 py-4 text-blue-800 font-extrabold">Monto</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {adminExpenses?.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <div className="mb-4">
                    <span className="text-6xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay gastos administrativos registrados</h3>
                  <p className="text-gray-500 mb-4">Comienza agregando tu primer gasto administrativo usando el botón "Agregar Gasto"</p>
                  <button 
                    onClick={handleAddExpense}
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                  >
                    ➕ Agregar Primer Gasto
                  </button>
                </td>
              </tr>
            ) : (
              filteredExpenses
                .slice()
                .sort((a, b) => b.amount - a.amount) // mayor gasto primero
                .map(expense => (
                  <tr key={expense.id} className="border-b last:border-b-0 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-700 text-lg">
                      {new Date(expense.date).toLocaleDateString('es-MX')}
                      <br/>
                      <span className="text-xs text-gray-400">
                        {new Date(expense.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-bold">{expense.description}</td>
                    <td className="px-6 py-4 text-blue-700 font-semibold">{expense.category}</td>
                    <td className="px-6 py-4 text-blue-700 font-extrabold">${expense.amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 flex gap-3">
                      <button onClick={() => handleEditExpense(expense)} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-base font-bold shadow">Editar</button>
                      <button onClick={() => handleDeleteExpense(expense.id)} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-base font-bold shadow">Eliminar</button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para editar/crear gasto */}
      {showExpenseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl relative border-4 border-blue-300">
            <AdminExpenseForm
              expense={editingExpense}
              onSave={handleSaveExpense}
              onCancel={() => { setShowExpenseForm(false); setEditingExpense(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
