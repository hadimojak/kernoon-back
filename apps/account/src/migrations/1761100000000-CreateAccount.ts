import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccount1761100000000 implements MigrationInterface {
  name = 'CreateAccount1761100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(`
      CREATE TABLE "addresses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" character varying NOT NULL,
        "fullName" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "province" character varying NOT NULL,
        "city" character varying NOT NULL,
        "postalCode" character varying NOT NULL,
        "street" character varying NOT NULL,
        "plaque" character varying NOT NULL DEFAULT '',
        "unit" character varying NOT NULL DEFAULT '',
        "isDefault" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_addresses" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "shetab_cards" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" character varying NOT NULL,
        "holderName" character varying NOT NULL,
        "bank" character varying NOT NULL,
        "last4" character varying NOT NULL,
        "expMonth" integer NOT NULL,
        "expYear" integer NOT NULL,
        "isDefault" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_shetab_cards" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_addresses_userId" ON "addresses" ("userId")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_shetab_cards_userId" ON "shetab_cards" ("userId")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "shetab_cards"');
    await queryRunner.query('DROP TABLE "addresses"');
  }
}
