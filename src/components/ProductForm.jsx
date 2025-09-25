import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Select } from './ui/index.jsx';
import { useInventory } from '../hooks/useInventory';
import { QrCodeIcon } from '@heroicons/react/24/outline';

export default function ProductForm({ product, onClose }) {
  const { categories, addProduct, updateProduct } = useInventory();
  const [formData, setFormData] = useState({
    barcode: '',
    name: '',
    description: '',
    category: '',
    salePrice: '',
    purchasePrice: '',
    stock: '',
    minStock: '',
    maxStock: '',
    supplier: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const [profitMargin, setProfitMargin] = useState(0);
  const [profitAmount, setProfitAmount] = useState(0);
  const barcodeInputRef = useRef(null);
  // Enfocar input de código de barras al abrir el formulario (solo una vez)
  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        barcode: product.barcode || '',
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        salePrice: product.price?.toString() || '',
        purchasePrice: product.cost?.toString() || '',
        stock: product.stock?.toString() || '',
        minStock: product.minStock?.toString() || '',
        maxStock: product.maxStock?.toString() || '',
        supplier: product.supplier || '',
        isActive: product.isActive
      });
    }
  }, [product]);

  // Calcular ganancia cuando cambien los precios
  useEffect(() => {
    const sale = parseFloat(formData.salePrice) || 0;
    const purchase = parseFloat(formData.purchasePrice) || 0;
    
    if (sale > 0 && purchase > 0) {
      const profit = sale - purchase;
      const margin = ((profit / sale) * 100);
      setProfitAmount(profit);
      setProfitMargin(margin);
    } else {
      setProfitAmount(0);
      setProfitMargin(0);
    }
  }, [formData.salePrice, formData.purchasePrice]);

  const categoryOptions = categories.map(cat => ({
    value: cat.name,
    label: cat.name
  }));

  const validateForm = () => {
    const newErrors = {};

    if (!formData.barcode.trim()) {
      newErrors.barcode = 'El código de barras es requerido';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es requerido';
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }

    if (!formData.salePrice || parseFloat(formData.salePrice) <= 0) {
      newErrors.salePrice = 'El precio de venta debe ser mayor a 0';
    }

    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'El precio de compra debe ser mayor a 0';
    }

    if (parseFloat(formData.salePrice) <= parseFloat(formData.purchasePrice)) {
      newErrors.salePrice = 'El precio de venta debe ser mayor al precio de compra';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock actual debe ser mayor o igual a 0';
    }

    if (!formData.minStock || parseInt(formData.minStock) < 0) {
      newErrors.minStock = 'El stock mínimo debe ser mayor o igual a 0';
    }

    if (!formData.maxStock || parseInt(formData.maxStock) <= 0) {
      newErrors.maxStock = 'El stock máximo debe ser mayor a 0';
    }

    if (parseInt(formData.minStock) >= parseInt(formData.maxStock)) {
      newErrors.maxStock = 'El stock máximo debe ser mayor al stock mínimo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Función para activar el escáner de código de barras
  const startBarcodeScanner = async () => {
    try {
      setScanning(true);
      
      // Por simplicidad, usaremos un prompt para simular el escáner
      // En una implementación real, aquí se integraría ZXing o similar
      setTimeout(() => {
        const barcodeInput = prompt('Ingresa el código de barras escaneado:');
        if (barcodeInput) {
          setFormData(prev => ({
            ...prev,
            barcode: barcodeInput
          }));
        }
        setScanning(false);
      }, 1000);
    } catch (error) {
      console.error('Error with scanner:', error);
      setScanning(false);
    }
  };

  // Función para entrada manual rápida del código de barras
  const handleBarcodeInput = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Si el input tiene más de 8 caracteres, probablemente es un código de barras escaneado
      if (e.target.value.length >= 8) {
        // Enfocar el siguiente campo (nombre del producto)
        const nameInput = document.querySelector('input[name="name"]');
        if (nameInput) nameInput.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.salePrice),
        cost: parseFloat(formData.purchasePrice),
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock),
        maxStock: parseInt(formData.maxStock)
      };

      if (product) {
        await updateProduct(product.id, productData);
      } else {
        await addProduct(productData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Código de Barras con Scanner */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Código de Barras *
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              ref={barcodeInputRef}
              type="text"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              onKeyDown={handleBarcodeInput}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nutriala-500 focus:border-transparent"
              placeholder="Escanea o ingresa el código manualmente"
              required
            />
            {errors.barcode && (
              <p className="mt-1 text-sm text-red-600">{errors.barcode}</p>
            )}
          </div>
          <button
            type="button"
            onClick={startBarcodeScanner}
            disabled={scanning}
            className="px-4 py-2 bg-nutriala-600 text-white rounded-md hover:bg-nutriala-700 focus:outline-none focus:ring-2 focus:ring-nutriala-500 disabled:opacity-50 flex items-center gap-2"
          >
            {scanning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Escaneando...
              </>
            ) : (
              <>
                <QrCodeIcon className="h-4 w-4" />
                Escanear
              </>
            )}
          </button>
        </div>
      </div>

      {/* Información Básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre del Producto"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="Ej: Proteína Whey Vainilla"
        />

        <Select
          label="Categoría"
          name="category"
          value={formData.category}
          onChange={handleChange}
          error={errors.category}
          options={categoryOptions}
          required
        />
      </div>

      <Input
        label="Descripción"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Descripción detallada del producto"
      />

      <Input
        label="Proveedor"
        name="supplier"
        value={formData.supplier}
        onChange={handleChange}
        error={errors.supplier}
        placeholder="Ej: Nutrición Premium"
      />

      {/* Precios y Ganancia */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">💰 Información de Precios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Precio de Compra (Costo)"
            name="purchasePrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.purchasePrice}
            onChange={handleChange}
            error={errors.purchasePrice}
            required
            placeholder="0.00"
          />

          <Input
            label="Precio de Venta"
            name="salePrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.salePrice}
            onChange={handleChange}
            error={errors.salePrice}
            required
            placeholder="0.00"
          />
        </div>
        
        {/* Indicador de Ganancia */}
        {formData.purchasePrice && formData.salePrice && profitAmount > 0 && (
          <div className="mt-4 p-3 bg-green-100 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-800">
                💵 Ganancia por unidad: <span className="font-bold">${profitAmount.toFixed(2)}</span>
              </span>
              <span className="text-sm font-medium text-green-800">
                📊 Margen: <span className="font-bold">{profitMargin.toFixed(1)}%</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Inventario */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">📦 Control de Inventario</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Stock Actual"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            error={errors.stock}
            required
            placeholder="0"
          />

          <Input
            label="Stock Mínimo"
            name="minStock"
            type="number"
            min="0"
            value={formData.minStock}
            onChange={handleChange}
            error={errors.minStock}
            required
            placeholder="5"
          />

          <Input
            label="Stock Máximo"
            name="maxStock"
            type="number"
            min="1"
            value={formData.maxStock}
            onChange={handleChange}
            error={errors.maxStock}
            required
            placeholder="100"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-nutriala-600 focus:ring-nutriala-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          ✅ Producto activo
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Guardando...' : (product ? 'Actualizar Producto' : 'Crear Producto')}
        </Button>
      </div>
    </form>
  );
}
