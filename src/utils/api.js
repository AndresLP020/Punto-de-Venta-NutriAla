console.log('🌍 API_BASE_URL =', import.meta.env.VITE_API_URL);

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL;
//const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


// Clase para manejo de errores de API
export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Función para hacer peticiones HTTP
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.message || 'Error en la petición',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Error de conexión', 500, { originalError: error.message });
  }
}

// API de autenticación
export const authAPI = {
  async login(credentials) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  async register(userData) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: userData,
    });
  },

  async verifyToken() {
    return apiRequest('/auth/verify');
  },

  async getProfile() {
    return apiRequest('/auth/profile');
  },

  async updateProfile(profileData) {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: profileData,
    });
  },

  logout() {
    localStorage.removeItem('authToken');
  },
};

// API de productos
export const productsAPI = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id) {
    return apiRequest(`/products/${id}`);
  },

  async getByBarcode(barcode) {
    return apiRequest(`/products/barcode/${barcode}`);
  },

  async create(productData) {
    return apiRequest('/products', {
      method: 'POST',
      body: productData,
    });
  },

  async update(id, productData) {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: productData,
    });
  },

  async delete(id) {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  async getCategories() {
    return apiRequest('/products/categories/list');
  },

  async updateStock(id, stockData) {
    return apiRequest(`/products/${id}/stock`, {
      method: 'PATCH',
      body: stockData,
    });
  },
};

// API de ventas
export const salesAPI = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/sales${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id) {
    return apiRequest(`/sales/${id}`);
  },

  async create(saleData) {
    return apiRequest('/sales', {
      method: 'POST',
      body: saleData,
    });
  },

  async cancel(id) {
    return apiRequest(`/sales/${id}/cancel`, {
      method: 'PATCH',
    });
  },

  async getStats(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/sales/stats/summary${queryString ? `?${queryString}` : ''}`);
  },
};

// API de clientes
export const customersAPI = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/customers${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id) {
    return apiRequest(`/customers/${id}`);
  },

  async create(customerData) {
    return apiRequest('/customers', {
      method: 'POST',
      body: customerData,
    });
  },

  async update(id, customerData) {
    return apiRequest(`/customers/${id}`, {
      method: 'PUT',
      body: customerData,
    });
  },
};

// API financiera
export const financialAPI = {
  async getTransactions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/financial/transactions${queryString ? `?${queryString}` : ''}`);
  },

  async createTransaction(transactionData) {
    return apiRequest('/financial/transactions', {
      method: 'POST',
      body: transactionData,
    });
  },

  async getSummary(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/financial/summary${queryString ? `?${queryString}` : ''}`);
  },
};

// API de inventario
export const inventoryAPI = {
  async getLowStock() {
    return apiRequest('/inventory/low-stock');
  },

  async getStats() {
    return apiRequest('/inventory/stats');
  },
};

// API de reportes
export const reportsAPI = {
  async getSalesReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/reports/sales${queryString ? `?${queryString}` : ''}`);
  },

  async getTopProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/reports/top-products${queryString ? `?${queryString}` : ''}`);
  },

  async getFinancialReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/reports/financial${queryString ? `?${queryString}` : ''}`);
  },
};

// Hook para verificar conectividad
export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};

// Función para guardar token de autenticación
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Función para obtener token de autenticación
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export default {
  auth: authAPI,
  products: productsAPI,
  sales: salesAPI,
  customers: customersAPI,
  financial: financialAPI,
  inventory: inventoryAPI,
  reports: reportsAPI,
  checkServerHealth,
  setAuthToken,
  getAuthToken,
};

// Funciones de conveniencia para mantener compatibilidad
export const getProducts = async () => {
  console.log('🔧 API: Llamando a getProducts...');
  const result = await productsAPI.getAll({ limit: 100 });
  console.log('🔧 API: Respuesta de getProducts:', result);
  return result;
};
export const getCustomers = () => customersAPI.getAll();
export const getSales = async () => {
  console.log('💰 API: Llamando a getSales...');
  try {
    const result = await salesAPI.getAll({ limit: 200 });
    console.log('💰 API: Respuesta de getSales:', result);
    console.log('💰 API: Número de ventas en resultado:', result?.totalSales || 0);
    
    // El endpoint retorna {sales: [...], totalPages, currentPage, totalSales}
    // Necesitamos solo el array de ventas
    const salesArray = result?.sales || [];
    console.log('💰 API: Array de ventas extraído:', salesArray?.length || 0);
    
    if (salesArray && salesArray.length > 0) {
      console.log('💰 API: Primera venta:', salesArray[0]);
      console.log('💰 API: Total primera venta:', salesArray[0]?.total);
    }
    
    return salesArray;
  } catch (error) {
    console.error('💰 API: Error en getSales:', error);
    throw error;
  }
};