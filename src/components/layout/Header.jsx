import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  BellIcon, 
  Cog6ToothIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useInventory } from '../../hooks/useInventory';
import { useAdmin } from '../../context/AdminContext';
import AdminLoginModal from '../AdminLoginModal';
import { LowStockModal, SalesHistoryModal } from '../ui';

const pageNames = {
  '/': 'Dashboard',
  '/products': 'Gestión de Productos',
  '/sales': 'Punto de Venta',
  '/scanner': 'Escáner de Códigos',
  '/reports': 'Reportes y Analytics',
  '/customers': 'Gestión de Clientes',
  '/settings': 'Configuración'
};


export default function Header() {
  const location = useLocation();
  const { products } = useInventory();
  const { isAdminMode, exitAdminMode } = useAdmin();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showSalesHistory, setShowSalesHistory] = useState(false);

  // Simulación de ventas diarias (reemplaza esto con tus datos reales de ventas)
  const salesByDay = [
    {
      day: '22/7/2025',
      revenue: 116,
      products: [
        { name: 'Golden Flakes con Arándanos y Almendras', qty: 2, price: 47, time: '09:15' },
        { name: 'Barras Proteicas Chocolate', qty: 1, price: 22, time: '12:40' }
      ]
    },
    {
      day: '21/7/2025',
      revenue: 200,
      products: [
        { name: 'Proteína Whey Vainilla', qty: 1, price: 180, time: '10:05' },
        { name: 'Chiles Chipotles Adobados', qty: 2, price: 10, time: '16:30' }
      ]
    }
  ];

  const currentPageName = pageNames[location.pathname] || 'NutriAla';

  // Productos con stock bajo
  const lowStockList = products.filter(product => 
    product.stock <= product.minStock && product.isActive
  );
  const lowStockCount = lowStockList.length;
  const [showLowStockModal, setShowLowStockModal] = useState(false);

  const handleAdminLogin = () => {
    setShowAdminModal(true);
  };

  const handleAdminLogout = () => {
    exitAdminMode();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {currentPageName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="flex items-center space-x-4">

          {/* Botón de historial de ventas diarias */}
          <button
            className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setShowSalesHistory(true)}
            title="Ver historial de ventas diarias"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span>Historial de Ventas</span>
          </button>
      {/* Modal de historial de ventas diarias */}
      <SalesHistoryModal
        isOpen={showSalesHistory}
        onClose={() => setShowSalesHistory(false)}
        salesByDay={salesByDay}
      />

          {/* Botón de productos con stock bajo */}
          {lowStockCount > 0 && (
            <button
              className="flex items-center space-x-2 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onClick={() => setShowLowStockModal(true)}
              title="Ver productos con stock bajo"
            >
              <BellIcon className="h-4 w-4" />
              <span>{lowStockCount} productos con stock bajo</span>
            </button>
          )}

          {/* Admin Mode Button */}
          {!isAdminMode ? (
            <button 
              onClick={handleAdminLogin}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Modo Administrador"
            >
              <ShieldCheckIcon className="h-5 w-5" />
            </button>
          ) : (
            <button 
              onClick={handleAdminLogout}
              className="p-2 text-amber-600 hover:text-amber-700 transition-colors"
              title="Salir del Modo Administrador"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          )}

          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Cog6ToothIcon className="h-5 w-5" />
          </button>

          {/* User Info */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de productos con stock bajo */}
      <LowStockModal
        isOpen={showLowStockModal}
        onClose={() => setShowLowStockModal(false)}
        products={lowStockList}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal 
        isOpen={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
      />
    </header>
  );
}
