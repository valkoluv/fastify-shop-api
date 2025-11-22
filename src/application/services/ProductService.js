import productRepository from '../../infrastructure/repositories/ProductRepository.js';

class ProductService {
    async createProduct(data) {
        return await productRepository.create(data);
    }

    async getAllProducts() {
        return await productRepository.findAll();
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