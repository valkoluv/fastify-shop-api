import redis from '../../adapters/redis/index.js';

class ExternalService {
    async getExternalPosts() {
        const cacheKey = 'external:posts';

        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                console.log('⚡ External API: Returning from Cache');
                return JSON.parse(cached);
            }
        } catch (err) {
            console.error('Redis error:', err);
        }

        console.log('🌍 External API: Fetching from internet...');
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');

        if (!response.ok) {
            throw new Error('Failed to fetch external data');
        }

        const data = await response.json();
        try {
            await redis.set(cacheKey, JSON.stringify(data), 'EX', 300);
        } catch (err) {
            console.error('Redis save error:', err);
        }

        return data;
    }
}

export default new ExternalService();