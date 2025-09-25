import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';

/**
 * Modal para mostrar productos con stock bajo
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {function} props.onClose - Función para cerrar el modal
 * @param {Array} props.products - Lista de productos con stock bajo
 */
export default function LowStockModal({ isOpen, onClose, products }) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 z-10">
              <div className="flex items-center mb-4">
                <BellIcon className="h-6 w-6 text-yellow-500 mr-2" />
                <Dialog.Title className="text-lg font-semibold text-gray-800">Productos con Stock Bajo</Dialog.Title>
              </div>
              {products.length === 0 ? (
                <p className="text-gray-500">No hay productos con stock bajo.</p>
              ) : (
                <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                  {products.map(product => (
                    <li key={product.id} className="py-2 flex flex-col">
                      <span className="font-medium text-gray-900">{product.name}</span>
                      <span className="text-xs text-gray-500">Stock: <span className="font-semibold text-yellow-700">{product.stock}</span> (Mínimo: {product.minStock})</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
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
