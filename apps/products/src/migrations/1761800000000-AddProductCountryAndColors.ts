import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductCountryAndColors1761800000000
  implements MigrationInterface
{
  name = 'AddProductCountryAndColors1761800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "colors" text NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "countryOfOrigin" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "countryOfOrigin"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "colors"`);
  }
}
