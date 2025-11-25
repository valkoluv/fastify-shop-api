import externalService from '../../application/services/ExternalService.js';

async function externalRoutes(fastify, options) {
    fastify.get('/external-posts', async (req, reply) => {
        try {
            const posts = await externalService.getExternalPosts();
            return { source: 'jsonplaceholder', data: posts };
        } catch (err) {
            return reply.code(502).send({ message: 'External service unavailable' });
        }
    });
}

export default externalRoutes;