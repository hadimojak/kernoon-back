import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductSizeGuide1761700000000 implements MigrationInterface {
  name = 'AddProductSizeGuide1761700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "sizeGuide" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "sizeGuide"`,
    );
  }
}
