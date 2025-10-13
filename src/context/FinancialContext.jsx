import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import api, { getSales } from '../utils/api';
import toast from 'react-hot-toast';

const FinancialContext = createContext();

const initialState = {
  // Datos de ventas reales
  totalSales: 0,
  totalRevenue: 0,
  totalCostOfGoods: 0,
  totalGrossProfit: 0,
  
  // Ingresos por período
  dailyRevenue: 0,
  weeklyRevenue: 0,
  monthlyRevenue: 0,
  
  // Gastos y empleados
  employees: [],
  adminExpenses: [],
  totalSalaries: 0,
  totalAdminExpenses: 0,
  
  // Ganancias netas
  dailyNetProfit: 0,
  weeklyNetProfit: 0,
  monthlyNetProfit: 0,
  availableCash: 0,
  
  // Estado
  loading: false,
  error: null
};

function financialReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_FINANCIAL_DATA':
      return { ...state, ...action.payload, loading: false };
    
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.payload };
    
    case 'ADD_EMPLOYEE':
      return { ...state, employees: [...state.employees, action.payload] };
    
    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map(emp => 
          emp.id === action.payload.id ? action.payload : emp
        )
      };
    
    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter(emp => emp.id !== action.payload)
      };
    
    case 'SET_ADMIN_EXPENSES':
      return { ...state, adminExpenses: action.payload };
    
    case 'ADD_ADMIN_EXPENSE':
      return { ...state, adminExpenses: [...state.adminExpenses, action.payload] };
    
    case 'UPDATE_ADMIN_EXPENSE':
      return {
        ...state,
        adminExpenses: state.adminExpenses.map(exp => 
          exp.id === action.payload.id ? action.payload : exp
        )
      };
    
    case 'DELETE_ADMIN_EXPENSE':
      return {
        ...state,
        adminExpenses: state.adminExpenses.filter(exp => exp.id !== action.payload)
      };
    
    default:
      return state;
  }
}

