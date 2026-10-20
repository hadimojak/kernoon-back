import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCart1761100000002 implements MigrationInterface {
  name = 'CreateCart1761100000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(`
      CREATE TABLE "baskets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "ownerId" character varying NOT NULL,
        CONSTRAINT "PK_baskets" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_baskets_ownerId" UNIQUE ("ownerId")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "basket_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "basketId" uuid NOT NULL,
        "productId" character varying NOT NULL,
        "size" character varying NOT NULL,
        "tier" character varying NOT NULL,
        "quantity" integer NOT NULL,
        CONSTRAINT "PK_basket_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_basket_items_basket" FOREIGN KEY ("basketId") REFERENCES "baskets" ("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "basket_items"');
    await queryRunner.query('DROP TABLE "baskets"');
  }
}
