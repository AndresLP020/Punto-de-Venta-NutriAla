import React, { createContext, useReducer, useEffect } from 'react';
import { db } from '../utils/database';
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
      
      const [products, categories, suppliers, sales, settings] = await Promise.all([
        db.products.orderBy('name').toArray(),
        db.categories.orderBy('name').toArray(),
        db.suppliers.orderBy('name').toArray(),
        db.sales.orderBy('createdAt').reverse().limit(100).toArray(),
        db.settings.toArray()
      ]);

      const settingsObj = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});

      dispatch({ type: 'SET_PRODUCTS', payload: products });
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
      dispatch({ type: 'SET_SUPPLIERS', payload: suppliers });
      dispatch({ type: 'SET_SALES', payload: sales });
      dispatch({ type: 'SET_SETTINGS', payload: settingsObj });
    } catch (error) {
      console.error('Error loading data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar los datos' });
      toast.error('Error al cargar los datos');
    }
  };

  // Product operations
  const addProduct = async (productData) => {
    try {
      const newProduct = {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };
      
      const id = await db.products.add(newProduct);
      const product = await db.products.get(id);
      
      dispatch({ type: 'ADD_PRODUCT', payload: product });
      toast.success('Producto agregado exitosamente');
      return product;
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error al agregar el producto');
      throw error;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await db.products.update(id, updatedData);
      const product = await db.products.get(id);
      
      dispatch({ type: 'UPDATE_PRODUCT', payload: product });
      toast.success('Producto actualizado exitosamente');
      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar el producto');
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await db.products.delete(id);
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
      toast.success('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto');
      throw error;
    }
  };

  const findProductByBarcode = async (barcode) => {
    try {
      const product = await db.products.where('barcode').equals(barcode).first();
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
      productId: product.id,
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

      // Create sale record
      const saleData = {
        products: state.currentSale.length,
        subtotal,
        taxes,
        total,
        paymentMethod,
        customerId,
        cashierId: 1, // Default cashier
        createdAt: new Date()
      };

      const saleId = await db.sales.add(saleData);

      // Add sale items and update inventory
      for (const item of state.currentSale) {
        await db.saleItems.add({
          saleId,
          ...item
        });

        // Update product stock
        const product = await db.products.get(item.productId);
        if (product) {
          await db.products.update(item.productId, {
            stock: product.stock - item.quantity,
            updatedAt: new Date()
          });

          // Add inventory movement
          await db.inventory.add({
            productId: item.productId,
            type: 'sale',
            quantity: -item.quantity,
            reason: `Venta #${saleId}`,
            createdAt: new Date()
          });
        }
      }

      // Update state
      const completedSale = await db.sales.get(saleId);
      dispatch({ type: 'ADD_SALE', payload: completedSale });
      dispatch({ type: 'CLEAR_CURRENT_SALE' });
      
      // Refresh products to update stock
      const updatedProducts = await db.products.orderBy('name').toArray();
      dispatch({ type: 'SET_PRODUCTS', payload: updatedProducts });

      toast.success(`Venta completada. Total: $${total.toFixed(2)}`);
      return completedSale;
    } catch (error) {
      console.error('Error completing sale:', error);
      toast.error('Error al completar la venta');
      throw error;
    }
  };

  const clearCurrentSale = () => {
    dispatch({ type: 'CLEAR_CURRENT_SALE' });
  };

  // Category actions
  const addCategory = async (name) => {
    try {
      const exists = await db.categories.where('name').equalsIgnoreCase(name).first();
      if (exists) {
        toast.error('La categoría ya existe');
        return;
      }
      const id = await db.categories.add({ name, createdAt: new Date() });
      const updatedCategories = await db.categories.orderBy('name').toArray();
      dispatch({ type: 'SET_CATEGORIES', payload: updatedCategories });
      toast.success('Categoría agregada');
      return id;
    } catch (error) {
      toast.error('Error al agregar categoría');
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      // Verificar si hay productos usando esta categoría
      const productsWithCategory = await db.products.where('category').equals((await db.categories.get(id)).name).count();
      if (productsWithCategory > 0) {
        toast.error('No se puede eliminar: hay productos usando esta categoría');
        return;
      }
      await db.categories.delete(id);
      const updatedCategories = await db.categories.orderBy('name').toArray();
      dispatch({ type: 'SET_CATEGORIES', payload: updatedCategories });
      toast.success('Categoría eliminada');
    } catch (error) {
      toast.error('Error al eliminar categoría');
      throw error;
    }
  };

  // Settings actions
  const updateSetting = async (key, value) => {
    try {
      const setting = await db.settings.where('key').equals(key).first();
      if (setting) {
        await db.settings.update(setting.id, { value, updatedAt: new Date() });
      } else {
        await db.settings.add({ key, value, updatedAt: new Date() });
      }
      // Refrescar settings en el estado
      const settingsArr = await db.settings.toArray();
      const settingsObj = settingsArr.reduce((acc, s) => { acc[s.key] = s.value; return acc; }, {});
      dispatch({ type: 'SET_SETTINGS', payload: settingsObj });
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
    // Utilities
    loadInitialData
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}
