import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIdentityUsers1760881800000 implements MigrationInterface {
  name = 'CreateIdentityUsers1760881800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "email" character varying,
        "phone" character varying,
        "gender" character varying NOT NULL DEFAULT '',
        "passwordHash" character varying,
        "googleSubject" character varying,
        "emailVerified" boolean NOT NULL DEFAULT false,
        "phoneVerified" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_customers" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_customers_email" UNIQUE ("email")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "sellers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "email" character varying,
        "phone" character varying,
        "gender" character varying NOT NULL DEFAULT '',
        "passwordHash" character varying,
        "googleSubject" character varying,
        "emailVerified" boolean NOT NULL DEFAULT false,
        "phoneVerified" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "masterSellerId" character varying NOT NULL,
        CONSTRAINT "PK_sellers" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_sellers_email" UNIQUE ("email")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "master_sellers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "email" character varying,
        "phone" character varying,
        "gender" character varying NOT NULL DEFAULT '',
        "passwordHash" character varying,
        "googleSubject" character varying,
        "emailVerified" boolean NOT NULL DEFAULT false,
        "phoneVerified" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "businessName" character varying NOT NULL,
        CONSTRAINT "PK_master_sellers" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_master_sellers_email" UNIQUE ("email")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "master_sellers"');
    await queryRunner.query('DROP TABLE "sellers"');
    await queryRunner.query('DROP TABLE "customers"');
  }
}
