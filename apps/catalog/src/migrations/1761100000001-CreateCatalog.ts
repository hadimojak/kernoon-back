import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCatalog1761100000001 implements MigrationInterface {
  name = 'CreateCatalog1761100000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" character varying NOT NULL,
        "name" character varying NOT NULL,
        "nameFa" character varying NOT NULL,
        "usd" integer NOT NULL,
        "toman" integer NOT NULL,
        "image" character varying NOT NULL,
        "category" character varying NOT NULL,
        "sizes" text NOT NULL,
        "stock" integer NOT NULL,
        "description" text NOT NULL,
        "position" integer NOT NULL,
        CONSTRAINT "PK_products" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "products"');
  }
}
