import userRepository from '../../infrastructure/repositories/UserRepository.js';

class UserService {
    async registerUser(payload) {
        return await userRepository.create(payload);
    }

    async getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) throw new Error('User not found');
        return user;
    }

    async getAllUsers() {
        return await userRepository.findAll();
    }

    async updateUser(id, payload) {
        await this.getUserById(id);
        return await userRepository.update(id, payload);
    }
    
    async deleteUser(id) {
        await this.getUserById(id);
        return await userRepository.delete(id);
    }
}

export default new UserService();