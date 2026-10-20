import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePayments1761100000005 implements MigrationInterface {
  name = 'CreatePayments1761100000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(`
      CREATE TABLE "charges" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" character varying NOT NULL,
        "orderId" character varying NOT NULL,
        "amountToman" integer NOT NULL,
        "gateway" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "authority" character varying NOT NULL DEFAULT '',
        "refId" character varying NOT NULL DEFAULT '',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_charges" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_charges_userId" ON "charges" ("userId")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "charges"');
  }
}
