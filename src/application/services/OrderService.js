import orderRepository from '../../infrastructure/repositories/OrderRepository.js';

class OrderService {
    async createOrder(data) {
        return await orderRepository.createOrderWithItems(data.userId, data.items);
    }

    async getOrderDetails(id) {
        const order = await orderRepository.findById(id);
        if (!order) throw new Error('Order not found');
        return order;
    }
}

export default new OrderService();