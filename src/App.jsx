import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { InventoryProvider } from './context/InventoryContext';
import { AdminProvider } from './context/AdminContext';
import { useAdmin } from './hooks/useAdmin';
import { FinancialProvider } from './context/FinancialContext';
import { ThemeProvider } from './context/ThemeContext';
import FinancialNotifications from './components/FinancialNotifications';
import LoginScreen from './components/LoginScreen';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Scanner from './pages/Scanner';
import Reports from './pages/Reports';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import AdminExpenses from './pages/AdminExpenses';
import Salaries from './pages/Salaries';
import Debts from './pages/Debts';
import FinancialDashboard from './pages/FinancialDashboard';

// Componente que maneja la lógica de autenticación
function AppContent() {
  const { isAuthenticated, isLoading } = useAdmin();

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600 font-medium">Cargando Nutri-Ala...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar pantalla de login
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Si está autenticado, mostrar la aplicación completa
  return (
    <FinancialProvider>
      <InventoryProvider>
        <FinancialNotifications />
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="sales" element={<Sales />} />
                <Route path="scanner" element={<Scanner />} />
                <Route path="reports" element={<Reports />} />
                <Route path="customers" element={<Customers />} />
                <Route path="settings" element={<Settings />} />
                <Route path="admin-expenses" element={<AdminExpenses />} />
                <Route path="salaries" element={<Salaries />} />
                <Route path="debts" element={<Debts />} />
                <Route path="financial-dashboard" element={<FinancialDashboard />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </InventoryProvider>
    </FinancialProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#22c55e',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </AdminProvider>
    </ThemeProvider>
  );
}

export default App;
