import orderService from '../../application/services/OrderService.js';

const createOrderSchema = {
    description: 'Create a new order with items',
    tags: ['Orders'],
    body: {
        type: 'object',
        required: ['userId', 'items'],
        properties: {
            userId: { type: 'integer' },
            items: {
                type: 'array',
                items: {
                    type: 'object',
                    required: ['productId', 'quantity'],
                    properties: {
                        productId: { type: 'integer' },
                        quantity: { type: 'integer', minimum: 1 }
                    }
                }
            }
        }
    },
    response: {
        201: {
            description: 'Order created successfully',
            type: 'object',
            properties: {
                id: { type: 'integer' },
                status: { type: 'string' },
                userId: { type: 'integer' }
            }
        }
    }
};

async function orderRoutes(fastify, options) {
    fastify.post('/orders', { schema: createOrderSchema }, async (request, reply) => {
        try {
            const order = await orderService.createOrder(request.body);
            return reply.code(201).send(order);
        } catch (error) {
            return reply.code(500).send({ message: error.message });
        }
    });

    fastify.get('/orders/:id', {
        schema: {
            tags: ['Orders'],
            params: {
                type: 'object',
                properties: { id: { type: 'integer' } }
            }
        }
    }, async (request, reply) => {
        try {
            return await orderService.getOrderDetails(Number(request.params.id));
        } catch (err) {
            return reply.code(404).send({ message: err.message });
        }
    });
}

export default orderRoutes;