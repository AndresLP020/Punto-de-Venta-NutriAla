import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAdmin } from '../context/AdminContext';

export default function AdminModeIndicator() {
  const { isAdminMode } = useAdmin();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isAdminMode) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isAdminMode]);

  if (!isAdminMode || !isVisible) return null;

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-12 py-8 rounded-3xl shadow-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-700 border-8 border-amber-300 animate-pulse ring-4 ring-yellow-200/60 w-[95vw] max-w-3xl">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <span className="inline-flex items-center justify-center bg-white bg-opacity-30 rounded-full p-6 shadow-2xl border-4 border-amber-200">
          <ShieldCheckIcon className="h-16 w-16 text-yellow-700 drop-shadow-xl" />
        </span>
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-3xl md:text-4xl font-extrabold text-white tracking-wider drop-shadow-lg mb-2">
            ¡Modo Administrador Activado!
          </span>
          <span className="text-lg md:text-xl text-amber-100 font-semibold mb-2 drop-shadow">
            Tienes acceso total a todas las funciones avanzadas del sistema NutriAla.
          </span>
          <span className="text-base text-white/90 font-medium mt-1">
            Recuerda usar tus privilegios con responsabilidad.
          </span>
        </div>
        <span className="ml-0 md:ml-4 animate-bounce text-5xl md:text-6xl select-none drop-shadow-xl">🔐</span>
      </div>
      <div className="mt-6 flex justify-center">
        <div className="px-6 py-2 rounded-full bg-white/20 border border-amber-200 text-yellow-900 font-bold text-lg shadow backdrop-blur-sm animate-pulse">
          Acceso de administrador temporal habilitado
        </div>
      </div>
    </div>
  );
}
