import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAvatarUrl1761300000000 implements MigrationInterface {
  name = 'AddAvatarUrl1761300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of ['customers', 'sellers', 'master_sellers']) {
      await queryRunner.query(
        `ALTER TABLE "${table}" ADD "avatarUrl" text`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of ['master_sellers', 'sellers', 'customers']) {
      await queryRunner.query(
        `ALTER TABLE "${table}" DROP COLUMN "avatarUrl"`,
      );
    }
  }
}
