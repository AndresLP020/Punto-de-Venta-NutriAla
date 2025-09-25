import React, { useState } from 'react';

export default function Salaries() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', salary: '' });
  const [showForm, setShowForm] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAdd = () => {
    setShowForm(true);
    setForm({ name: '', salary: '' });
  };

  const handleSave = e => {
    e.preventDefault();
    if (!form.name || !form.salary) return;
    setEmployees(prev => [...prev, { ...form, salary: parseFloat(form.salary) }]);
    setShowForm(false);
  };

  // Calcular sueldos y ganancias
  const totalSalaries = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
  // Simulación: ganancias brutas y netas semanales
  const grossEarnings = 5000; // Aquí deberías calcularlo según tus ventas reales
  const netEarnings = grossEarnings - totalSalaries;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-900 flex items-center gap-2">
        <span className="inline-block bg-blue-100 p-2 rounded-full">
          <svg className="h-7 w-7 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V6a2 2 0 012-2h12a2 2 0 012 2v8c0 2.21-3.582 4-8 4z" /></svg>
        </span>
        Sueldos y Trabajadores
      </h2>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-green-700">Ganancia Bruta Semanal: <span className="font-bold text-green-900">${grossEarnings.toLocaleString('es-MX', {minimumFractionDigits:2})}</span></div>
          <div className="text-lg font-semibold text-blue-700">Total Sueldos: <span className="font-bold text-blue-900">${totalSalaries.toLocaleString('es-MX', {minimumFractionDigits:2})}</span></div>
          <div className="text-lg font-semibold text-emerald-700">Ganancia Neta Semanal: <span className="font-bold text-emerald-900">${netEarnings.toLocaleString('es-MX', {minimumFractionDigits:2})}</span></div>
        </div>
        <button onClick={handleAdd} className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition-all">+ Agregar Trabajador</button>
      </div>
      <div className="bg-white rounded-xl shadow p-4 divide-y divide-blue-50">
        {employees.length === 0 ? (
          <div className="text-blue-400 text-center py-8 text-lg">No hay trabajadores registrados.</div>
        ) : (
          employees.map((emp, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div className="font-bold text-blue-900 text-lg">{emp.name}</div>
              <div className="font-semibold text-blue-700 text-lg">${emp.salary.toLocaleString('es-MX', {minimumFractionDigits:2})}</div>
            </div>
          ))
        )}
      </div>
      {showForm && (
        <form onSubmit={handleSave} className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-2 border-blue-200">
            <h3 className="text-xl font-bold mb-4 text-blue-900">Agregar Trabajador</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-blue-900 mb-1">Nombre</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="block w-full border-2 border-blue-300 rounded-xl px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400" required />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-blue-900 mb-1">Sueldo semanal</label>
              <input type="number" name="salary" value={form.salary} onChange={handleChange} className="block w-full border-2 border-blue-300 rounded-xl px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400" min="0" step="0.01" required />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-lg font-bold">Cancelar</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg shadow hover:from-green-600 hover:to-green-700 transition-all">Guardar</button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
