import productService from '../../application/services/ProductService.js';
import { checkAuth } from '../hooks/authHook.js';

const productBodySchema = {
    type: 'object',
    required: ['name', 'price'],
    properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'integer', description: 'Price in cents' }
    }
};

const createProductSchema = {
    description: 'Create a new product',
    tags: ['Products'],
    body: productBodySchema,
    response: {
        201: {
            description: 'Product created',
            type: 'object',
            properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                price: { type: 'integer' }
            }
        }
    }
};

const productParamsSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' }
    }
};

async function productRoutes(fastify, options) {

    fastify.get('/products', {
        schema: {
            description: 'Get all products',
            tags: ['Products']
        }
    }, async (request, reply) => {
        return await productService.getAllProducts();
    });

    fastify.get('/products/:id', {
        schema: {
            description: 'Get product by ID',
            tags: ['Products'],
            params: productParamsSchema
        }
    }, async (request, reply) => {
        try {
            return await productService.getProductById(Number(request.params.id));
        } catch (error) {
            return reply.code(404).send({ message: error.message });
        }
    });

    fastify.register(async function (protectedRoutes) {

        protectedRoutes.addHook('preHandler', checkAuth);

        protectedRoutes.post('/products', { schema: createProductSchema }, async (req, reply) => {
            const product = await productService.createProduct(req.body);
            return reply.code(201).send(product);
        });

        protectedRoutes.put('/products/:id', async (req, reply) => {
            return await productService.updateProduct(Number(req.params.id), req.body);
        });

        protectedRoutes.delete('/products/:id', async (req, reply) => {
            await productService.deleteProduct(Number(req.params.id));
            return { message: 'Product deleted' };
        });
    });
}

export default productRoutes;