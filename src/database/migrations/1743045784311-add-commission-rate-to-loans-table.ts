import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommissionRateToLoansTable1743045784311 implements MigrationInterface {
    name = 'AddCommissionRateToLoansTable1743045784311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`commission_rate\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`commission_rate\``);
    }

}
