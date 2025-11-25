import productRepository from '../../infrastructure/repositories/ProductRepository.js';
import redis from '../../adapters/redis/index.js';

class ProductService {
    async createProduct(data) {
        return await productRepository.create(data);
    }

    async getAllProducts({ page, limit, search }) {
        const cacheKey = `products:page=${page}:limit=${limit}:search=${search || ''}`;

        try {
            const cachedData = await redis.get(cacheKey);

            if (cachedData) {
                console.log('⚡ Returning from Cache');
                return JSON.parse(cachedData);
            }
        } catch (err) {
            console.error('Redis error (skipping cache):', err);
        }

        console.log('🐌 Fetching from DB');
        const result = await productRepository.findAll({ page, limit, search });

        try {
            await redis.set(cacheKey, JSON.stringify(result), 'EX', 60);
        } catch (err) {
            console.error('Failed to cache data:', err);
        }

        return result;
    }

    async getProductById(id) {
        const product = await productRepository.findById(id);
        if (!product) {
            throw new Error(`Product with ID ${id} not found`);
        }
        return product;
    }

    async updateProduct(id, data) {
        await this.getProductById(id);
        return await productRepository.update(id, data);
    }

    async deleteProduct(id) {
        await this.getProductById(id);
        return await productRepository.delete(id);
    }
}

export default new ProductService();