import { useContext } from 'react';
import FinancialContext from '../context/FinancialContext';

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};