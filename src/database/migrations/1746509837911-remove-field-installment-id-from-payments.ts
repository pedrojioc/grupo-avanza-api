import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveFieldInstallmentIdFromPayments1746509837911 implements MigrationInterface {
    name = 'RemoveFieldInstallmentIdFromPayments1746509837911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_ac948dabe8d9f252302fa73c1e0\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP COLUMN \`installment_id\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_a150bed3d0ff42298b5044c4021\``);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`loan_id\` \`loan_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_a150bed3d0ff42298b5044c4021\` FOREIGN KEY (\`loan_id\`) REFERENCES \`loans\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_a150bed3d0ff42298b5044c4021\``);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`loan_id\` \`loan_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_a150bed3d0ff42298b5044c4021\` FOREIGN KEY (\`loan_id\`) REFERENCES \`loans\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD \`installment_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_ac948dabe8d9f252302fa73c1e0\` FOREIGN KEY (\`installment_id\`) REFERENCES \`installments\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
