import { eq, ilike, count } from 'drizzle-orm'; 
import { db } from '../db.js';
import { products } from '../../domain/schema.js';

class ProductRepository {
    async create(productData) {
        const result = await db.insert(products).values(productData).returning();
        return result[0];
    }

    async findAll({ page = 1, limit = 10, search = '' }) {
        const offset = (page - 1) * limit;

        const searchFilter = search ? ilike(products.name, `%${search}%`) : undefined;

        const [items, totalResult] = await Promise.all([
            db.query.products.findMany({
                where: searchFilter,
                limit: limit,
                offset: offset,
                orderBy: (products, { desc }) => [desc(products.id)],
            }),

            db.select({ value: count() })
                .from(products)
                .where(searchFilter)
        ]);

        return {
            items,
            total: totalResult[0].value,
            page,
            limit,
            totalPages: Math.ceil(totalResult[0].value / limit)
        };
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