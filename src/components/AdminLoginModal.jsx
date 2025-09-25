import React, { useState } from 'react';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Button, Input, Modal } from './ui/index.jsx';
import { useAdmin } from '../context/AdminContext';
import toast from 'react-hot-toast';

export default function AdminLoginModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { enterAdminMode, isAuthenticating } = useAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error('Por favor ingresa la contraseña');
      return;
    }

    const result = await enterAdminMode(password);
    
    if (result.success) {
      toast.success('¡Modo administrador activado!', {
        icon: '🔐',
        duration: 3000
      });
      setPassword('');
      onClose();
    } else {
      toast.error(result.error || 'Error al autenticar');
      setPassword('');
    }
  };

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Acceso de Administrador" size="sm">
      <div className="space-y-4">
        {/* Icon and Description */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-amber-600" />
          </div>
          <p className="text-sm text-gray-600">
            Ingresa la contraseña de administrador para acceder a funciones avanzadas
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Contraseña de Administrador"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              disabled={isAuthenticating}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              disabled={isAuthenticating}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Info Notice */}
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex">
              <LockClosedIcon className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-800 font-medium">Funciones de Administrador:</p>
                <ul className="text-blue-700 mt-1 space-y-1">
                  <li>• Acceso a configuración avanzada</li>
                  <li>• Gestión de usuarios y permisos</li>
                  <li>• Exportación de datos</li>
                  <li>• Configuración de base de datos</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-600">
              <strong>Demo:</strong> Contraseña: <code className="bg-gray-200 px-1 rounded">admin123</code>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isAuthenticating}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isAuthenticating || !password.trim()}
              className="flex items-center gap-2"
            >
              {isAuthenticating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Verificando...
                </>
              ) : (
                <>
                  <LockClosedIcon className="h-4 w-4" />
                  Ingresar
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
