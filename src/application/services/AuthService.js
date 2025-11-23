import bcrypt from 'bcrypt';
import crypto from 'crypto'; 
import userRepository from '../../infrastructure/repositories/UserRepository.js';
import sessionRepository from '../../infrastructure/repositories/SessionRepository.js';

class AuthService {

    async register(email, name, plainPassword) {
        const existing = await userRepository.findByEmail(email);
        if (existing) throw new Error('User already exists');

        const passwordHash = await bcrypt.hash(plainPassword, 10);

        return await userRepository.create({
            email,
            name,
            passwordHash
        });
    }

    async login(email, plainPassword) {
        const user = await userRepository.findByEmail(email);
        if (!user) throw new Error('Invalid credentials');

        const isMatch = await bcrypt.compare(plainPassword, user.passwordHash);
        if (!isMatch) throw new Error('Invalid credentials');

        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 день

        await sessionRepository.create({
            userId: user.id,
            token,
            expiresAt
        });

        return token;
    }

    async getSession(token) {
        const session = await sessionRepository.findByToken(token);
        if (!session) return null;

        if (new Date() > session.expiresAt) {
            await sessionRepository.delete(token);
            return null;
        }
        return session;
    }

    async logout(token) {
        await sessionRepository.delete(token);
    }
}

export default new AuthService();