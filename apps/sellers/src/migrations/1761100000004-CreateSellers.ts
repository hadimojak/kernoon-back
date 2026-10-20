import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSellers1761100000004 implements MigrationInterface {
  name = 'CreateSellers1761100000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(`
      CREATE TABLE "seller_applications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "shop" character varying NOT NULL,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "phone" character varying NOT NULL DEFAULT '',
        "province" character varying NOT NULL DEFAULT '',
        "city" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_seller_applications" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "seller_applications"');
  }
}
