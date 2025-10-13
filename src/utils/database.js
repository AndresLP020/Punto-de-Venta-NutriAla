// ⚠️ ARCHIVO DESACTIVADO ⚠️
// Este archivo contenía la configuración de IndexedDB
// Ahora el sistema funciona exclusivamente con MongoDB a través de la API
// No usar este archivo - todas las operaciones se hacen via API REST

/*
// Código anterior de IndexedDB comentado para referencia futura

import Dexie from 'dexie';

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
      settings: '++id, key, value, updatedAt',
      employees: '++id, name, weeklySalary, position, hireDate, isActive, lastPaymentDate, nextPaymentDate, totalPaid, createdAt, updatedAt',
      adminExpenses: '++id, description, amount, category, date, createdAt, updatedAt',
      financialTransactions: '++id, type, amount, description, category, date, relatedId, createdAt'
    });

    this.on('populate', () => this.populate());
  }

  async populate() {
    // ... datos de ejemplo comentados
  }
}

export const db = new InventoryDatabase();
*/

console.log('⚠️ database.js está desactivado - usando solo MongoDB via API');
