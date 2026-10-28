import { MigrationInterface, QueryRunner } from 'typeorm';

const remaps: [string, string][] = [
  ['onesie', 'b0000000-0000-4000-8000-000000000001'],
  ['tee', 'b0000000-0000-4000-8000-000000000002'],
  ['cardigan', 'b0000000-0000-4000-8000-000000000003'],
  ['joggers', 'b0000000-0000-4000-8000-000000000004'],
  ['sleep', 'b0000000-0000-4000-8000-000000000005'],
  ['overalls', 'b0000000-0000-4000-8000-000000000006'],
  ['hoodie', 'b0000000-0000-4000-8000-000000000007'],
  ['dress', 'b0000000-0000-4000-8000-000000000008'],
];

export class ProductIdsToUuid1761600000000 implements MigrationInterface {
  name = 'ProductIdsToUuid1761600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    for (const [from, to] of remaps) {
      await queryRunner.query(
        `UPDATE "products" SET "id" = $1 WHERE "id" = $2`,
        [to, from],
      );
    }

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
    for (const [from, to] of remaps) {
      await queryRunner.query(
        `UPDATE "products" SET "id" = $1 WHERE "id" = $2`,
        [from, to],
      );
    }
  }
}
