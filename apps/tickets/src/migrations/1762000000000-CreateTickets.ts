import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTickets1762000000000 implements MigrationInterface {
  name = 'CreateTickets1762000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "ticket_widget_settings" (
        "id" uuid NOT NULL,
        "masterSellerId" uuid NOT NULL,
        "enabled" boolean NOT NULL DEFAULT false,
        "updatedBy" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_ticket_widget_master" UNIQUE ("masterSellerId"),
        CONSTRAINT "PK_ticket_widget_settings" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tickets" (
        "id" uuid NOT NULL,
        "kind" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'open',
        "subject" character varying NOT NULL,
        "body" text NOT NULL,
        "customerId" uuid NOT NULL,
        "customerName" character varying NOT NULL DEFAULT '',
        "productId" uuid,
        "productName" character varying NOT NULL DEFAULT '',
        "sellerId" uuid,
        "masterSellerId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tickets" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_tickets_seller" ON "tickets" ("sellerId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tickets_master" ON "tickets" ("masterSellerId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tickets_customer" ON "tickets" ("customerId")`,
    );

    await queryRunner.query(`
      CREATE TABLE "ticket_messages" (
        "id" uuid NOT NULL,
        "ticketId" uuid NOT NULL,
        "senderId" uuid NOT NULL,
        "senderRole" character varying NOT NULL,
        "senderName" character varying NOT NULL DEFAULT '',
        "body" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ticket_messages" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ticket_messages_ticket" FOREIGN KEY ("ticketId")
          REFERENCES "tickets"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_ticket_messages_ticket" ON "ticket_messages" ("ticketId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_ticket_messages_ticket"');
    await queryRunner.query('DROP TABLE "ticket_messages"');
    await queryRunner.query('DROP INDEX "IDX_tickets_customer"');
    await queryRunner.query('DROP INDEX "IDX_tickets_master"');
    await queryRunner.query('DROP INDEX "IDX_tickets_seller"');
    await queryRunner.query('DROP TABLE "tickets"');
    await queryRunner.query('DROP TABLE "ticket_widget_settings"');
  }
}
