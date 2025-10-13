import toast from 'react-hot-toast';

export const FinancialNotificationUtils = {
  notifyPaymentSuccess: (amount, description) => {
    toast.success(`💰 Pago procesado: ${description} - $${amount.toFixed(2)}`, {
      duration: 4000,
      icon: '✅'
    });
  },

  notifyExpenseAdded: (amount, description, isHighAmount = false) => {
    if (isHighAmount) {
      toast.warning(`⚠️ Gasto importante: ${description} - $${amount.toFixed(2)}`, {
        duration: 5000
      });
    } else {
      toast.success(`📝 Gasto registrado: ${description} - $${amount.toFixed(2)}`, {
        duration: 3000
      });
    }
  },

  notifyInsufficientFunds: (required, available) => {
    toast.error(`❌ Fondos insuficientes. Necesario: $${required.toFixed(2)}, Disponible: $${available.toFixed(2)}`, {
      duration: 6000
    });
  },

  notifyPayrollAlert: (daysUntilPayroll, amount) => {
    if (daysUntilPayroll <= 2) {
      toast.warning(`⏰ Nómina en ${daysUntilPayroll} días - $${amount.toFixed(2)}`, {
        duration: 5000
      });
    }
  },

  notifyMonthlyTarget: (current, target) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) {
      toast.success(`🎯 ¡Meta mensual alcanzada! ${percentage.toFixed(1)}%`, {
        duration: 5000
      });
    } else if (percentage >= 80) {
      toast.success(`📈 Cerca de la meta: ${percentage.toFixed(1)}%`, {
        duration: 3000
      });
    }
  },

  notifyLowCash: (available, required) => {
    toast.warning(`⚠️ Efectivo bajo: $${available.toFixed(2)} (Req: $${required.toFixed(2)})`, {
      duration: 5000
    });
  },

  notifyDailySummary: (revenue, expenses, netProfit) => {
    const message = `📊 Resumen del día:
    • Ingresos: $${revenue.toFixed(2)}
    • Gastos: $${expenses.toFixed(2)}
    • Ganancia neta: $${netProfit.toFixed(2)}`;

    if (netProfit > 0) {
      toast.success(message, { duration: 6000 });
    } else {
      toast.error(message, { duration: 6000 });
    }
  }
};