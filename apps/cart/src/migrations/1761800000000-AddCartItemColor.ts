import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCartItemColor1761800000000 implements MigrationInterface {
  name = 'AddCartItemColor1761800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "basket_items" ADD "color" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "basket_items" DROP COLUMN "color"`);
  }
}
