import React, { createContext, useReducer, useEffect } from 'react';
import api, { getProducts, getSales } from '../utils/api';
import toast from 'react-hot-toast';

export const InventoryContext = createContext();

const initialState = {
  products: [],
  sales: [],
  categories: [],
  suppliers: [],
  currentSale: [],
  settings: {},
  loading: false,
  error: null
};

function inventoryReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false };
    
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => 
          p.id === action.payload.id ? action.payload : p
        )
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'SET_SUPPLIERS':
      return { ...state, suppliers: action.payload };
    
    case 'SET_SALES':
      return { ...state, sales: action.payload };
    
    case 'ADD_SALE':
      return { ...state, sales: [action.payload, ...state.sales] };
    
    case 'SET_CURRENT_SALE':
      return { ...state, currentSale: action.payload };
    
    case 'ADD_TO_CURRENT_SALE': {
      const existingItem = state.currentSale.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        return {
          ...state,
          currentSale: state.currentSale.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return { ...state, currentSale: [...state.currentSale, action.payload] };
    }
    
    case 'REMOVE_FROM_CURRENT_SALE':
      return {
        ...state,
        currentSale: state.currentSale.filter(item => item.productId !== action.payload)
      };
    
    case 'UPDATE_CURRENT_SALE_ITEM':
      return {
        ...state,
        currentSale: state.currentSale.map(item =>
          item.productId === action.payload.productId ? action.payload : item
        )
      };
    
    case 'CLEAR_CURRENT_SALE':
      return { ...state, currentSale: [] };
    
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    
    default:
      return state;
  }
}

