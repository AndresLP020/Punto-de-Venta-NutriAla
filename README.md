# 🥗 NutriAla - Sistema de Inventario

Sistema de inventario moderno y elegante desarrollado con React para la tienda NutriAla. Una solución completa para gestionar productos, ventas, y generar reportes financieros con integración de lector de código de barras.

## ✨ Características Principales

### 📦 Gestión de Productos
- ✅ Alta, baja y modificación de productos
- ✅ Control de stock con alertas automáticas
- ✅ Categorización de productos
- ✅ Gestión de precios y costos
- ✅ Códigos de barras únicos

### 🛒 Punto de Venta (POS)
- ✅ Interfaz intuitiva para ventas
- ✅ Lector de código de barras integrado
- ✅ Múltiples métodos de pago
- ✅ Cálculo automático de impuestos
- ✅ Carrito de compras en tiempo real

### 📊 Reportes y Analytics
- ✅ Dashboard con métricas clave
- ✅ Ganancias brutas y netas
- ✅ Productos más vendidos
- ✅ Análisis por categorías
- ✅ Reportes de ventas diarias
- ✅ Gráficos interactivos

### 🔍 Escáner de Códigos
- ✅ Entrada manual de códigos
- 🔄 Escáner por cámara (próximamente)
- 🔄 Escáner por imagen (próximamente)

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, Vite
- **Routing**: React Router DOM
- **Estilos**: Tailwind CSS
- **Iconos**: Heroicons
- **Base de Datos**: Dexie (IndexedDB)
- **Gráficos**: Recharts
- **Notificaciones**: React Hot Toast
- **Estado Global**: Context API + useReducer

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repositorio]
   cd inventario
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Acceder a la aplicación**
   Abre tu navegador en `http://localhost:5173`

## 📱 Uso de la Aplicación

### Dashboard Principal
- Vista general de métricas importantes
- Alertas de stock bajo
- Ventas recientes
- Productos más vendidos

### Gestión de Productos
1. Ir a **Productos** en el menú lateral
2. Hacer clic en **Nuevo Producto**
3. Llenar la información requerida
4. Guardar el producto

### Realizar una Venta
1. Ir a **Ventas** en el menú lateral
2. Escanear código de barras o buscar producto
3. Agregar productos al carrito
4. Seleccionar método de pago
5. Completar la venta

### Ver Reportes
1. Ir a **Reportes** en el menú lateral
2. Seleccionar rango de fechas
3. Revisar métricas y gráficos
4. Exportar reportes (próximamente)

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Header.jsx
│   ├── ui/
│   │   └── index.js
│   └── ProductForm.jsx
├── context/
│   └── InventoryContext.jsx
├── hooks/
│   └── useInventory.js
├── pages/
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── Sales.jsx
│   ├── Scanner.jsx
│   ├── Reports.jsx
│   ├── Customers.jsx
│   └── Settings.jsx
├── utils/
│   └── database.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🎯 Funcionalidades Próximas

- [ ] Gestión completa de clientes
- [ ] Configuración avanzada del sistema
- [ ] Exportación de reportes en PDF
- [ ] Escáner de cámara en tiempo real
- [ ] Sincronización en la nube
- [ ] Múltiples usuarios y roles
- [ ] Integración con impresoras de tickets
- [ ] API REST para integraciones
- [ ] Backup automático de datos

## 📊 Datos de Ejemplo

La aplicación incluye datos de ejemplo para demostración:
- 4 productos de muestra en diferentes categorías
- 5 categorías predefinidas (Suplementos, Vitaminas, Proteínas, Snacks, Bebidas)
- Configuración inicial del sistema

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Previsualizar build de producción
npm run lint         # Ejecutar ESLint
```

## 💾 Base de Datos Local

La aplicación utiliza IndexedDB a través de Dexie para almacenamiento local:
- **Productos**: Información completa de productos
- **Ventas**: Registros de todas las transacciones
- **Categorías**: Clasificación de productos
- **Inventario**: Movimientos de stock
- **Configuración**: Ajustes del sistema

## 🎨 Diseño y UX

- **Diseño Responsive**: Funciona en desktop y móvil
- **Tema Moderno**: Colores verdes representando salud y nutrición
- **Navegación Intuitiva**: Menú lateral con iconos claros
- **Feedback Visual**: Notificaciones y estados de carga
- **Accesibilidad**: Componentes accesibles y navegación por teclado

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Desarrollo

Desarrollado con ❤️ para NutriAla - Tu tienda de nutrición de confianza.

---

**¿Necesitas ayuda?** Contacta al equipo de desarrollo o revisa la documentación en el archivo `copilot-instructions.md` para más detalles técnicos.
