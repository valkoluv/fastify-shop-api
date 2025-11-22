import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

import userRoutes from './presentation/routes/userRoutes.js';
import orderRoutes from './presentation/routes/orderRoutes.js';
import productRoutes from './presentation/routes/productRoutes.js';

const fastify = Fastify({
    logger: true
});

await fastify.register(fastifySwagger, {
    swagger: {
        info: {
            title: 'Shop API (Drizzle + Fastify)',
            description: 'API documentation for Practicum 5',
            version: '1.0.0'
        },
        host: 'localhost:3000',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
    }
});

await fastify.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false
    },
});

fastify.register(userRoutes);
fastify.register(orderRoutes);
fastify.register(productRoutes);

try {
    await fastify.listen({ port: 3000 });
    console.log('Server running at http://localhost:3000');
    console.log('Documentation available at http://localhost:3000/documentation');
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}