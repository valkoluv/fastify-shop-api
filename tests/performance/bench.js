import autocannon from 'autocannon';

const BASE_URL = 'http://localhost:3000';

async function runLoadTest() {
    console.log('🚀 Start Performance Testing...\n');

    console.log('🔑 Authorization to gain access...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'testuser@example.com', password: 'password123' })
    });

    const cookie = loginRes.headers.get('set-cookie')?.split(';')[0];

    if (!cookie) {
        console.error('❌ Failed to get Cookie. Check if the user exists.');
        return;
    }
    console.log('✅ Cookie obtained. Starting the attack!\n');

    console.log('--- SCENARIO 1: GET /products (Reading) ---');
    await runAutocannon({
        url: `${BASE_URL}/products`,
        method: 'GET',
        connections: 10, 
        duration: 5,     
    });

    console.log('\n--- SCENARIO 2: POST /orders (Creating) ---');
    await runAutocannon({
        url: `${BASE_URL}/orders`,
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Cookie': cookie
        },
        body: JSON.stringify({
            items: [{ productId: 1, quantity: 1 }]
        }),
        connections: 10,
        duration: 5,
    });

    console.log('\n--- SCENARIO 3: PUT /products/1 (Updating) ---');
    await runAutocannon({
        url: `${BASE_URL}/products/1`, 
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'Cookie': cookie
        },
        body: JSON.stringify({
            name: 'Updated Product Name',
            price: 10000
        }),
        connections: 10,
        duration: 5,
    });

    console.log('\n🏁 Testing completed!');
}

function runAutocannon(opts) {
    return new Promise((resolve, reject) => {
        const instance = autocannon(opts, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });

        autocannon.track(instance, { renderProgressBar: true });
    });
}

runLoadTest();