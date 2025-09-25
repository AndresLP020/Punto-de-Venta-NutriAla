import React, { useState, Fragment, useRef, useEffect } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { Combobox, Transition } from '@headlessui/react';


export default function RefundForm({ refund, onSave, onCancel }) {
  const { products, updateProduct } = useInventory();
  const [form, setForm] = useState({
    date: refund?.date || new Date(),
    amount: refund?.amount || '',
    reason: refund?.reason || '',
    user: refund?.user || '',
    productId: refund?.productId || '',
    condition: refund?.condition || 'good',
    defect: refund?.defect || ''
  });

  // Ref para el input del combobox
  const productInputRef = useRef(null);

  // Enfocar input al montar (solo una vez)
  useEffect(() => {
    productInputRef.current?.focus();
  }, []);
  const [saving, setSaving] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'productId') {
      const selected = products.find(p => p.id === parseInt(value));
      setForm(f => ({
        ...f,
        productId: value,
        amount: selected ? selected.price : ''
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // Filtrado de productos para el combobox
  const [query, setQuery] = useState("");
  const filteredProducts =
    query === ""
      ? products
      : products.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          (product.barcode && product.barcode.toLowerCase().includes(query.toLowerCase()))
        );


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const refundData = { ...form, date: new Date(form.date) };
    // If good condition, add back to inventory
    if (form.condition === 'good' && form.productId) {
      const product = products.find(p => p.id === parseInt(form.productId));
      if (product) {
        await updateProduct(product.id, { stock: (product.stock || 0) + 1 });
      }
    }
    onSave(refundData);
    setSaving(false);
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-2 md:p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-lg font-bold text-blue-900 mb-1">Fecha</label>
          <input type="date" name="date" value={form.date.toISOString().slice(0,10)} onChange={e => setForm(f => ({ ...f, date: new Date(e.target.value) }))} className="mt-1 block w-full border-2 border-blue-300 rounded-xl px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400" required />
        </div>
        <div>
          <label className="block text-lg font-bold text-blue-900 mb-1">Usuario</label>
          <input type="text" name="user" value={form.user} onChange={handleChange} className="mt-1 block w-full border-2 border-blue-300 rounded-xl px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400" required />
        </div>
      </div>
      <div>
        <label className="block text-lg font-bold text-blue-900 mb-1">Producto</label>
        <Combobox
          value={products.find(p => p.id === parseInt(form.productId)) || { name: '', stock: '', barcode: '', id: '' }}
          onChange={product => {
            if (!product || !product.id) return;
            setForm(f => ({
              ...f,
              productId: product.id,
              amount: product.price
            }));
          }}
        >
          <div className="relative mt-1">
            <Combobox.Input
              ref={productInputRef}
              className="w-full border-2 border-blue-300 rounded-xl px-4 py-2 text-lg bg-white focus:ring-2 focus:ring-blue-400"
              displayValue={product => product ? `${product.name} (Stock: ${product.stock})${product.barcode ? ` — ${product.barcode}` : ''}` : ''}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar y seleccionar producto por nombre o código de barras..."
              required
            />
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery("")}> 
              <Combobox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
                {filteredProducts.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-blue-700">No se encontraron productos</div>
                ) : (
                  (filteredProducts.length > 0 ?
                    filteredProducts.map(product => (
                      <Combobox.Option
                        key={product.id}
                        value={product}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-blue-900'}`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
                              {product.name} (Stock: {product.stock}){product.barcode ? ` — ${product.barcode}` : ''}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                ✓
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  : (
                    <div className="relative cursor-default select-none py-2 px-4 text-blue-700">No hay productos disponibles</div>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-lg font-bold text-blue-900 mb-1">Condición</label>
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="mt-1 block w-full border-2 border-blue-300 rounded-xl px-4 py-2 text-lg bg-white focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="good">Buen estado (se reincorpora al inventario)</option>
            <option value="bad">Mal estado</option>
          </select>
        </div>
        <div>
          <label className="block text-lg font-bold text-blue-900 mb-1">Monto</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} className="mt-1 block w-full border-2 border-blue-300 rounded-xl px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400" min="0" step="0.01" required />
        </div>
      </div>
      <div>
        <label className="block text-lg font-bold text-blue-900 mb-1">Motivo</label>
        <input type="text" name="reason" value={form.reason} onChange={handleChange} className="mt-1 block w-full border-2 border-blue-300 rounded-xl px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400" required />
      </div>
      {form.condition === 'bad' && (
        <div>
          <label className="block text-lg font-bold text-blue-900 mb-1">Descripción del defecto</label>
          <textarea
            name="defect"
            value={form.defect}
            onChange={handleChange}
            className="mt-1 block w-full border-2 border-blue-300 rounded-xl px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400"
            rows={3}
            placeholder="Describe el defecto del producto"
            required
          />
        </div>
      )}
      <div className="flex justify-end gap-4 mt-8">
        <button type="button" onClick={onCancel} className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-lg font-bold">Cancelar</button>
        <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg shadow hover:from-green-600 hover:to-green-700 transition-all" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
