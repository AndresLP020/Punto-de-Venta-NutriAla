import React, { useState } from 'react';
import { CalendarDaysIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';


export default function Debts() {
  // Deudas
  const [debts, setDebts] = useState([]);
  const [debtForm, setDebtForm] = useState({
    name: '',
    amount: '',
    createdAt: '',
    dueDate: ''
  });

  // Para mostrar el monto formateado en el input
  const [amountInput, setAmountInput] = useState('');

  // Metas de ahorro
  const [goalForm, setGoalForm] = useState({
    goalAmount: '',
    goalDate: ''
  });
  const [goalAmountInput, setGoalAmountInput] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [savingDays, setSavingDays] = useState([]); // [{date, saved, missed}]


  function handleDebtChange(e) {
    const { name, value } = e.target;
    if (name === 'amount') {
      // Solo permitir números y formatear
      const raw = value.replace(/[^\d]/g, '');
      const num = Number(raw);
      setAmountInput(raw ? num.toLocaleString('es-MX') : '');
      setDebtForm({ ...debtForm, amount: raw });
    } else {
      setDebtForm({ ...debtForm, [name]: value });
    }
  }

  function handleAddDebt(e) {
    e.preventDefault();
    if (!debtForm.name || !debtForm.amount || !debtForm.createdAt || !debtForm.dueDate) return;
    const newDebt = {
      ...debtForm,
      amount: parseFloat(debtForm.amount),
      id: Date.now()
    };
    setDebts([...debts, newDebt]);
    setDebtForm({ name: '', amount: '', createdAt: '', dueDate: '' });
  }

  function handleGoalChange(e) {
    const { name, value } = e.target;
    if (name === 'goalAmount') {
      const raw = value.replace(/[^\d]/g, '');
      const num = Number(raw);
      setGoalAmountInput(raw ? num.toLocaleString('es-MX') : '');
      setGoalForm({ ...goalForm, goalAmount: raw });
    } else {
      setGoalForm({ ...goalForm, [name]: value });
    }
  }

  function handleRecommend(e) {
    e.preventDefault();
    if (!goalForm.goalAmount || !goalForm.goalDate) return;
    const amount = parseFloat(goalForm.goalAmount);
    const due = new Date(goalForm.goalDate);
    const now = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.max(1, Math.round((due - now) / msPerDay));
    const weeks = Math.ceil(days / 7);
    const months = Math.ceil(days / 30);
    let perDay = amount / days;
    let perWeek = amount / weeks;
    let perMonth = amount / months;
    setRecommendation({ perDay, perWeek, perMonth, days, weeks, months, amount, due });

    // Generar días de ahorro
    const savingDaysArr = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      savingDaysArr.push({ date: d, saved: false, missed: false });
    }
    setSavingDays(savingDaysArr);
  }

  // Marcar día como ahorrado o perdido
  function markDay(idx, type) {
    setSavingDays(prev => prev.map((d, i) => i === idx ? { ...d, saved: type === 'saved', missed: type === 'missed' } : d));
  }

  // Formato de número con separador de miles
  function formatNumber(num) {
    return num?.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 mt-8 bg-white rounded-3xl shadow-2xl border-4 border-amber-200">
      <h2 className="text-3xl font-extrabold text-amber-700 mb-6 flex items-center gap-2">
        <CurrencyDollarIcon className="h-8 w-8 text-amber-500" /> Deudas
      </h2>
      <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <div className="font-bold text-yellow-800 mb-1">¿Cómo usar este apartado?</div>
        <ul className="list-disc pl-6 text-yellow-900 text-base">
          <li>Registra tus deudas con la fecha en que se generaron y la fecha límite de pago.</li>
          <li>En la calculadora de meta de ahorro, ingresa la cantidad que necesitas juntar y la fecha límite.</li>
          <li>Al calcular, se mostrará un calendario con los días de ahorro requeridos. Cada día debes ingresar si lograste ahorrar la cantidad sugerida.</li>
          <li>Si no ahorras en un día, márcalo con una <span className="text-red-600 font-bold">X</span> y el sistema ajustará las cantidades de los días restantes para que aún puedas llegar a la meta.</li>
        </ul>
      </div>

      {/* Registro de deudas */}
      <form onSubmit={handleAddDebt} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input
          name="name"
          value={debtForm.name}
          onChange={handleDebtChange}
          placeholder="Descripción de la deuda"
          className="col-span-1 px-4 py-2 rounded-lg border-2 border-amber-300 focus:ring-2 focus:ring-amber-400 outline-none"
        />
        <input
          name="amount"
          value={amountInput}
          onChange={handleDebtChange}
          placeholder="Monto ($)"
          inputMode="numeric"
          min="1"
          step="1"
          className="col-span-1 px-4 py-2 rounded-lg border-2 border-amber-300 focus:ring-2 focus:ring-amber-400 outline-none"
          title="Ingresa solo números, el monto se mostrará con separadores de miles."
        />
        <input
          name="createdAt"
          value={debtForm.createdAt}
          onChange={handleDebtChange}
          type="date"
          placeholder="Fecha de generación"
          className="col-span-1 px-4 py-2 rounded-lg border-2 border-amber-300 focus:ring-2 focus:ring-amber-400 outline-none"
          title="Selecciona la fecha en que se generó la deuda."
        />
        <input
          name="dueDate"
          value={debtForm.dueDate}
          onChange={handleDebtChange}
          type="date"
          placeholder="Fecha de pago"
          className="col-span-1 px-4 py-2 rounded-lg border-2 border-amber-300 focus:ring-2 focus:ring-amber-400 outline-none"
          title="Selecciona la fecha límite para pagar la deuda."
        />
        <button
          type="submit"
          className="col-span-1 md:col-span-4 mt-2 px-6 py-2 rounded-lg bg-yellow-600 text-white font-bold shadow hover:bg-yellow-700 transition"
        >
          Agregar Deuda
        </button>
      </form>

      {/* Listado de deudas */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-amber-700 mb-2 flex items-center gap-1">
          <CalendarDaysIcon className="h-6 w-6 text-amber-400" /> Deudas registradas
        </h3>
        <ul className="divide-y divide-amber-100">
          {debts.length === 0 && <li className="text-amber-400">No hay deudas registradas.</li>}
          {debts.map(debt => (
            <li key={debt.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <span className="font-semibold text-amber-800">{debt.name}</span> <span className="text-amber-500">${formatNumber(debt.amount)}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 text-amber-600">
                <span className="flex items-center gap-1"><CalendarDaysIcon className="h-5 w-5" /> Generada: {debt.createdAt}</span>
                <span className="flex items-center gap-1"><CalendarDaysIcon className="h-5 w-5" /> Pago: {debt.dueDate}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Apartado de metas de ahorro */}
      <div className="mb-6 p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800">
        <h3 className="text-lg font-bold mb-2">Calculadora de meta de ahorro</h3>
        <form onSubmit={handleRecommend} className="flex flex-col md:flex-row gap-4 items-end">
          <input
            name="goalAmount"
            value={goalAmountInput}
            onChange={handleGoalChange}
            placeholder="Cantidad a juntar ($)"
            inputMode="numeric"
            min="1"
            step="1"
            className="px-4 py-2 rounded-lg border-2 border-amber-300 focus:ring-2 focus:ring-amber-400 outline-none"
            title="Ingresa solo números, el monto se mostrará con separadores de miles."
          />
          <input
            name="goalDate"
            value={goalForm.goalDate}
            onChange={handleGoalChange}
            type="date"
            placeholder="Fecha objetivo"
            className="px-4 py-2 rounded-lg border-2 border-amber-300 focus:ring-2 focus:ring-amber-400 outline-none"
            title="Selecciona la fecha límite para juntar el dinero."
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-amber-500 text-white font-bold shadow hover:bg-amber-600 transition"
          >
            Calcular
          </button>
        </form>
        {recommendation && (
          <div className="mt-4">
            <div className="font-bold mb-1">Recomendación de ahorro:</div>
            <div>
              Ahorra <span className="font-semibold">${formatNumber(recommendation.perDay)}</span> diarios,
              <span className="font-semibold"> ${formatNumber(recommendation.perWeek)}</span> semanales, o
              <span className="font-semibold"> ${formatNumber(recommendation.perMonth)}</span> mensuales
              durante {recommendation.days} días ({recommendation.weeks} semanas, {recommendation.months} meses) para juntar <span className="font-semibold">${formatNumber(recommendation.amount)}</span> antes del {recommendation.due.toLocaleDateString()}.
            </div>
            {/* Calendario interactivo de ahorro */}
            <div className="mt-6">
              <div className="font-bold mb-2">Calendario de ahorro diario</div>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {savingDays.map((d, idx) => (
                    <div key={idx} className={`flex flex-col items-center p-2 rounded-lg border ${d.saved ? 'bg-green-100 border-green-400' : d.missed ? 'bg-red-100 border-red-400' : 'bg-white border-amber-200'} transition-all`}>
                      <span className="text-xs text-amber-700">{d.date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' })}</span>
                      <span className="text-sm font-bold">{d.saved ? '✔️' : d.missed ? '❌' : ''}</span>
                      <div className="flex gap-1 mt-1">
                        <button type="button" className="text-green-700 text-xs px-1 py-0.5 rounded hover:bg-green-100 border border-green-300" onClick={() => markDay(idx, 'saved')}>Ahorre</button>
                        <button type="button" className="text-red-700 text-xs px-1 py-0.5 rounded hover:bg-red-100 border border-red-300" onClick={() => markDay(idx, 'missed')}>No ahorre</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Ajuste de cantidades */}
              {savingDays.some(d => d.missed) && (
                <div className="mt-4 text-amber-900 bg-amber-100 p-2 rounded-lg border border-amber-200">
                  <b>¡Atención!</b> Como hay días marcados como "No ahorré", la cantidad diaria sugerida para los días restantes se ajusta automáticamente.<br />
                  <span className="font-semibold">Nueva cantidad diaria sugerida: </span>
                  {formatNumber(recommendation.amount / (savingDays.filter(d => !d.saved && !d.missed).length || 1))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