export function FinancialProvider({ children }) {
  const [state, dispatch] = useReducer(financialReducer, initialState);

  // Función para calcular métricas financieras (misma lógica que Reports)
  const calculateFinancialMetrics = useCallback(async (sales, employees, adminExpenses) => {
    try {
      console.log('💰 FinancialContext: Calculando métricas con', sales.length, 'ventas');
      
      // Calcular ingresos y costos (misma lógica que Reports)
      let totalRevenue = 0;
      let totalCostOfGoods = 0;
      const totalSales = sales.length;
      
      // Mapear los costos reales de los productos (mismos que Reports)
      const productCosts = {
        '68ec1cc29e7dcfe25f192b06': 100, // Chetos Flamin hot
        '68ec1c849e7dcfe25f192b03': 27,  // Paleta Bubalo  
        '68ec1c409e7dcfe25f192b00': 200, // Danone Mix
        '68ec1bd49e7dcfe25f192afd': 20   // Pachicleta
      };
      
      sales.forEach((sale) => {
        totalRevenue += sale.total || 0;
        
        if (sale.items && Array.isArray(sale.items)) {
          sale.items.forEach((item) => {
            const productId = item.product?._id || '';
            const quantity = parseInt(item.quantity) || 0;
            const unitCost = productCosts[productId] || 0;
            const itemTotalCost = unitCost * quantity;
            totalCostOfGoods += itemTotalCost;
          });
        }
      });
      
      // Calcular ganancias
      const totalGrossProfit = totalRevenue - totalCostOfGoods;
      
      // Calcular gastos administrativos y sueldos REALMENTE PAGADOS
      // IMPORTANTE: Solo se cuentan gastos que ya se hayan registrado en la base de datos
      // Los empleados pueden existir sin que se haya pagado su sueldo aún
      const totalAdminExpenses = adminExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
      
      // Los salarios solo se cuentan cuando se han pagado realmente (están en adminExpenses con categoría "Sueldos")
      const totalSalariesPaid = adminExpenses
        .filter(expense => expense.category === 'Sueldos')
        .reduce((sum, expense) => sum + (expense.amount || 0), 0);
      
      console.log('💰 Métricas: Gastos admin totales:', totalAdminExpenses, 'Salarios pagados:', totalSalariesPaid);
      
      // Gastos operacionales = Solo gastos administrativos reales (incluye sueldos pagados)
      const totalOperationalExpenses = totalAdminExpenses;
      
      // Ganancia neta = Ganancia bruta - Gastos operacionales
      const netProfit = totalGrossProfit - totalOperationalExpenses;
      
      // Calcular métricas por período
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Filtrar ventas por período
      const dailySales = sales.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate >= today;
      });
      
      const weeklySales = sales.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate >= weekStart;
      });
      
      const monthlySales = sales.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate >= monthStart;
      });
      
      // Calcular ingresos por período
      const dailyRevenue = dailySales.reduce((sum, sale) => sum + (sale.total || 0), 0);
      const weeklyRevenue = weeklySales.reduce((sum, sale) => sum + (sale.total || 0), 0);
      const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + (sale.total || 0), 0);
      
      // Calcular costos por período
      const calculatePeriodCosts = (periodSales) => {
        let periodCosts = 0;
        periodSales.forEach(sale => {
          if (sale.items && Array.isArray(sale.items)) {
            sale.items.forEach(item => {
              const productId = item.product?._id || '';
              const quantity = parseInt(item.quantity) || 0;
              const unitCost = productCosts[productId] || 0;
              periodCosts += unitCost * quantity;
            });
          }
        });
        return periodCosts;
      };
      
      const dailyCosts = calculatePeriodCosts(dailySales);
      const weeklyCosts = calculatePeriodCosts(weeklySales);
      const monthlyCosts = calculatePeriodCosts(monthlySales);
      
      // Calcular ganancias netas por período
      const dailyNetProfit = dailyRevenue - dailyCosts - (totalOperationalExpenses / 30); // Gastos diarios aprox
      const weeklyNetProfit = weeklyRevenue - weeklyCosts - (totalSalariesPaid / 4); // Gastos semanales aprox
      const monthlyNetProfit = monthlyRevenue - monthlyCosts - totalAdminExpenses; // Gastos mensuales
      
      // Disponible en efectivo (ganancia neta total acumulada)
      const availableCash = Math.max(0, netProfit);
      
      console.log('💰 FinancialContext: Métricas calculadas:', {
        totalSales,
        totalRevenue: totalRevenue.toFixed(2),
        totalCostOfGoods: totalCostOfGoods.toFixed(2),
        totalGrossProfit: totalGrossProfit.toFixed(2),
        totalOperationalExpenses: totalOperationalExpenses.toFixed(2),
        netProfit: netProfit.toFixed(2),
        availableCash: availableCash.toFixed(2)
      });
      
      // Dispatch de todos los datos calculados
      dispatch({
        type: 'SET_FINANCIAL_DATA',
        payload: {
          totalSales,
          totalRevenue,
          totalCostOfGoods,
          totalGrossProfit,
          dailyRevenue,
          weeklyRevenue,
          monthlyRevenue,
          totalSalaries: totalSalariesPaid, // Solo salarios realmente pagados
          totalAdminExpenses,
          dailyNetProfit,
          weeklyNetProfit,
          monthlyNetProfit,
          availableCash
        }
      });
      
    } catch (error) {
      console.error('Error calculating financial metrics:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al calcular métricas financieras' });
    }
  }, []);

  // Cargar datos financieros
  const loadFinancialData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Cargar datos desde API MongoDB únicamente
      let employees = [];
      let adminExpenses = [];
      let sales = [];
      
      try {
        console.log('💰 FinancialContext: Cargando datos desde API...');
        
        // Cargar ventas desde API MongoDB
        const salesResult = await getSales();
        console.log('💰 FinancialContext: Resultado de API getSales:', salesResult);
        
        // Asegurar que tenemos un array de ventas
        sales = Array.isArray(salesResult) ? salesResult : [];
        console.log('💰 FinancialContext: Ventas procesadas:', sales.length);
        
        if (sales.length > 0) {
          console.log('💰 FinancialContext: Primera venta ejemplo:', sales[0]);
        }
        
        // Cargar transacciones financieras desde API
        try {
          const transactionsResult = await api.financial.getTransactions({ limit: 1000 });
          console.log('💰 FinancialContext: Transacciones desde API:', transactionsResult);
          
          const transactions = transactionsResult?.transactions || [];
          
          // Filtrar gastos administrativos (tipo 'gasto')
          adminExpenses = transactions
            .filter(t => t.type === 'gasto')
            .map(t => ({
              id: t._id,
              description: t.description,
              amount: Math.abs(t.amount),
              category: t.category || 'Gastos de la empresa',
              date: t.createdAt,
              createdAt: t.createdAt
            }));
            
          console.log('💰 FinancialContext: Gastos admin procesados:', adminExpenses.length);
          
          // NOTA: Los empleados se gestionan separadamente de las transacciones de salario
          // Los empleados existen independientemente de los pagos realizados
          // Por ahora usamos localStorage hasta tener API de empleados
          try {
            const storedEmployees = localStorage.getItem('nutriala_employees');
            employees = storedEmployees ? JSON.parse(storedEmployees) : [];
            console.log('💰 FinancialContext: Empleados cargados desde localStorage:', employees.length);
          } catch (localStorageError) {
            console.warn('Error cargando empleados desde localStorage:', localStorageError);
            employees = [];
          }
          
        } catch (transactionError) {
          console.warn('💰 FinancialContext: Error cargando transacciones financieras:', transactionError);
          // Si hay error cargando transacciones (ej: no autenticado), usar arrays vacíos
          adminExpenses = [];
          employees = [];
        }
        
      } catch (apiError) {
        console.error('💰 FinancialContext: Error en API:', apiError);
        console.log('💰 FinancialContext: Detalles del error:', {
          message: apiError.message,
          status: apiError.status,
          data: apiError.data
        });
        // Si hay error en la API, usar arrays vacíos
        sales = [];
        employees = [];
        adminExpenses = [];
      }

      dispatch({ type: 'SET_EMPLOYEES', payload: employees });
      dispatch({ type: 'SET_ADMIN_EXPENSES', payload: adminExpenses });
      
      // Calcular métricas financieras usando datos de la API
      await calculateFinancialMetrics(sales, employees, adminExpenses);
      
    } catch (error) {
      console.error('Error loading financial data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar datos financieros' });
    }
  }, [calculateFinancialMetrics]);

  // Cargar datos iniciales
  useEffect(() => {
    console.log('💰 FinancialContext: Cargando datos iniciales...');
    loadFinancialData();
  }, [loadFinancialData]);

  // Escuchar eventos de ventas completadas
  useEffect(() => {
    const handleSaleCompleted = () => {
      console.log('💰 FinancialContext: Venta completada, recargando datos...');
      loadFinancialData();
    };

    window.addEventListener('saleCompleted', handleSaleCompleted);
    
    return () => {
      window.removeEventListener('saleCompleted', handleSaleCompleted);
    };
  }, [loadFinancialData]);

  // Recalcular métricas cuando cambien empleados o gastos administrativos
  useEffect(() => {
    const recalculateMetrics = async () => {
      try {
        // Obtener ventas actuales
        const salesResult = await getSales();
        const sales = Array.isArray(salesResult) ? salesResult : [];
        
        // Calcular métricas con datos actuales
        await calculateFinancialMetrics(sales, state.employees, state.adminExpenses);
      } catch (error) {
        console.error('Error recalculando métricas:', error);
      }
    };

    // Solo recalcular si hay empleados o gastos (para evitar loop infinito)
    if (state.employees.length > 0 || state.adminExpenses.length > 0) {
      recalculateMetrics();
    }
  }, [state.employees, state.adminExpenses, calculateFinancialMetrics]);

  // Funciones para manejar empleados
  const addEmployee = async (employeeData) => {
    try {
      console.log('💰 FinancialContext: Agregando empleado:', employeeData);
      
      // IMPORTANTE: Solo agregar el empleado, NO crear transacción de salario
      // La transacción de salario se crea cuando se procesa la nómina manualmente
      
      // Convertir a formato de empleado (sin crear transacción)
      const newEmployee = {
        id: Date.now().toString(),
        name: employeeData.name,
        position: employeeData.position || 'Empleado',
        weeklySalary: employeeData.weeklySalary,
        createdAt: new Date(),
        lastPaymentDate: null, // No se ha pagado aún
        nextPaymentDate: getNextPaymentDate(),
        totalPaid: 0 // Inicia en 0
      };
      
      // Agregar al estado local
      dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployee });
      
      // Guardar en localStorage (temporal hasta tener API de empleados)
      try {
        const currentEmployees = JSON.parse(localStorage.getItem('nutriala_employees') || '[]');
        const updatedEmployees = [...currentEmployees, newEmployee];
        localStorage.setItem('nutriala_employees', JSON.stringify(updatedEmployees));
        console.log('💾 Empleado guardado en localStorage:', newEmployee.name);
      } catch (storageError) {
        console.error('Error guardando empleado en localStorage:', storageError);
      }
      
      toast.success('Empleado agregado exitosamente');
      
      return newEmployee;
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Error al agregar empleado');
      throw error;
    }
  };

  const updateEmployee = async (id, employeeData) => {
    try {
      console.log('💰 FinancialContext: Actualizando empleado:', id, employeeData);
      
      const updatedEmployee = { ...employeeData, id, updatedAt: new Date() };
      
      // Actualizar en estado
      dispatch({ type: 'UPDATE_EMPLOYEE', payload: updatedEmployee });
      
      // Actualizar en localStorage
      try {
        const currentEmployees = JSON.parse(localStorage.getItem('nutriala_employees') || '[]');
        const updatedEmployees = currentEmployees.map(emp => 
          emp.id === id ? updatedEmployee : emp
        );
        localStorage.setItem('nutriala_employees', JSON.stringify(updatedEmployees));
        console.log('💾 Empleado actualizado en localStorage:', updatedEmployee.name);
      } catch (storageError) {
        console.error('Error actualizando empleado en localStorage:', storageError);
      }
      
      toast.success('Empleado actualizado exitosamente');
      return updatedEmployee;
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Error al actualizar empleado');
      throw error;
    }
  };

  const deleteEmployee = async (id) => {
    try {
      console.log('💰 FinancialContext: Eliminando empleado:', id);
      
      // Eliminar del estado
      dispatch({ type: 'DELETE_EMPLOYEE', payload: id });
      
      // Eliminar de localStorage
      try {
        const currentEmployees = JSON.parse(localStorage.getItem('nutriala_employees') || '[]');
        const updatedEmployees = currentEmployees.filter(emp => emp.id !== id);
        localStorage.setItem('nutriala_employees', JSON.stringify(updatedEmployees));
        console.log('💾 Empleado eliminado de localStorage, ID:', id);
      } catch (storageError) {
        console.error('Error eliminando empleado de localStorage:', storageError);
      }
      
      toast.success('Empleado eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Error al eliminar empleado');
      throw error;
    }
  };

  // Funciones para manejar gastos administrativos
  const addAdminExpense = async (expenseData) => {
    try {
      console.log('💰 FinancialContext: Agregando gasto admin:', expenseData);
      
      // Verificar si hay token de autenticación
      const token = localStorage.getItem('authToken');
      console.log('💰 FinancialContext: Token disponible:', !!token);
      
      // Crear transacción financiera en la base de datos
      const transactionData = {
        type: 'gasto',
        category: expenseData.category || 'Gastos de la empresa',
        amount: -Math.abs(expenseData.amount), // Gastos son negativos
        description: expenseData.description,
        date: expenseData.date || new Date()
      };
      
      console.log('💰 FinancialContext: Enviando transacción:', transactionData);
      
      const newTransaction = await api.financial.createTransaction(transactionData);
      console.log('💰 FinancialContext: Transacción creada:', newTransaction);
      
      // Convertir a formato de gasto administrativo
      const newExpense = {
        id: newTransaction._id,
        description: newTransaction.description,
        amount: Math.abs(newTransaction.amount),
        category: newTransaction.category,
        date: newTransaction.createdAt,
        createdAt: newTransaction.createdAt
      };
      
      // Agregar al estado local
      dispatch({ type: 'ADD_ADMIN_EXPENSE', payload: newExpense });
      
      toast.success('Gasto administrativo agregado exitosamente');
      
      // Recargar datos para mantener sincronización
      await loadFinancialData();
      
      return newExpense;
    } catch (error) {
      console.error('Error adding admin expense:', error);
      toast.error('Error al agregar gasto administrativo');
      throw error;
    }
  };

  const updateAdminExpense = async (id, expenseData) => {
    try {
      console.log('💰 FinancialContext: Actualizando gasto admin:', id, expenseData);
      
      // Por ahora, eliminar el anterior y crear uno nuevo
      // TODO: Implementar endpoint PUT en el servidor para actualizar transacciones
      toast.warning('Funcionalidad de edición no disponible. Elimina y crea un nuevo gasto.');
      
      return null;
    } catch (error) {
      console.error('Error updating admin expense:', error);
      toast.error('Error al actualizar gasto administrativo');
      throw error;
    }
  };

  const deleteAdminExpense = async (id) => {
    try {
      console.log('💰 FinancialContext: Eliminando gasto admin:', id);
      
      // TODO: Implementar endpoint DELETE en el servidor para eliminar transacciones
      // Por ahora, solo eliminar del estado local
      dispatch({ type: 'DELETE_ADMIN_EXPENSE', payload: id });
      
      toast.warning('Gasto eliminado localmente. Nota: No se eliminó de la base de datos.');
      
      // Recargar datos para mantener sincronización
      await loadFinancialData();
      
    } catch (error) {
      console.error('Error deleting admin expense:', error);
      toast.error('Error al eliminar gasto administrativo');
      throw error;
    }
  };

  // Procesar nómina
  const processPayroll = async () => {
    try {
      const now = new Date();
      const totalPayroll = state.employees.reduce((sum, emp) => sum + (emp.weeklySalary || 0), 0);
      
      if (state.availableCash < totalPayroll) {
        toast.error('Efectivo insuficiente para pagar la nómina');
        return { success: false, error: 'Efectivo insuficiente' };
      }

      // Crear registro de pago de nómina como gasto administrativo
      const payrollExpense = {
        description: `Pago de nómina - ${now.toLocaleDateString('es-ES')}`,
        amount: totalPayroll,
        category: 'Sueldos',
        date: now
      };

      await addAdminExpense(payrollExpense);

      // Actualizar fechas de pago de empleados
      for (const employee of state.employees) {
        await updateEmployee(employee.id, {
          ...employee,
          lastPaymentDate: now,
          nextPaymentDate: getNextPaymentDate(),
          totalPaid: (employee.totalPaid || 0) + (employee.weeklySalary || 0)
        });
      }

      toast.success(`Nómina procesada: $${totalPayroll.toFixed(2)}`);
      return { success: true, amount: totalPayroll };
    } catch (error) {
      console.error('Error processing payroll:', error);
      toast.error('Error al procesar nómina');
      return { success: false, error: error.message };
    }
  };

  const getNextPaymentDate = () => {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    return nextWeek;
  };

  // Verificar alertas financieras
  const checkFinancialAlerts = () => {
    const alerts = [];

    // Alerta de efectivo bajo
    if (state.availableCash < 1000) {
      alerts.push({
        type: 'warning',
        message: 'Efectivo disponible bajo',
        description: `Solo tienes $${state.availableCash.toFixed(2)} disponible`
      });
    }

    // Alerta de ganancias negativas
    if (state.monthlyNetProfit < 0) {
      alerts.push({
        type: 'error',
        message: 'Ganancias negativas este mes',
        description: `Pérdida de $${Math.abs(state.monthlyNetProfit).toFixed(2)}`
      });
    }

    return alerts;
  };

  const value = {
    ...state,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addAdminExpense,
    updateAdminExpense,
    deleteAdminExpense,
    processPayroll,
    checkFinancialAlerts,
    loadFinancialData
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
}

export { FinancialContext };
export default FinancialContext;