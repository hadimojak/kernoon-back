import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsername1761200000000 implements MigrationInterface {
  name = 'AddUsername1761200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of ['customers', 'sellers', 'master_sellers']) {
      await queryRunner.query(
        `ALTER TABLE "${table}" ADD "username" character varying`,
      );
    }
    await queryRunner.query(
      `UPDATE "customers" SET "username" = 'hadi' WHERE "email" = 'hadimojak@gmail.com' AND "username" IS NULL`,
    );
    await queryRunner.query(
      `UPDATE "sellers" SET "username" = 'seller' WHERE "email" = 'seller@kernoon.test' AND "username" IS NULL`,
    );
    await queryRunner.query(
      `UPDATE "master_sellers" SET "username" = 'owner' WHERE "email" = 'owner@kernoon.test' AND "username" IS NULL`,
    );
    for (const table of ['customers', 'sellers', 'master_sellers']) {
      await queryRunner.query(
        `ALTER TABLE "${table}" ADD CONSTRAINT "UQ_${table}_username" UNIQUE ("username")`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of ['master_sellers', 'sellers', 'customers']) {
      await queryRunner.query(
        `ALTER TABLE "${table}" DROP CONSTRAINT "UQ_${table}_username"`,
      );
      await queryRunner.query(`ALTER TABLE "${table}" DROP COLUMN "username"`);
    }
  }
}
