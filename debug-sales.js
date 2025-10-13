// Script de prueba para verificar el endpoint de ventas
const API_BASE_URL = 'http://localhost:5000/api';

async function testSalesAPI() {
    try {
        console.log('🔍 Probando endpoint de ventas...');
        
        // 1. Verificar el endpoint de salud del servidor
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        console.log('🏥 Estado del servidor:', healthResponse.ok ? 'OK' : 'ERROR');
        
        // 2. Intentar obtener las ventas sin autenticación
        try {
            const salesResponse = await fetch(`${API_BASE_URL}/sales`);
            const salesData = await salesResponse.json();
            console.log('💰 Respuesta de ventas (sin auth):', salesData);
        } catch (error) {
            console.log('⚠️ Error sin autenticación:', error.message);
        }
        
        // 3. Intentar login automático
        try {
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
                console.log('🔐 Login exitoso, token obtenido');
                
                // 4. Probar las ventas con autenticación
                const authSalesResponse = await fetch(`${API_BASE_URL}/sales`, {
                    headers: {
                        'Authorization': `Bearer ${loginData.token}`
                    }
                });
                
                const authSalesData = await authSalesResponse.json();
                console.log('💰 Respuesta de ventas (con auth):', authSalesData);
                console.log('💰 Número de ventas:', authSalesData?.sales?.length || 0);
                
                if (authSalesData?.sales?.length > 0) {
                    console.log('💰 Primera venta:', authSalesData.sales[0]);
                }
            } else {
                console.log('❌ Error en login');
            }
        } catch (error) {
            console.log('❌ Error en autenticación:', error.message);
        }
        
    } catch (error) {
        console.error('❌ Error general:', error);
    }
}

// Ejecutar cuando se cargue el DOM
if (typeof window !== 'undefined') {
    window.testSalesAPI = testSalesAPI;
    console.log('📝 Para probar, ejecuta: testSalesAPI()');
} else {
    // Ejecutar directamente en Node.js si es posible
    testSalesAPI();
}