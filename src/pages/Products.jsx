import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CubeIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  ShieldCheckIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { Button, Input, Card, Badge, Modal } from '../components/ui/index.jsx';
import CategoryManagerModal from '../components/ui/CategoryManagerModal';
import { useInventory } from '../hooks/useInventory';
import ProductForm from '../components/ProductForm';
import QuickFinancialSummary from '../components/QuickFinancialSummary';

export default function Products() {
  const { isAdminMode } = useAdmin();
  const { products, categories, deleteProduct, addCategory, deleteCategory } = useInventory();
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  // Lógica para agregar categoría
  const handleAddCategory = async (name) => {
    await addCategory(name);
  };
  // Lógica para eliminar categoría
  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // Admin Functions
  const handleExportData = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `productos-nutriala-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target.result);
            console.log('Datos importados:', importedData);
            // Aquí implementarías la lógica de importación
            alert(`Se importaron ${importedData.length} productos (función de demostración)`);
          } catch {
            alert('Error al importar el archivo. Verifica que sea un JSON válido.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleAdvancedSettings = () => {
    alert('Panel de configuración avanzada (próximamente en modo administrador)');
  };

  const getStockStatus = (product) => {
    if (product.stock <= product.minStock) return 'danger';
    if (product.stock <= product.minStock * 1.5) return 'warning';
    return 'success';
  };

  const getStockLabel = (product) => {
    if (product.stock <= product.minStock) return 'Stock Crítico';
    if (product.stock <= product.minStock * 1.5) return 'Stock Bajo';
    return 'Stock Normal';
  };

  return (
    <div className="space-y-6">
      {/* Quick Financial Summary - Solo en modo admin */}
      {isAdminMode && <QuickFinancialSummary />}
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
          <p className="text-gray-600">{filteredProducts.length} productos encontrados</p>
        </div>
        {isAdminMode && (
          <div className="flex gap-2">
            <Button onClick={() => setShowForm(true)}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Nuevo Producto
            </Button>
            <Button variant="outline" onClick={() => setShowCategoryManager(true)}>
              <FunnelIcon className="h-5 w-5 mr-2" />
              Categorías
            </Button>
          </div>
        )}
      </div>
      {/* Modal de gestión de categorías (solo admin) */}
      {isAdminMode && (
        <CategoryManagerModal
          isOpen={showCategoryManager}
          onClose={() => setShowCategoryManager(false)}
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 pl-10"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              Exportar
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleImportData}
              className="flex items-center gap-2"
            >
              <DocumentArrowUpIcon className="h-4 w-4" />
              Importar
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAdvancedSettings}
              className="flex items-center gap-2"
            >
              <CogIcon className="h-4 w-4" />
              Configuración
            </Button>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="bg-gray-50 text-gray-700 text-sm font-medium uppercase tracking-wider px-6 py-3 text-left">Producto</th>
                <th className="bg-gray-50 text-gray-700 text-sm font-medium uppercase tracking-wider px-6 py-3 text-left">Código</th>
                <th className="bg-gray-50 text-gray-700 text-sm font-medium uppercase tracking-wider px-6 py-3 text-left">Categoría</th>
                <th className="bg-gray-50 text-gray-700 text-sm font-medium uppercase tracking-wider px-6 py-3 text-right">Precio</th>
                <th className="bg-gray-50 text-gray-700 text-sm font-medium uppercase tracking-wider px-6 py-3 text-right">Costo</th>
                <th className="bg-gray-50 text-gray-700 text-sm font-medium uppercase tracking-wider px-6 py-3 text-center">Stock</th>
                <th className="bg-gray-50 text-gray-700 text-sm font-medium uppercase tracking-wider px-6 py-3 text-center">Estado</th>
                {isAdminMode && (
                  <th className="bg-gray-50 text-gray-700 text-sm font-medium uppercase tracking-wider px-6 py-3 text-center">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm font-mono text-gray-900">
                      {product.barcode}
                    </span>
                  </td>
                  <td className="table-cell">
                    <Badge variant="primary">
                      {product.category}
                    </Badge>
                  </td>
                  <td className="table-cell text-right">
                    <span className="text-sm font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="table-cell text-right">
                    <span className="text-sm text-gray-500">
                      ${product.cost.toFixed(2)}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {product.stock}
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {product.minStock}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell text-center">
                    <div className="space-y-1">
                      {product.isActive ? (
                        <Badge variant="success">Activo</Badge>
                      ) : (
                        <Badge variant="danger">Inactivo</Badge>
                      )}
                      <div>
                        <Badge variant={getStockStatus(product)}>
                          {getStockLabel(product)}
                        </Badge>
                      </div>
                    </div>
                  </td>
                  {isAdminMode && (
                    <td className="table-cell text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-nutriala-600 hover:text-nutriala-700"
                          title="Editar producto"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-700"
                          title="Eliminar producto"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <CubeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No se encontraron productos</p>
                <p className="text-sm">Intenta ajustar los filtros o agrega un nuevo producto</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Product Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleFormClose}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que deseas eliminar el producto "{productToDelete?.name}"? 
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
