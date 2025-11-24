import { describe, it, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import authService from '../../src/application/services/AuthService.js';
import userRepository from '../../src/infrastructure/repositories/UserRepository.js';
import sessionRepository from '../../src/infrastructure/repositories/SessionRepository.js';

describe('AuthService Suite', () => {

    afterEach(() => {
        mock.reset();
    });

    describe('register()', () => {
        it('should register a new user successfully', async () => {
            const mockUser = { id: 1, email: 'new@test.com', name: 'Tester' };

            mock.method(userRepository, 'findByEmail', async () => null);

            mock.method(userRepository, 'create', async () => mockUser);

            const result = await authService.register('new@test.com', 'Tester', 'password123');

            assert.strictEqual(result.email, 'new@test.com');
            assert.strictEqual(result.id, 1);
        });

        it('should throw error if user already exists', async () => {
            mock.method(userRepository, 'findByEmail', async () => ({ id: 1, email: 'exist@test.com' }));

            await assert.rejects(
                async () => await authService.register('exist@test.com', 'Tester', 'password123'),
                { message: 'User already exists' }
            );
        });
    });

    describe('login()', () => {
        it('should throw error if user not found', async () => {
            mock.method(userRepository, 'findByEmail', async () => null);

            await assert.rejects(
                async () => await authService.login('notfound@test.com', '123456'),
                { message: 'Invalid credentials' }
            );
        });
    });
});