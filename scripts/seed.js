import { faker } from '@faker-js/faker';
import { db } from '../src/infrastructure/db.js'; 
import { products } from '../src/domain/schema.js';
import 'dotenv/config'; 

const TOTAL_RECORDS = 100000; 
const BATCH_SIZE = 1000;

async function seed() {
    console.log(`🌱 Starting seed for ${TOTAL_RECORDS} products...`);
    const start = Date.now();

    try {
        for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
            const batch = [];

            for (let j = 0; j < BATCH_SIZE; j++) {
                batch.push({
                    name: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    price: parseInt(faker.commerce.price({ min: 100, max: 100000 })) 
                });
            }

            await db.insert(products).values(batch);

            const progress = Math.min(((i + BATCH_SIZE) / TOTAL_RECORDS) * 100, 100);
            process.stdout.write(`\r🚀 Progress: ${progress.toFixed(1)}% (${i + BATCH_SIZE}/${TOTAL_RECORDS})`);
        }

        const duration = (Date.now() - start) / 1000;
        console.log(`\n✅ Seeding completed in ${duration.toFixed(2)}s`);
        process.exit(0);

    } catch (err) {
        console.error('\n❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();