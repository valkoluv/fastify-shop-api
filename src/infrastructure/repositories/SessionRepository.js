import { eq } from 'drizzle-orm';
import { db } from '../db.js';
import { sessions } from '../../domain/schema.js';

class SessionRepository {
    async create(data) {
        const result = await db.insert(sessions).values(data).returning();
        return result[0];
    }

    async findByToken(token) {
        return await db.query.sessions.findFirst({
            where: eq(sessions.token, token),
            with: { user: true }
        });
    }

    async delete(token) {
        await db.delete(sessions).where(eq(sessions.token, token));
    }
}

export default new SessionRepository();