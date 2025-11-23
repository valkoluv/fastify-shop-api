import authService from '../../application/services/AuthService.js';

const registerSchema = {
    description: 'Register a new user',
    tags: ['Auth'],
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            name: { type: 'string' }
        }
    },
    response: {
        201: {
            type: 'object',
            properties: { id: { type: 'integer' }, email: { type: 'string' } }
        }
    }
};

const loginSchema = {
    description: 'Login and receive a cookie',
    tags: ['Auth'],
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: { message: { type: 'string' } }
        }
    }
};

async function authRoutes(fastify, options) {

    fastify.post('/register', { schema: registerSchema }, async (req, reply) => {
        try {
            const { email, name, password } = req.body;
            const user = await authService.register(email, name, password);
            return reply.code(201).send(user);
        } catch (err) {
            return reply.code(400).send({ message: err.message });
        }
    });

    fastify.post('/login', { schema: loginSchema }, async (req, reply) => {
        try {
            const { email, password } = req.body;
            const token = await authService.login(email, password);

            reply.setCookie('sessionId', token, {
                path: '/',
                httpOnly: true, 
                secure: false,  
                sameSite: 'lax',
                maxAge: 86400 
            });

            return { message: 'Logged in successfully' };
        } catch (err) {
            return reply.code(401).send({ message: err.message });
        }
    });

    fastify.get('/info', {
        schema: { tags: ['Auth'], description: 'Get current user info' }
    }, async (req, reply) => {
        const token = req.cookies.sessionId;
        if (!token) return reply.code(401).send({ message: 'No session' });

        const session = await authService.getSession(token);
        if (!session) return reply.code(401).send({ message: 'Invalid session' });

        const { passwordHash, ...safeUser } = session.user;
        return safeUser;
    });

    fastify.post('/logout', {
        schema: { tags: ['Auth'], description: 'Logout' }
    }, async (req, reply) => {
        const token = req.cookies.sessionId;
        if (token) {
            await authService.logout(token);
        }
        reply.clearCookie('sessionId', { path: '/' }); 
        return { message: 'Logged out' };
    });
}

export default authRoutes;