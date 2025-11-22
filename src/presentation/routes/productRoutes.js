import productService from '../../application/services/ProductService.js';

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

    fastify.post('/products', { schema: createProductSchema }, async (request, reply) => {
        const product = await productService.createProduct(request.body);
        return reply.code(201).send(product);
    });

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

    fastify.put('/products/:id', {
        schema: {
            description: 'Update product',
            tags: ['Products'],
            params: productParamsSchema,
            body: { ...productBodySchema, required: [] }
        }
    }, async (request, reply) => {
        try {
            return await productService.updateProduct(Number(request.params.id), request.body);
        } catch (error) {
            return reply.code(404).send({ message: error.message });
        }
    });

    fastify.delete('/products/:id', {
        schema: {
            description: 'Delete product',
            tags: ['Products'],
            params: productParamsSchema
        }
    }, async (request, reply) => {
        try {
            const result = await productService.deleteProduct(Number(request.params.id));
            return { message: 'Product deleted', deletedId: result.id };
        } catch (error) {
            return reply.code(404).send({ message: error.message });
        }
    });
}

export default productRoutes;