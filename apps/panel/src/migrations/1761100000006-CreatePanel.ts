import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePanel1761100000006 implements MigrationInterface {
  name = 'CreatePanel1761100000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(`
      CREATE TABLE "listings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "sellerId" character varying NOT NULL,
        "name" character varying NOT NULL,
        "nameFa" character varying NOT NULL,
        "toman" integer NOT NULL,
        "category" character varying NOT NULL,
        "sizes" text NOT NULL,
        "stock" integer NOT NULL,
        "image" character varying NOT NULL DEFAULT '/clothes/onesie.svg',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_listings" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "shop_customers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "sellerId" character varying NOT NULL,
        "name" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "province" character varying NOT NULL,
        "city" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_shop_customers" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_listings_sellerId" ON "listings" ("sellerId")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_shop_customers_sellerId" ON "shop_customers" ("sellerId")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "shop_customers"');
    await queryRunner.query('DROP TABLE "listings"');
  }
}
