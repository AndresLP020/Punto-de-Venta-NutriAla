import React from 'react';
import { Card } from '../components/ui/index.jsx';

export default function Customers() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
        <p className="text-gray-600">Administra la información de tus clientes</p>
      </div>

      <Card>
        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <p className="text-lg font-medium">Gestión de Clientes</p>
            <p className="text-sm mt-2">Esta funcionalidad estará disponible próximamente</p>
            <p className="text-sm text-gray-400 mt-4">
              Podrás registrar clientes, ver su historial de compras, y gestionar programas de lealtad
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
