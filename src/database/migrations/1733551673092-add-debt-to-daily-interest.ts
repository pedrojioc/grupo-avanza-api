import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDebtToDailyInterest1733551673092 implements MigrationInterface {
    name = 'AddDebtToDailyInterest1733551673092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`daily_interest\` ADD \`debt\` decimal(15,2) NOT NULL DEFAULT '0.00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`daily_interest\` DROP COLUMN \`debt\``);
    }

}
