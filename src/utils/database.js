import Dexie from 'dexie';

/**
 * NutriAla Inventory Database Schema
 */
export class InventoryDatabase extends Dexie {
  constructor() {
    super('NutriAlaInventory');
    
    this.version(1).stores({
      products: '++id, barcode, name, description, category, price, cost, stock, minStock, maxStock, supplier, image, isActive, createdAt, updatedAt',
      sales: '++id, products, subtotal, taxes, total, paymentMethod, customerId, cashierId, createdAt',
      saleItems: '++id, saleId, productId, productName, quantity, unitPrice, total',
      customers: '++id, name, email, phone, address, createdAt',
      suppliers: '++id, name, contact, email, phone, address, createdAt',
      categories: '++id, name, description, createdAt',
      inventory: '++id, productId, type, quantity, reason, cost, createdAt',
      settings: '++id, key, value, updatedAt'
    });

    // Initialize default data
    this.on('populate', () => this.populate());
  }

  async populate() {
    // Default categories
    await this.categories.bulkAdd([
      { name: 'Suplementos', description: 'Suplementos nutricionales', createdAt: new Date() },
      { name: 'Vitaminas', description: 'Vitaminas y minerales', createdAt: new Date() },
      { name: 'Proteínas', description: 'Proteínas en polvo', createdAt: new Date() },
      { name: 'Snacks', description: 'Snacks saludables', createdAt: new Date() },
      { name: 'Bebidas', description: 'Bebidas nutritivas', createdAt: new Date() }
    ]);

    // Default settings
    await this.settings.bulkAdd([
      { key: 'storeName', value: 'NutriAla', updatedAt: new Date() },
      { key: 'currency', value: 'MXN', updatedAt: new Date() },
      { key: 'taxRate', value: '16', updatedAt: new Date() },
      { key: 'lowStockAlert', value: '10', updatedAt: new Date() }
    ]);

    // Sample products
    await this.products.bulkAdd([
      {
        barcode: '7501234567890',
        name: 'Proteína Whey Vainilla',
        description: 'Proteína en polvo sabor vainilla 2kg',
        category: 'Proteínas',
        price: 899.00,
        cost: 650.00,
        stock: 25,
        minStock: 5,
        maxStock: 50,
        supplier: 'Nutrición Premium',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        barcode: '7501234567891',
        name: 'Multivitamínico Complex',
        description: 'Complejo vitamínico 60 cápsulas',
        category: 'Vitaminas',
        price: 299.00,
        cost: 180.00,
        stock: 40,
        minStock: 10,
        maxStock: 100,
        supplier: 'VitaLife',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        barcode: '7501234567892',
        name: 'Creatina Monohidrato',
        description: 'Creatina pura 300g',
        category: 'Suplementos',
        price: 450.00,
        cost: 320.00,
        stock: 15,
        minStock: 5,
        maxStock: 30,
        supplier: 'Nutrición Premium',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        barcode: '7501234567893',
        name: 'Barras Proteicas Chocolate',
        description: 'Caja de 12 barras proteicas',
        category: 'Snacks',
        price: 180.00,
        cost: 120.00,
        stock: 8,
        minStock: 10,
        maxStock: 50,
        supplier: 'Healthy Snacks',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  }
}

export const db = new InventoryDatabase();
