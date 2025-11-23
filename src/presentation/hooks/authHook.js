import authService from '../../application/services/AuthService.js';

export const checkAuth = async (request, reply) => {
    const token = request.cookies.sessionId;

    if (!token) {
        return reply.code(401).send({ message: 'Unauthorized: No session token' });
    }

    const session = await authService.getSession(token);

    if (!session) {
        return reply.code(401).send({ message: 'Unauthorized: Invalid or expired session' });
    }

    request.user = session.user;
};