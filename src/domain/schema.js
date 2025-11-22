import { pgTable, serial, text, integer, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    price: integer('price').notNull(),
});

export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    status: text('status').default('PENDING'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const ordersToProducts = pgTable('orders_to_products', {
    orderId: integer('order_id').references(() => orders.id).notNull(),
    productId: integer('product_id').references(() => products.id).notNull(),
    quantity: integer('quantity').default(1),
}, (t) => ({
    pk: primaryKey(t.orderId, t.productId),
}));


export const usersRelations = relations(users, ({ many }) => ({
    orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    products: many(ordersToProducts),
}));

export const productsRelations = relations(products, ({ many }) => ({
    orders: many(ordersToProducts),
}));

export const ordersToProductsRelations = relations(ordersToProducts, ({ one }) => ({
    order: one(orders, {
        fields: [ordersToProducts.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [ordersToProducts.productId],
        references: [products.id],
    }),
}));