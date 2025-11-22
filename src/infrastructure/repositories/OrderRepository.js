import { eq } from 'drizzle-orm';
import { db } from '../db.js';
import { orders, ordersToProducts } from '../../domain/schema.js';

class OrderRepository {
    async createOrderWithItems(userId, items) {
        return await db.transaction(async (tx) => {
            const [newOrder] = await tx.insert(orders)
                .values({ userId, status: 'PENDING' })
                .returning();

            if (items && items.length > 0) {
                const orderItemsData = items.map((item) => ({
                    orderId: newOrder.id,
                    productId: item.productId,
                    quantity: item.quantity || 1,
                }));

                await tx.insert(ordersToProducts).values(orderItemsData);
            }

            return newOrder;
        });
    }

    async findById(id) {
        return await db.query.orders.findFirst({
            where: eq(orders.id, id),
            with: {
                user: true,
                products: { 
                    with: {
                        product: true
                    }
                }
            }
        });
    }

    async findAll() {
        return await db.query.orders.findMany({
            with: {
                user: true, 
            }
        });
    }
}

export default new OrderRepository();