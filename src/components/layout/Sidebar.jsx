import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  CogIcon,
  QrCodeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useAdmin } from '../../hooks/useAdmin';

export default function Sidebar() {
  const { isAdminMode } = useAdmin();
  
  const baseNavigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, isAdmin: false },
    { name: 'Productos', href: '/products', icon: CubeIcon, isAdmin: false },
    { name: 'Ventas', href: '/sales', icon: ShoppingCartIcon, isAdmin: false },
    { name: 'Escáner', href: '/scanner', icon: QrCodeIcon, isAdmin: false },
    { name: 'Configuración', href: '/settings', icon: CogIcon, isAdmin: false },
  ];

  const adminNavigation = [
    { name: 'Reportes', href: '/reports', icon: ChartBarIcon, isAdmin: true },
    { name: 'Gastos Admin', href: '/admin-expenses', icon: CurrencyDollarIcon, isAdmin: true },
    { name: 'Sueldos', href: '/salaries', icon: CurrencyDollarIcon, isAdmin: true },
    { name: 'Deudas', href: '/debts', icon: QrCodeIcon, isAdmin: true },
  ];

  // Combinar navegación base con elementos de admin si está en modo administrador
  const navigation = isAdminMode 
    ? [...baseNavigation.slice(0, 4), ...adminNavigation, ...baseNavigation.slice(4)]
    : baseNavigation;

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">NutriAla</h1>
              <p className="text-sm text-gray-500">Sistema de Inventario</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 space-y-1 pb-4">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => {
                  const baseClasses = "flex items-center px-4 py-3 transition-colors duration-200 rounded-md mx-2";
                  
                  if (item.isAdmin) {
                    // Estilos para elementos de administrador
                    return `${baseClasses} text-amber-700 hover:bg-amber-50 hover:text-amber-800 border border-amber-200 bg-amber-25 ${
                      isActive ? 'bg-amber-100 text-amber-800 font-medium border-amber-300' : ''
                    }`;
                  } else {
                    // Estilos para elementos normales
                    return `${baseClasses} text-gray-700 hover:bg-green-50 hover:text-green-700 ${
                      isActive ? 'bg-green-100 text-green-700 font-medium' : ''
                    }`;
                  }
                }}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
                {item.isAdmin && (
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Admin
                    </span>
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-medium">U</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Usuario</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
