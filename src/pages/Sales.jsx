import React, { useState, useRef, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  QrCodeIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  CreditCardIcon,
  BanknotesIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { Button, Input, Card, Badge } from '../components/ui/index.jsx';
import RefundsModal from '../components/ui/RefundsModal.jsx';
import { useInventory } from '../hooks/useInventory';

export default function Sales() {
  const {
    products,
    currentSale,
    addToCurrentSale,
    removeFromCurrentSale,
    updateCurrentSaleItem,
    completeSale,
    clearCurrentSale,
    findProductByBarcode
  } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [showRefunds, setShowRefunds] = useState(false);
  const [refunds, setRefunds] = useState([
    // Ejemplo de devolución inicial
    { date: new Date(), amount: 100, reason: 'Producto defectuoso', user: 'Juan Pérez' }
  ]);

  const handleAddRefund = (refund) => {
    setRefunds((prev) => [
      { ...refund, id: refund.id || Date.now() },
      ...prev.filter(r => r.id !== refund.id)
    ]);
  };
  const [barcodeInput, setBarcodeInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [processing, setProcessing] = useState(false);
  const barcodeInputRef = useRef(null);

  // Filter products for search
  const filteredProducts = products.filter(product =>
    product.isActive &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.barcode.includes(searchTerm) ||
     product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ).slice(0, 10);

  // Calculate totals
  const subtotal = currentSale.reduce((sum, item) => sum + item.total, 0);
  const taxRate = 0.16; // 16% IVA
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes;

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const product = await findProductByBarcode(barcodeInput.trim());
    if (product) {
      addToCurrentSale(product, 1);
      setBarcodeInput('');
      setTimeout(() => barcodeInputRef.current?.focus(), 100); // volver a enfocar
    } else {
      alert('Producto no encontrado');
      setTimeout(() => barcodeInputRef.current?.focus(), 100);
    }
  };

  // Enfocar input al montar y cuando cambia currentSale
  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, [currentSale]);

  // (No forzar el foco si el usuario lo quita)

  const handleProductAdd = (product) => {
    addToCurrentSale(product, 1);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCurrentSale(productId);
    } else {
      updateCurrentSaleItem(productId, newQuantity);
    }
  };

  const handleCompleteSale = async () => {
    if (currentSale.length === 0) return;

    setProcessing(true);
    try {
      await completeSale(paymentMethod);
      setPaymentMethod('efectivo');
    } catch (error) {
      console.error('Error completing sale:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Modal de devoluciones */}
      <RefundsModal
        isOpen={showRefunds}
        onClose={() => setShowRefunds(false)}
        refunds={refunds}
        onAddRefund={handleAddRefund}
      />
      {/* Product Search and Selection */}
      <div className="lg:col-span-2 space-y-6">
        {/* Barcode Scanner */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <QrCodeIcon className="h-5 w-5 inline mr-2" />
            Escáner de Código de Barras
          </h3>
          <form onSubmit={handleBarcodeSubmit} className="flex space-x-2">
            <Input
              ref={barcodeInputRef}
              placeholder="Escanea o ingresa el código de barras"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button type="submit">
              Buscar
            </Button>
          </form>
        </Card>

        {/* Product Search */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <MagnifyingGlassIcon className="h-5 w-5 inline mr-2" />
            Buscar Productos
          </h3>
          <Input
            placeholder="Buscar por nombre, código o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg p-3 hover:border-nutriala-300 cursor-pointer transition-colors"
                onClick={() => handleProductAdd(product)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-nutriala-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <Badge variant={product.stock <= product.minStock ? 'warning' : 'success'}>
                        Stock: {product.stock}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {searchTerm && filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No se encontraron productos
            </p>
          )}
        </Card>
      </div>

      {/* Cart and Checkout */}
      <div className="space-y-6">
        {/* Botón para devoluciones */}
        <Card>
          <Button variant="secondary" className="w-full" onClick={() => setShowRefunds(true)}>
            Devoluciones
          </Button>
        </Card>
        {/* Current Sale */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Venta Actual
            </h3>
            {currentSale.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearCurrentSale}
              >
                Limpiar
              </Button>
            )}
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {currentSale.map((item) => (
              <div key={item.productId} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {item.productName}
                  </h4>
                  <p className="text-xs text-gray-500">
                    ${item.unitPrice.toFixed(2)} c/u
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    <MinusIcon className="h-3 w-3" />
                  </button>
                  
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    <PlusIcon className="h-3 w-3" />
                  </button>
                  
                  <button
                    onClick={() => removeFromCurrentSale(item.productId)}
                    className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
                
                <div className="text-right ml-4">
                  <span className="text-sm font-bold text-gray-900">
                    ${item.total.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {currentSale.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCartIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No hay productos en la venta</p>
            </div>
          )}
        </Card>

        {/* Payment */}
        {currentSale.length > 0 && (
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Método de Pago
            </h3>
            
            <div className="space-y-3 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="efectivo"
                  checked={paymentMethod === 'efectivo'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                <BanknotesIcon className="h-5 w-5 mr-2 text-green-600" />
                Efectivo
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="tarjeta"
                  checked={paymentMethod === 'tarjeta'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                <CreditCardIcon className="h-5 w-5 mr-2 text-blue-600" />
                Tarjeta
              </label>
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA (16%):</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-nutriala-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleCompleteSale}
              disabled={processing || currentSale.length === 0}
              className="w-full mt-4"
              size="lg"
            >
              {processing ? 'Procesando...' : 'Completar Venta'}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
