import React, { useState } from 'react';
import AdminExpenseForm from '../components/ui/AdminExpenseForm.jsx';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';


export default function AdminExpenses() {
  const [adminExpenses, setAdminExpenses] = useState([
    { id: 1, date: new Date(), amount: 250.00, description: 'Papelería', category: 'Escuelas' },
    { id: 2, date: new Date(), amount: 500.00, description: 'Comida de trabajo', category: 'Diversos' },
    { id: 3, date: new Date(), amount: 1200.00, description: 'Seguro médico', category: 'Salud' },
    { id: 4, date: new Date(), amount: 800.00, description: 'Mantenimiento auto', category: 'Automotriz' },
    { id: 5, date: new Date(), amount: 3500.00, description: 'Pago de sueldos', category: 'Sueldos' },
    { id: 6, date: new Date(), amount: 900.00, description: 'Viáticos Monterrey', category: 'Viáticos' },
    { id: 7, date: new Date(), amount: 400.00, description: 'Netflix y Spotify', category: 'Entretenimiento' },
    { id: 8, date: new Date(), amount: 600.00, description: 'Gas LP', category: 'Servicios básicos de casa' },
    { id: 9, date: new Date(), amount: 750.00, description: 'Pago de luz', category: 'Servicios básicos de casa' },
    { id: 10, date: new Date(), amount: 300.00, description: 'Pago de agua', category: 'Servicios básicos de casa' },
    { id: 11, date: new Date(), amount: 1200.00, description: 'Despensa semanal', category: 'Compras familiares' },
    { id: 12, date: new Date(), amount: 350.00, description: 'Artículos de limpieza', category: 'Compras familiares' },
    { id: 13, date: new Date(), amount: 2200.00, description: 'Pago de renta local', category: 'Gastos de la empresa' },
    { id: 14, date: new Date(), amount: 1800.00, description: 'Publicidad en redes', category: 'Gastos de la empresa' },
  ]);
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
  filteredExpenses = filteredExpenses.slice().sort((a, b) => b.date - a.date); // más reciente primero

  const totalExpenseAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

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
      if (periodFn === isSameDay) periodKey = e.date.toLocaleDateString('es-MX');
      else if (periodFn === isSameWeek) {
        const d = new Date(e.date);
        d.setDate(d.getDate() - d.getDay());
        periodKey = d.toLocaleDateString('es-MX');
      } else if (periodFn === isSameMonth) periodKey = `${e.date.getMonth()+1}/${e.date.getFullYear()}`;
      else if (periodFn === isSameYear) periodKey = `${e.date.getFullYear()}`;
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
              <span className="block text-xl font-bold text-blue-700">Total Gastado</span>
              <span className="block text-3xl font-extrabold text-blue-900">${totalExpenseAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
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
            {getSummaryByPeriod().map(({ period, total, categories }) => (
              <li key={period} className="mb-2">
                <span className="font-bold">{period}:</span> <span className="font-bold">${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                <ul className="ml-4 mt-1">
                  {Object.entries(categories)
                    .map(([cat, arr]) => ({
                      cat,
                      arr,
                      total: arr.reduce((sum, e) => sum + e.amount, 0)
                    }))
                    .sort((a, b) => b.total - a.total)
                    .map(({ cat, arr, total }) => (
                      <li key={cat} className="mb-1">
                        <span className="font-semibold text-blue-600">{cat}:</span> <span className="text-blue-800 font-bold">${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        <ul className="ml-2">
                          {arr.slice().sort((a, b) => b.amount - a.amount).map(e => (
                            <li key={e.id} className="flex justify-between">
                              <span>{e.description}</span>
                              <span className="font-bold">${e.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
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
            {filteredExpenses
              .slice()
              .sort((a, b) => b.amount - a.amount) // mayor gasto primero
              .map(expense => (
                <tr key={expense.id} className="border-b last:border-b-0 hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-700 text-lg">{expense.date.toLocaleDateString('es-MX')}<br/><span className="text-xs text-gray-400">{expense.date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span></td>
                  <td className="px-6 py-4 text-gray-900 font-bold">{expense.description}</td>
                  <td className="px-6 py-4 text-blue-700 font-semibold">{expense.category}</td>
                  <td className="px-6 py-4 text-blue-700 font-extrabold">${expense.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <button onClick={() => handleEditExpense(expense)} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-base font-bold shadow">Editar</button>
                    <button onClick={() => handleDeleteExpense(expense.id)} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-base font-bold shadow">Eliminar</button>
                  </td>
                </tr>
              ))
            }
            {filteredExpenses.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400 text-2xl">No hay gastos registrados</td>
              </tr>
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
