const BASE_URL = 'http://localhost:3000';

async function testAPI() {
    console.log('Starting Smoke Test...\n');

    try {
        console.log('1. Creating User...');
        const userRes = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Tester', email: `test_${Date.now()}@example.com` })
        });
        const user = await userRes.json();
        if (!user.id) throw new Error('Failed to create user');
        console.log('✅ User Created:', user);

        console.log('\n2. Creating Product...');
        const prodRes = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test Laptop', price: 2500000, description: 'Gaming' })
        });
        const product = await prodRes.json();
        if (!product.id) throw new Error('Failed to create product');
        console.log('✅ Product Created:', product);

        console.log('\n3. Creating Order...');
        const orderRes = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                items: [
                    { productId: product.id, quantity: 2 }
                ]
            })
        });
        const order = await orderRes.json();
        if (!order.id) throw new Error('Failed to create order');
        console.log('✅ Order Created:', order);

        console.log('\n4. Reading Order...');
        const checkOrderRes = await fetch(`${BASE_URL}/orders/${order.id}`);
        const orderDetails = await checkOrderRes.json();

        console.log('✅ Order Details Fetch Success');
        console.dir(orderDetails, { depth: null });

        console.log('\n🎉 All tests passed successfully!');

    } catch (error) {
        console.error('\n❌ test error:', error.message);
    }
}

testAPI();