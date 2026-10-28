import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductIdsToUuid1761600000000 implements MigrationInterface {
  name = 'ProductIdsToUuid1761600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.query(`
      UPDATE "products"
      SET "id" = gen_random_uuid()::text
      WHERE "id" !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    `);

    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "id" TYPE uuid USING "id"::uuid`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "id" TYPE character varying USING "id"::text`,
    );
  }
}
