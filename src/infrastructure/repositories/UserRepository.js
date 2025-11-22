import { eq } from 'drizzle-orm';
import { db } from '../db.js';
import { users } from '../../domain/schema.js';

class UserRepository {
    async create(userData) {
        const result = await db.insert(users).values(userData).returning();
        return result[0]; 
    }

    async findById(id) {
        return await db.query.users.findFirst({
            where: eq(users.id, id),
            with: {
                orders: true 
            }
        });
    }

    async findAll() {
        return await db.query.users.findMany();
    }

    async update(id, data) {
        const result = await db
            .update(users)
            .set(data)
            .where(eq(users.id, id))
            .returning();
        return result[0];
    }

    async delete(id) {
        const result = await db
            .delete(users)
            .where(eq(users.id, id))
            .returning();
        return result[0];
    }
}

export default new UserRepository();