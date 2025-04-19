import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldPaymentDateToInstallments1745045517833 implements MigrationInterface {
    name = 'AddFieldPaymentDateToInstallments1745045517833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`installments\` ADD \`payment_date\` date NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`installments\` DROP COLUMN \`payment_date\``);
    }

}
