import { describe, it, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import productService from '../../src/application/services/ProductService.js';
import productRepository from '../../src/infrastructure/repositories/ProductRepository.js';

describe('ProductService Suite', () => {

    afterEach(() => {
        mock.reset();
    });

    describe('createProduct()', () => {
        it('should create a product successfully', async () => {
            const newProduct = { name: 'Laptop', price: 20000 };
            const createdProduct = { id: 1, ...newProduct };

            mock.method(productRepository, 'create', async () => createdProduct);

            const result = await productService.createProduct(newProduct);

            assert.strictEqual(result.id, 1);
            assert.strictEqual(result.name, 'Laptop');
        });
    });

    describe('getProductById()', () => {
        it('should return product if found', async () => {
            const product = { id: 10, name: 'Phone' };
            mock.method(productRepository, 'findById', async () => product);

            const result = await productService.getProductById(10);
            assert.deepStrictEqual(result, product);
        });

        it('should throw error if product not found', async () => {
            mock.method(productRepository, 'findById', async () => null);

            await assert.rejects(
                async () => await productService.getProductById(999),
                (err) => {
                    assert.match(err.message, /Product with ID 999 not found/);
                    return true;
                }
            );
        });
    });
});