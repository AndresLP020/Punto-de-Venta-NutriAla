import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Dialog, Transition } from '@headlessui/react';
import { CalendarDaysIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

/**
 * Modal para mostrar historial de ventas diarias
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {function} props.onClose - Función para cerrar el modal
 * @param {Array} props.salesByDay - Lista de ventas por día
 */

export default function SalesHistoryModal({ isOpen, onClose, salesByDay = [] }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleToggle = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  // Formato de fecha para comparar (DD/MM/YYYY)
  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES');
  };

  // Filtrar ventas por la fecha seleccionada
  const filteredSales = salesByDay.filter(sale => {
    // sale.day puede ser '22/7/2025' o similar
    return sale.day === formatDate(selectedDate);
  });

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen px-4">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto p-6 z-10">
              <div className="flex items-center mb-4">
                <CalendarDaysIcon className="h-6 w-6 text-blue-500 mr-2" />
                <Dialog.Title className="text-lg font-semibold text-gray-800">Historial de Ventas Diarias</Dialog.Title>
              </div>
              <div className="mb-6 flex items-center gap-3">
                <span className="text-base font-medium text-gray-700">Selecciona una fecha:</span>
                <DatePicker
                  selected={selectedDate}
                  onChange={date => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-800 font-semibold"
                  maxDate={new Date()}
                  locale="es"
                  calendarClassName="rounded-lg shadow-lg"
                  popperPlacement="bottom"
                />
              </div>
              {filteredSales.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <CalendarDaysIcon className="h-10 w-10 text-blue-200 mb-2" />
                  <p className="text-gray-400 text-lg font-medium">No hay ventas registradas para esta fecha.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {filteredSales.map((sale, idx) => (
                    <li key={sale.day + idx} className="py-3">
                      <button
                        className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors shadow-sm"
                        onClick={() => handleToggle(idx)}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-blue-900 text-lg">{sale.day}</span>
                          <span className="text-xs text-gray-500">Total del día</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-base font-bold text-blue-700">${sale.revenue}</span>
                          {expandedIndex === idx ? (
                            <ChevronUpIcon className="h-5 w-5 text-blue-500" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </button>
                      {expandedIndex === idx && sale.products && (
                        <ul className="mt-4 ml-2 border-l-4 border-blue-200 pl-4 space-y-3 bg-blue-50 rounded-lg py-2">
                          {sale.products.map((prod, pidx) => (
                            <li key={pidx} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="block font-medium text-gray-800">{prod.name}</span>
                                <span className="inline-block bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full ml-2">x{prod.qty}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 font-semibold">${prod.price}</span>
                                {prod.time && (
                                  <span className="inline-flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-mono shadow">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                                    {prod.time}
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
