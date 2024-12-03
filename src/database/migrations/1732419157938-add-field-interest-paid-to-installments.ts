import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldInterestPaidToInstallments1732419157938 implements MigrationInterface {
    name = 'AddFieldInterestPaidToInstallments1732419157938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`installments\` ADD \`interest_piad\` decimal(15,2) NOT NULL COMMENT 'Pago realizado a intereses' DEFAULT '0.00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`installments\` DROP COLUMN \`interest_piad\``);
    }

}
