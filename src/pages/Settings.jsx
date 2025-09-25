
import React from 'react';
import { Card, Button } from '../components/ui/index.jsx';
import { useTheme } from '../context/ThemeContext';



export default function Settings() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Configuración</h2>
        <p className="text-gray-600 dark:text-gray-300">Ajusta las configuraciones del sistema</p>
      </div>

      <Card>
        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-lg font-medium">Configuración del Sistema</p>
            <p className="text-sm mt-2">Esta funcionalidad estará disponible próximamente</p>
            <p className="text-sm text-gray-400 mt-4">
              Podrás configurar impuestos, métodos de pago, usuarios, y más opciones del sistema
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col items-center gap-6 py-8">
          <div>
            <span className="font-semibold text-lg dark:text-gray-100">Tema visual</span>
            <div className="flex gap-4 mt-4">
              <Button
                variant={theme === 'light' ? 'primary' : 'outline'}
                onClick={() => setTheme('light')}
              >
                Claro
              </Button>
              <Button
                variant={theme === 'dark' ? 'primary' : 'outline'}
                onClick={() => setTheme('dark')}
              >
                Oscuro
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Elige el modo que prefieras para proteger tu vista.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
