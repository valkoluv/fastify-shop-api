import userService from '../../application/services/UserService.js';

const createUserSchema = {
    description: 'Create a new user',
    tags: ['Users'],
    body: {
        type: 'object',
        required: ['email'],
        properties: {
            email: { type: 'string', format: 'email' },
            name: { type: 'string' }
        }
    },
    response: {
        201: {
            description: 'User created',
            type: 'object',
            properties: {
                id: { type: 'integer' },
                email: { type: 'string' },
                name: { type: 'string' }
            }
        }
    }
};

async function userRoutes(fastify, options) {

    fastify.post('/users', { schema: createUserSchema }, async (request, reply) => {
        const user = await userService.registerUser(request.body);
        return reply.code(201).send(user);
    });

    fastify.get('/users/:id', {
        schema: {
            tags: ['Users'],
            params: {
                type: 'object',
                properties: { id: { type: 'integer' } }
            }
        }
    }, async (request, reply) => {
        try {
            return await userService.getUserById(Number(request.params.id));
        } catch (error) {
            return reply.code(404).send({ message: error.message });
        }
    });

    fastify.get('/users', { schema: { tags: ['Users'] } }, async (req, reply) => {
        return await userService.getAllUsers();
    });

    fastify.put('/users/:id', {
        schema: {
            tags: ['Users'],
            params: {
                type: 'object',
                properties: { id: { type: 'integer' } }
            },
            body: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    name: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const updatedUser = await userService.updateUser(Number(request.params.id), request.body);
            return updatedUser;
        } catch (error) {
            return reply.code(404).send({ message: error.message });
        }
    });

    fastify.delete('/users/:id', {
        schema: {
            tags: ['Users'],
            params: {
                type: 'object',
                properties: { id: { type: 'integer' } }
            }
        }
    }, async (request, reply) => {
        try {
            await userService.deleteUser(Number(request.params.id));
            return reply.code(204).send();
        } catch (error) {
            return reply.code(404).send({ message: error.message });
        }
    });
}

export default userRoutes;