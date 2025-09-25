import React, { useState } from 'react';
import RefundForm from './RefundForm';
import { useInventory } from '../../hooks/useInventory';
import { Dialog, Transition } from '@headlessui/react';
import ReactFragment from 'react';

export default function RefundsModal({ isOpen, onClose, refunds = [], onAddRefund }) {
  const [showForm, setShowForm] = useState(false);
  const [editingRefund, setEditingRefund] = useState(null);
  const { products } = useInventory();

  const handleEdit = (refund) => {
    setEditingRefund(refund);
    setShowForm(true);
  };
  const handleAdd = () => {
    setEditingRefund(null);
    setShowForm(true);
  };
  const handleSave = (refund) => {
    onAddRefund(refund);
    setShowForm(false);
    setEditingRefund(null);
  };

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gradient-to-br from-blue-900/70 via-blue-700/60 to-blue-400/50 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen px-2 md:px-8">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0 translate-y-8 scale-95" enterTo="opacity-100 translate-y-0 scale-100"
            leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 scale-100" leaveTo="opacity-0 translate-y-8 scale-95"
          >
            <Dialog.Panel className="relative bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-3xl shadow-2xl w-full max-w-2xl mx-auto p-10 z-10 border-4 border-blue-300 animate-fade-in">
              <Dialog.Title className="text-3xl font-extrabold text-blue-900 mb-8 tracking-wide drop-shadow-lg flex items-center gap-3">
                <span className="inline-block bg-blue-200 rounded-full p-2 shadow"><svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-blue-700' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2z' /></svg></span>
                Devoluciones
              </Dialog.Title>
              <button onClick={handleAdd} className="mb-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-lg shadow hover:from-blue-700 hover:to-blue-600 transition-all">
                + Agregar Devolución
              </button>
              <div className="max-h-96 overflow-y-auto divide-y divide-blue-100 bg-white/60 rounded-xl p-2">
                {refunds.length === 0 ? (
                  <div className="text-blue-400 text-center py-12 text-xl font-semibold">No hay devoluciones registradas.</div>
                ) : (
                  refunds.map((refund, idx) => {
                    const product = products.find(p => p.id === parseInt(refund.productId));
                    return (
                      <div key={idx} className="py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-2">
                        <div>
                          <span className="font-bold text-blue-800 text-lg">{refund.user}</span>
                          <span className="mx-2 text-gray-500">—</span>
                          <span className="text-gray-700 text-base">{refund.reason}</span>
                          {product && (
                            <div className="text-sm text-blue-900 font-semibold mt-1">
                              {product.name} {product.barcode && (<span className="text-xs text-blue-500">— {product.barcode}</span>)}
                            </div>
                          )}
                          <div className="text-xs text-blue-500 mt-1">{new Date(refund.date).toLocaleDateString('es-MX')}</div>
                        </div>
                        <div className="font-extrabold text-2xl text-red-500 drop-shadow">-${parseFloat(refund.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                        <button onClick={() => handleEdit(refund)} className="text-sm px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-200 transition-all">Editar</button>
                      </div>
                    );
                  })
                )}
              </div>
              {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                  <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-3xl shadow-2xl p-10 w-full max-w-xl border-4 border-blue-300 animate-fade-in">
                    <RefundForm
                      refund={editingRefund}
                      onSave={handleSave}
                      onCancel={() => { setShowForm(false); setEditingRefund(null); }}
                    />
                  </div>
                </div>
              )}
              <div className="mt-10 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg shadow hover:from-blue-600 hover:to-blue-700 transition-all"
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
