import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLoanIdToPaymentsTable1746504999160 implements MigrationInterface {
    name = 'AddLoanIdToPaymentsTable1746504999160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` ADD \`loan_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_a150bed3d0ff42298b5044c4021\` FOREIGN KEY (\`loan_id\`) REFERENCES \`loans\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_a150bed3d0ff42298b5044c4021\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP COLUMN \`loan_id\``);
    }

}
