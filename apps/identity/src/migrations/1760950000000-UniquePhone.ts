import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniquePhone1760950000000 implements MigrationInterface {
  name = 'UniquePhone1760950000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of ['customers', 'sellers', 'master_sellers']) {
      await queryRunner.query(
        `UPDATE "${table}" SET "phone" = NULL WHERE "phone" = ''`,
      );
      await queryRunner.query(
        `ALTER TABLE "${table}" ADD CONSTRAINT "UQ_${table}_phone" UNIQUE ("phone")`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of ['master_sellers', 'sellers', 'customers']) {
      await queryRunner.query(
        `ALTER TABLE "${table}" DROP CONSTRAINT "UQ_${table}_phone"`,
      );
    }
  }
}
