import React, { useState } from 'react';
import { Modal, Input, Button } from './index';

/**
 * Modal para gestionar categorías de productos (agregar/eliminar).
 * Solo visible para administradores.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {Array} props.categories
 * @param {function} props.onAddCategory
 * @param {function} props.onDeleteCategory
 */
export default function CategoryManagerModal({ isOpen, onClose, categories, onAddCategory, onDeleteCategory }) {
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const name = newCategory.trim();
    if (!name) {
      setError('El nombre es obligatorio');
      return;
    }
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
      setError('La categoría ya existe');
      return;
    }
    onAddCategory(name);
    setNewCategory('');
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gestionar Categorías" size="md">
      <div className="space-y-4">
        <div>
          <Input
            label="Nueva categoría"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            error={error}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            autoFocus
          />
          <Button className="mt-2 w-full" onClick={handleAdd}>
            Agregar Categoría
          </Button>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-gray-700">Categorías existentes</h4>
          <ul className="space-y-2">
            {categories.map(cat => (
              <li key={cat.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                <span>{cat.name}</span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDeleteCategory(cat.id)}
                  disabled={cat.protected}
                  title={cat.protected ? 'No se puede eliminar esta categoría' : 'Eliminar'}
                >
                  Eliminar
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
