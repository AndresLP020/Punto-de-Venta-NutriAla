import React, { useState, useRef } from 'react';
import { QrCodeIcon, CameraIcon } from '@heroicons/react/24/outline';
import { Card, Button, Badge } from '../components/ui/index.jsx';
import { useInventory } from '../hooks/useInventory';

export default function Scanner() {
  const { findProductByBarcode, addToCurrentSale } = useInventory();
  const [scannedProduct, setScannedProduct] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const fileInputRef = useRef(null);

  const handleManualScan = async (code) => {
    if (!code.trim()) return;

    const product = await findProductByBarcode(code.trim());
    setScannedProduct(product);
    
    if (!product) {
      // Show not found message
      setTimeout(() => setScannedProduct(null), 3000);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd use a library like @zxing/library to decode the barcode from image
      // For now, we'll simulate this
      alert('Funcionalidad de escaneo por imagen en desarrollo');
    }
  };

  const addProductToSale = () => {
    if (scannedProduct) {
      addToCurrentSale(scannedProduct, 1);
      setScannedProduct(null);
      setManualCode('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Scanner Header */}
      <div className="text-center">
        <QrCodeIcon className="h-16 w-16 text-nutriala-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Escáner de Códigos de Barras</h2>
        <p className="text-gray-600 mt-2">
          Escanea o ingresa manualmente el código de barras del producto
        </p>
      </div>

      {/* Manual Input */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Entrada Manual</h3>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Ingresa el código de barras"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualScan(manualCode)}
              className="input-field flex-1"
              autoFocus
            />
            <Button onClick={() => handleManualScan(manualCode)}>
              Buscar
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">o</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <CameraIcon className="h-5 w-5 mr-2" />
              Escanear desde Imagen
            </Button>
          </div>
        </div>
      </Card>

      {/* Camera Scanner */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Escáner de Cámara</h3>
        <div className="text-center space-y-4">
          {!isScanning ? (
            <div>
              <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <QrCodeIcon className="h-24 w-24 text-gray-400" />
              </div>
              <Button
                onClick={() => setIsScanning(true)}
                disabled
              >
                <CameraIcon className="h-5 w-5 mr-2" />
                Activar Cámara (Próximamente)
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                La funcionalidad de cámara estará disponible próximamente
              </p>
            </div>
          ) : (
            <div>
              <div className="w-48 h-48 bg-black rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white">Vista de cámara</span>
              </div>
              <Button
                variant="danger"
                onClick={() => setIsScanning(false)}
              >
                Detener Escáner
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Scanned Product Result */}
      {scannedProduct && (
        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                Producto Encontrado
              </h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Nombre:</span> {scannedProduct.name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Código:</span> {scannedProduct.barcode}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Precio:</span> ${scannedProduct.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Stock:</span> {scannedProduct.stock} unidades
                </p>
                <Badge variant={scannedProduct.stock > scannedProduct.minStock ? 'success' : 'warning'}>
                  {scannedProduct.category}
                </Badge>
              </div>
            </div>
            <div className="ml-4 space-y-2">
              <Button onClick={addProductToSale}>
                Agregar a Venta
              </Button>
              <Button
                variant="outline"
                onClick={() => setScannedProduct(null)}
                className="w-full"
              >
                Limpiar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {scannedProduct === null && manualCode && (
        <Card className="border-l-4 border-l-red-500">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-900">
              Producto No Encontrado
            </h3>
            <p className="text-sm text-red-600 mt-1">
              No se encontró ningún producto con el código: {manualCode}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setManualCode('');
                setScannedProduct(null);
              }}
              className="mt-3"
            >
              Intentar de Nuevo
            </Button>
          </div>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <h3 className="text-lg font-medium text-blue-900 mb-2">
          Instrucciones de Uso
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Ingresa manualmente el código de barras en el campo superior</li>
          <li>• Presiona Enter o el botón "Buscar" para encontrar el producto</li>
          <li>• Si el producto existe, aparecerá la información y podrás agregarlo a la venta</li>
          <li>• También puedes subir una imagen del código de barras (próximamente)</li>
          <li>• La funcionalidad de cámara en tiempo real estará disponible pronto</li>
        </ul>
      </Card>
    </div>
  );
}