export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Cargar SOLO desde API MongoDB
      let products = [];
      let categories = [];
      let suppliers = [];
      let sales = [];
      let settings = {};
      
      try {
        // Verificar si hay token de autenticación
        let token = localStorage.getItem('authToken');
        
        if (!token) {
          console.log('No hay token, intentando login automático...');
          // Login automático con credenciales de admin
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: 'admin@nutri-ala.com',
              password: 'admin123'
            })
          });
          
          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            token = loginData.token;
            localStorage.setItem('authToken', token);
            console.log('Login automático exitoso');
          } else {
            throw new Error('Error en login automático');
          }
        }
        
        // Cargar SOLO desde API MongoDB
        console.log('🔄 Cargando datos desde MongoDB API...');
        const [productsResult, salesResult] = await Promise.all([
          getProducts(),
          getSales()
        ]);
        
        console.log('📦 Respuesta productos:', productsResult);
        console.log('💰 Respuesta ventas:', salesResult);
        
        // El API devuelve objetos con formato {products: [...], totalPages: ...}
        products = Array.isArray(productsResult?.products) ? productsResult.products : 
                   Array.isArray(productsResult) ? productsResult : [];
        sales = Array.isArray(salesResult) ? salesResult : [];
        
        // NO usar datos locales - solo API
        categories = [
          { id: 1, name: 'Proteínas' },
          { id: 2, name: 'Vitaminas' },
          { id: 3, name: 'Suplementos' },
          { id: 4, name: 'Bebidas' },
          { id: 5, name: 'Accesorios' }
        ];
        suppliers = [];  // Se podrían cargar desde API si hubiera endpoint
        settings = { taxRate: 16 }; // Configuración básica hardcodeada
        
        console.log('✅ Datos cargados desde MongoDB:', { 
          products: products.length, 
          sales: sales.length
        });
      } catch (apiError) {
        console.error('❌ API MongoDB no disponible:', apiError);
        throw new Error('No se puede conectar a la base de datos. Verifique que el servidor esté funcionando.');
      }

      dispatch({ type: 'SET_PRODUCTS', payload: products });
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
      dispatch({ type: 'SET_SUPPLIERS', payload: suppliers });
      dispatch({ type: 'SET_SALES', payload: sales });
      dispatch({ type: 'SET_SETTINGS', payload: settings });
    } catch (error) {
      console.error('Error loading data:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Error al cargar los datos: ' + error.message);
    }
  };

  // Product operations - Solo API
  // Función para limpiar COMPLETAMENTE todos los datos locales
  const clearAllLocalData = () => {
    console.log('🧹 Limpiando TODOS los datos locales...');
    
    // Limpiar localStorage completamente
    localStorage.clear();
    
    // Limpiar sessionStorage
    sessionStorage.clear();
    
    // Resetear state a valores iniciales
    dispatch({ type: 'SET_PRODUCTS', payload: [] });
    dispatch({ type: 'SET_SALES', payload: [] });
    dispatch({ type: 'CLEAR_CURRENT_SALE' });
    
    console.log('✅ Todos los datos locales eliminados');
  };

  const addProduct = async (productData) => {
    try {
      console.log('📦 Agregando producto via API:', productData);
      const newProduct = await api.products.create(productData);
      
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      toast.success('Producto agregado exitosamente');
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error al agregar el producto: ' + error.message);
      throw error;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      console.log('📦 Actualizando producto via API:', id, updates);
      const updatedProduct = await api.products.update(id, updates);
      
      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
      toast.success('Producto actualizado exitosamente');
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar el producto: ' + error.message);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      console.log('📦 Eliminando producto via API:', id);
      await api.products.delete(id);
      
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
      toast.success('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto: ' + error.message);
      throw error;
    }
  };

  const findProductByBarcode = async (barcode) => {
    try {
      console.log('📦 Buscando producto por código de barras via API:', barcode);
      const product = await api.products.getByBarcode(barcode);
      return product;
    } catch (error) {
      console.error('Error finding product by barcode:', error);
      return null;
    }
  };

  // Sale operations
  const addToCurrentSale = (product, quantity = 1) => {
    if (product.stock < quantity) {
      toast.error(`Stock insuficiente. Disponible: ${product.stock}`);
      return;
    }

    const saleItem = {
      productId: product._id || product.id, // Usar _id de MongoDB primero, luego id como fallback
      productName: product.name,
      unitPrice: product.price,
      quantity,
      total: product.price * quantity
    };

    dispatch({ type: 'ADD_TO_CURRENT_SALE', payload: saleItem });
    toast.success(`${product.name} agregado a la venta`);
  };

  const removeFromCurrentSale = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CURRENT_SALE', payload: productId });
  };

  const updateCurrentSaleItem = (productId, quantity) => {
    const item = state.currentSale.find(item => item.productId === productId);
    if (item) {
      const updatedItem = {
        ...item,
        quantity,
        total: item.unitPrice * quantity
      };
      dispatch({ type: 'UPDATE_CURRENT_SALE_ITEM', payload: updatedItem });
    }
  };

  const completeSale = async (paymentMethod = 'efectivo', customerId = null) => {
    try {
      if (state.currentSale.length === 0) {
        toast.error('No hay productos en la venta');
        return;
      }

      const subtotal = state.currentSale.reduce((sum, item) => sum + item.total, 0);
      const taxRate = parseFloat(state.settings.taxRate || 16) / 100;
      const taxes = subtotal * taxRate;
      const total = subtotal + taxes;

      console.log('� VENTA - Items en carrito:', state.currentSale);
      console.log('💰 VENTA - Datos calculados:', { subtotal, taxes, total });

      // Validar que todos los productos tengan IDs válidos
      const invalidProducts = state.currentSale.filter(item => !item.productId || typeof item.productId !== 'string');
      if (invalidProducts.length > 0) {
        console.error('❌ VENTA - Productos sin ID válido:', invalidProducts);
        throw new Error('Algunos productos no tienen ID válido');
      }

      // Preparar datos para la API MongoDB con todos los campos requeridos      
      const saleDataForAPI = {
        saleNumber: `SALE-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        items: state.currentSale.map(item => ({
          product: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity
        })),
        subtotal: subtotal,
        discount: 0,
        tax: taxes,
        total: total,
        paymentMethod,
        customer: customerId,
        cashier: 'Sistema',
        status: 'completada'
      };

      console.log('� VENTA - Enviando a API:', JSON.stringify(saleDataForAPI, null, 2));

      // STEP 1: Asegurar autenticación
      let currentToken = localStorage.getItem('authToken');
      console.log('🔐 VENTA - Token actual:', currentToken ? 'PRESENTE' : 'AUSENTE');
      
      if (!currentToken) {
        console.log('🔐 VENTA - No hay token, haciendo login...');
        try {
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: 'admin',
              password: 'admin123'
            })
          });
          
          if (!loginResponse.ok) {
            throw new Error('Error en autenticación');
          }
          
          const loginData = await loginResponse.json();
          localStorage.setItem('authToken', loginData.token);
          console.log('✅ VENTA - Login exitoso, token guardado');
        } catch (loginError) {
          console.error('❌ VENTA - Error en login:', loginError);
          throw new Error('No se pudo autenticar para completar la venta');
        }
      }

      // STEP 2: Enviar venta a la API
      try {
        console.log('📤 VENTA - Enviando venta a MongoDB...');
        const completedSale = await api.sales.create(saleDataForAPI);
        console.log('✅ VENTA - Guardada exitosamente:', completedSale);

        // STEP 3: Actualizar estado local
        dispatch({ type: 'ADD_SALE', payload: completedSale });
        dispatch({ type: 'CLEAR_CURRENT_SALE' });
        
        // Disparar evento para que FinancialContext recargue los datos
        window.dispatchEvent(new CustomEvent('saleCompleted', { 
          detail: { 
            saleId: completedSale._id || completedSale.id,
            total: completedSale.total,
            sale: completedSale
          } 
        }));
        
        toast.success('Venta completada exitosamente');
        return completedSale;

      } catch (saleError) {
        console.error('❌ VENTA - Error en API de ventas:', saleError);
        console.error('❌ VENTA - Error details:', {
          message: saleError.message,
          status: saleError.status,
          data: saleError.data
        });
        throw new Error(`Error al guardar venta: ${saleError.message}`);
      }

    } catch (error) {
      console.error('❌ VENTA - Error:', error);
      toast.error(`Error al completar venta: ${error.message}`);
      throw error;
    }
  };

  const clearCurrentSale = () => {
    dispatch({ type: 'CLEAR_CURRENT_SALE' });
  };

  // Category actions - Simplificadas (sin API específica)
  const addCategory = async (name) => {
    try {
      // Por ahora, categorías se manejan como parte de los productos
      // No hay endpoint específico para categorías
      console.log('⚠️ Función addCategory: No implementada, usar la gestión de productos. Categoría:', name);
      toast.warning('Las categorías se gestionan automáticamente con los productos');
      return null;
    } catch (error) {
      toast.error('Error al agregar categoría');
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      console.log('⚠️ Función deleteCategory: No implementada. ID:', id);
      toast.warning('Las categorías se gestionan automáticamente con los productos');
    } catch (error) {
      toast.error('Error al eliminar categoría');
      throw error;
    }
  };

  // Settings actions - Simplificadas (guardadas en localStorage)
  const updateSetting = async (key, value) => {
    try {
      const currentSettings = JSON.parse(localStorage.getItem('appSettings') || '{}');
      currentSettings[key] = value;
      localStorage.setItem('appSettings', JSON.stringify(currentSettings));
      
      // Actualizar el estado
      dispatch({ type: 'SET_SETTINGS', payload: currentSettings });
      
      toast.success('Configuración actualizada');
    } catch (error) {
      toast.error('Error al guardar configuración');
      throw error;
    }
  };

  const value = {
    ...state,
    // Product actions
    addProduct,
    updateProduct,
    deleteProduct,
    findProductByBarcode,
    // Sale actions
    addToCurrentSale,
    removeFromCurrentSale,
    updateCurrentSaleItem,
    completeSale,
    clearCurrentSale,
    // Category actions
    addCategory,
    deleteCategory,
    // Settings actions
    updateSetting,
    // Data management
    clearAllLocalData,
    // Utilities
    loadInitialData
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export default InventoryContext;
