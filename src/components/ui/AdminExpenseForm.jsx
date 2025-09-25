
import React, { useState } from 'react';

const CATEGORY_OPTIONS = [
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

export default function AdminExpenseForm({ expense, onSave, onCancel }) {
  const [form, setForm] = useState({
    date: expense?.date || new Date(),
    amount: expense?.amount || '',
    description: expense?.description || '',
    category: expense?.category || CATEGORY_OPTIONS[0],
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, date: new Date(form.date), category: form.category });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-2">
      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha</label>
        <input type="date" name="date" value={form.date.toISOString().slice(0,10)} onChange={e => setForm(f => ({ ...f, date: new Date(e.target.value) }))} className="mt-1 block w-full border rounded px-2 py-1" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <input type="text" name="description" value={form.description} onChange={handleChange} className="mt-1 block w-full border rounded px-2 py-1" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Monto</label>
        <input type="number" name="amount" value={form.amount} onChange={handleChange} className="mt-1 block w-full border rounded px-2 py-1" min="0" step="0.01" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Categoría</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
          required
        >
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Cancelar</button>
        <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Guardar</button>
      </div>
    </form>
  );
}
