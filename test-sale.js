// Test script para verificar la autenticación y crear una venta de prueba
const API_BASE_URL = 'http://localhost:5000/api';

async function testCreateSale() {
    try {
        console.log('🔍 Iniciando test de creación de venta...');
        
        // 1. Verificar si ya hay token
        let token = localStorage.getItem('authToken');
        console.log('🔐 Token existente:', token ? 'SÍ' : 'NO');
        
        // 2. Login si no hay token
        if (!token) {
            console.log('🔐 Haciendo login...');
            const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
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
                console.log('✅ Login exitoso');
            } else {
                const errorData = await loginResponse.json();
                console.error('❌ Error en login:', errorData);
                return;
            }
        }
        
        // 3. Verificar productos disponibles
        console.log('📦 Obteniendo productos...');
        const productsResponse = await fetch(`${API_BASE_URL}/products`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!productsResponse.ok) {
            console.error('❌ Error obteniendo productos:', await productsResponse.json());
            return;
        }
        
        const productsData = await productsResponse.json();
        const products = productsData.products || [];
        console.log('📦 Productos disponibles:', products.length);
        
        if (products.length === 0) {
            console.error('❌ No hay productos disponibles para vender');
            return;
        }
        
        // 4. Crear venta de prueba
        const firstProduct = products[0];
        console.log('💰 Creando venta con producto:', firstProduct.name);
        
        const saleData = {
            items: [{
                product: firstProduct._id,
                quantity: 1,
                unitPrice: firstProduct.price
            }],
            paymentMethod: 'efectivo',
            discount: 0,
            tax: firstProduct.price * 0.16 // 16% IVA
        };
        
        console.log('💰 Datos de venta:', JSON.stringify(saleData, null, 2));
        
        const saleResponse = await fetch(`${API_BASE_URL}/sales`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(saleData)
        });
        
        if (saleResponse.ok) {
            const saleResult = await saleResponse.json();
            console.log('✅ Venta creada exitosamente:', saleResult);
            
            // 5. Verificar que se guardó
            const salesCheckResponse = await fetch(`${API_BASE_URL}/sales`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (salesCheckResponse.ok) {
                const salesData = await salesCheckResponse.json();
                console.log('✅ Total de ventas después de crear:', salesData.totalSales);
            }
        } else {
            const errorData = await saleResponse.json();
            console.error('❌ Error creando venta:', errorData);
        }
        
    } catch (error) {
        console.error('❌ Error general:', error);
    }
}

// Función para ejecutar desde la consola del navegador
window.testCreateSale = testCreateSale;
console.log('📝 Para probar, ejecuta: testCreateSale()');