import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { InventoryProvider } from './context/InventoryContext';
import { AdminProvider } from './context/AdminContext';
import Layout from './components/layout/Layout';
import { ThemeProvider } from './context/ThemeContext';
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

function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <InventoryProvider>
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
                </Route>
              </Routes>
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
            </div>
          </Router>
        </InventoryProvider>
      </AdminProvider>
    </ThemeProvider>
  );
}

export default App;
