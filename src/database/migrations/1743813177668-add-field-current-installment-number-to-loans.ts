import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldCurrentInstallmentNumberToLoans1743813177668 implements MigrationInterface {
    name = 'AddFieldCurrentInstallmentNumberToLoans1743813177668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`current_installment_number\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`current_installment_number\``);
    }

}
