import React, { useState } from 'react';
import { useFinancial } from '../hooks/useFinancial';
import toast from 'react-hot-toast';

export default function Salaries() {
  const {
    employees,
    totalSalaries,
    weeklyRevenue,
    weeklyNetProfit,
    availableCash,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    processPayroll,
    checkFinancialAlerts
  } = useFinancial();

  // Debug: Mostrar información del contexto financiero
  console.log('🔍 Salaries Debug:', {
    employees,
    totalSalaries,
    weeklyRevenue,
    weeklyNetProfit,
    availableCash,
    employeesLength: employees?.length || 0
  });

  const [form, setForm] = useState({ name: '', weeklySalary: '', position: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAdd = () => {
    setShowForm(true);
    setForm({ name: '', weeklySalary: '', position: '' });
    setEditingEmployee(null);
  };

  const handleEdit = (employee) => {
    setShowForm(true);
    setForm({
      name: employee.name,
      weeklySalary: employee.weeklySalary.toString(),
      position: employee.position || ''
    });
    setEditingEmployee(employee);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.weeklySalary) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const employeeData = {
        name: form.name,
        weeklySalary: parseFloat(form.weeklySalary),
        position: form.position || 'Empleado',
        hireDate: new Date()
      };

      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, {
          ...editingEmployee,
          ...employeeData
        });
      } else {
        await addEmployee(employeeData);
      }

      setShowForm(false);
      setEditingEmployee(null);
      setForm({ name: '', weeklySalary: '', position: '' });
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        await deleteEmployee(employeeId);
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handlePayroll = async () => {
    if (availableCash < totalSalaries) {
      toast.error('Efectivo insuficiente para procesar la nómina');
      return;
    }

    if (window.confirm(`¿Procesar nómina por $${totalSalaries.toFixed(2)}?`)) {
      try {
        const result = await processPayroll();
        if (result.success) {
          toast.success(`Nómina procesada exitosamente: $${result.amount.toFixed(2)}`);
        }
      } catch (error) {
        console.error('Error processing payroll:', error);
      }
    }
  };

  // Verificar alertas financieras
  const alerts = checkFinancialAlerts();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Debug Info */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-800">
              <strong>Debug:</strong> Empleados: {employees?.length || 0} | Revenue: ${weeklyRevenue?.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {employees?.length === 0 ? '⚠️ No hay empleados registrados' : '✅ Empleados cargados'}
              {' | '}
              {weeklyRevenue === 0 ? '⚠️ No hay ingresos cargados' : '✅ Ingresos cargados'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-600">
              Efectivo: ${availableCash?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-blue-900 flex items-center gap-2">
        <span className="inline-block bg-blue-100 p-2 rounded-full">
          <svg className="h-7 w-7 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V6a2 2 0 012-2h12a2 2 0 012 2v8c0 2.21-3.582 4-8 4z" />
          </svg>
        </span>
        Sueldos y Trabajadores
      </h2>

      {/* Alertas financieras */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
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

      {/* Resumen financiero */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-lg font-semibold text-green-700">Ingresos Semanales</div>
          <div className="text-2xl font-bold text-green-900">${weeklyRevenue.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits: 2})}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-lg font-semibold text-blue-700">Total Sueldos</div>
          <div className="text-2xl font-bold text-blue-900">${totalSalaries.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits: 2})}</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <div className="text-lg font-semibold text-emerald-700">Ganancia Neta Semanal</div>
          <div className={`text-2xl font-bold ${weeklyNetProfit >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>
            ${weeklyNetProfit.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits: 2})}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-lg font-semibold text-purple-700">Efectivo Disponible</div>
          <div className={`text-2xl font-bold ${availableCash >= totalSalaries ? 'text-purple-900' : 'text-red-900'}`}>
            ${availableCash.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits: 2})}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <button 
          onClick={handleAdd} 
          className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition-all"
        >
          + Agregar Trabajador
        </button>
        <button 
          onClick={handlePayroll}
          disabled={availableCash < totalSalaries || employees.length === 0}
          className={`px-6 py-2 rounded-xl font-bold shadow transition-all ${
            availableCash >= totalSalaries && employees.length > 0
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          💰 Procesar Nómina (${totalSalaries.toFixed(2)})
        </button>
      </div>

      {/* Lista de empleados */}
      <div className="bg-white rounded-xl shadow p-4 divide-y divide-blue-50">
        {employees.length === 0 ? (
          <div className="text-blue-400 text-center py-8 text-lg">No hay trabajadores registrados.</div>
        ) : (
          employees.map((emp) => (
            <div key={emp.id} className="py-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="font-bold text-blue-900 text-lg">{emp.name}</div>
                <div className="text-blue-600 text-sm">{emp.position}</div>
                <div className="text-gray-500 text-xs">
                  Contratado: {new Date(emp.hireDate).toLocaleDateString('es-ES')}
                </div>
                {emp.lastPaymentDate && (
                  <div className="text-green-600 text-xs">
                    Último pago: {new Date(emp.lastPaymentDate).toLocaleDateString('es-ES')}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="font-semibold text-blue-700 text-lg">
                  ${emp.weeklySalary.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits: 2})}
                </div>
                <div className="text-gray-500 text-sm">semanal</div>
                {emp.totalPaid > 0 && (
                  <div className="text-green-600 text-xs">
                    Pagado: ${emp.totalPaid.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits: 2})}
                  </div>
                )}
              </div>
              <div className="ml-4 flex gap-2">
                <button
                  onClick={() => handleEdit(emp)}
                  className="px-3 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para agregar/editar empleado */}
      {showForm && (
        <form onSubmit={handleSave} className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-2 border-blue-200">
            <h3 className="text-xl font-bold mb-4 text-blue-900">
              {editingEmployee ? 'Editar Trabajador' : 'Agregar Trabajador'}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-blue-900 mb-1">Nombre *</label>
              <input 
                type="text" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                className="block w-full border-2 border-blue-300 rounded-xl px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400" 
                required 
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-blue-900 mb-1">Puesto</label>
              <input 
                type="text" 
                name="position" 
                value={form.position} 
                onChange={handleChange} 
                className="block w-full border-2 border-blue-300 rounded-xl px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400" 
                placeholder="Empleado"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-blue-900 mb-1">Sueldo semanal *</label>
              <input 
                type="number" 
                name="weeklySalary" 
                value={form.weeklySalary} 
                onChange={handleChange} 
                className="block w-full border-2 border-blue-300 rounded-xl px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400" 
                min="0" 
                step="0.01" 
                required 
              />
            </div>
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingEmployee(null);
                  setForm({ name: '', weeklySalary: '', position: '' });
                }} 
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-lg font-bold"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg shadow hover:from-green-600 hover:to-green-700 transition-all"
              >
                {editingEmployee ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
