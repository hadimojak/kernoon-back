import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrders1761100000003 implements MigrationInterface {
  name = 'CreateOrders1761100000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(`
      CREATE TABLE "shop_orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'placed',
        "totalUsd" integer NOT NULL,
        "totalToman" integer NOT NULL,
        "address" jsonb NOT NULL,
        "payment" jsonb NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_shop_orders" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "shop_order_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "orderId" uuid NOT NULL,
        "productId" character varying NOT NULL,
        "name" character varying NOT NULL,
        "size" character varying NOT NULL,
        "tier" character varying NOT NULL,
        "quantity" integer NOT NULL,
        "unitPriceUsd" integer NOT NULL,
        "unitPriceToman" integer NOT NULL,
        "lineUsd" integer NOT NULL,
        "lineToman" integer NOT NULL,
        CONSTRAINT "PK_shop_order_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_shop_order_items_order" FOREIGN KEY ("orderId") REFERENCES "shop_orders" ("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_shop_orders_userId" ON "shop_orders" ("userId")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "shop_order_items"');
    await queryRunner.query('DROP TABLE "shop_orders"');
  }
}
