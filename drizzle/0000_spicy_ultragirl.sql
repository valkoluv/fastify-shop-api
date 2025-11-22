CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"status" text DEFAULT 'PENDING',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders_to_products" (
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer DEFAULT 1,
	CONSTRAINT "orders_to_products_order_id_product_id_pk" PRIMARY KEY("order_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_to_products" ADD CONSTRAINT "orders_to_products_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_to_products" ADD CONSTRAINT "orders_to_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;