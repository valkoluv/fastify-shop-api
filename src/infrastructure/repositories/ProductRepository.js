import { eq } from 'drizzle-orm';
import { db } from '../db.js';
import { products } from '../../domain/schema.js';

class ProductRepository {
    async create(productData) {
        const result = await db.insert(products).values(productData).returning();
        return result[0];
    }

    async findAll() {
        return await db.query.products.findMany();
    }

    async findById(id) {
        return await db.query.products.findFirst({
            where: eq(products.id, id),
        });
    }

    async update(id, data) {
        const result = await db
            .update(products)
            .set(data)
            .where(eq(products.id, id))
            .returning();
        return result[0];
    }

    async delete(id) {
        return await db.delete(products).where(eq(products.id, id)).returning();
    }
}

export default new ProductRepository();