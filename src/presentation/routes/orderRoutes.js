import orderService from '../../application/services/OrderService.js';
import { checkAuth } from '../hooks/authHook.js';

const createOrderSchema = {
    description: 'Create a new order with items',
    tags: ['Orders'],
    body: {
        type: 'object',
        required: ['items'],
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
    fastify.register(async function (protectedRoutes) {
        protectedRoutes.addHook('preHandler', checkAuth);

        protectedRoutes.post('/orders', async (req, reply) => {
            const userId = req.user.id;

            const { items } = req.body;

            try {
                const order = await orderService.createOrder({ userId, items });
                return reply.code(201).send(order);
            } catch (error) {
                return reply.code(500).send({ message: error.message });
            }
        });

        protectedRoutes.get('/orders/:id', {
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
    });
}

export default orderRoutes;