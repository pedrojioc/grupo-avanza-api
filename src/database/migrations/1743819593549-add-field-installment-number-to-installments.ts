import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldInstallmentNumberToInstallments1743819593549 implements MigrationInterface {
    name = 'AddFieldInstallmentNumberToInstallments1743819593549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`installments\` ADD \`installment_number\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`installments\` DROP COLUMN \`installment_number\``);
    }

}
