import { describe, it, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import orderService from '../../src/application/services/OrderService.js';
import orderRepository from '../../src/infrastructure/repositories/OrderRepository.js';

describe('OrderService Suite', () => {

    afterEach(() => {
        mock.reset();
    });

    describe('createOrder()', () => {
        it('should call repository with correct data', async () => {
            const inputData = { userId: 5, items: [{ productId: 1, quantity: 2 }] };
            const expectedOrder = { id: 101, userId: 5, status: 'PENDING' };

            const repoMock = mock.method(orderRepository, 'createOrderWithItems', async () => expectedOrder);

            const result = await orderService.createOrder(inputData);

            assert.strictEqual(result.id, 101);

            assert.strictEqual(repoMock.mock.calls.length, 1);

            const args = repoMock.mock.calls[0].arguments;
            assert.strictEqual(args[0], 5);
            assert.deepStrictEqual(args[1], inputData.items);
        });
    });
});