import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentsTable1740034862884 implements MigrationInterface {
    name = 'AddPaymentsTable1740034862884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`installments\` DROP FOREIGN KEY \`FK_9f726d476ac71bd917681477d41\``);
        await queryRunner.query(`CREATE TABLE \`payments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`installment_id\` int NOT NULL, \`payment_method_id\` int NULL, \`capital\` decimal(15,2) NOT NULL COMMENT 'Monto abonado a capital', \`interest\` decimal(15,2) NOT NULL COMMENT 'Intereses totales cancelados (en caso de que se pague más de una cuota, será la suma de los intereses de dichas cuotas)', \`total\` decimal(15,2) NOT NULL COMMENT 'Monto total abonado', \`date\` date NOT NULL, \`is_received\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`installment_payments\` (\`payment_id\` int NOT NULL, \`installment_id\` int NOT NULL, INDEX \`IDX_d5540b7f05a88a8f1664a43a0e\` (\`payment_id\`), INDEX \`IDX_c4409df6e1d10b19e71fa5fe13\` (\`installment_id\`), PRIMARY KEY (\`payment_id\`, \`installment_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`installments\` DROP COLUMN \`payment_method_id\``);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_ac948dabe8d9f252302fa73c1e0\` FOREIGN KEY (\`installment_id\`) REFERENCES \`installments\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_12fd861c33c885f01b9a7da7d93\` FOREIGN KEY (\`payment_method_id\`) REFERENCES \`payment_methods\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`installment_payments\` ADD CONSTRAINT \`FK_d5540b7f05a88a8f1664a43a0ef\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payments\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`installment_payments\` ADD CONSTRAINT \`FK_c4409df6e1d10b19e71fa5fe131\` FOREIGN KEY (\`installment_id\`) REFERENCES \`installments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`installment_payments\` DROP FOREIGN KEY \`FK_c4409df6e1d10b19e71fa5fe131\``);
        await queryRunner.query(`ALTER TABLE \`installment_payments\` DROP FOREIGN KEY \`FK_d5540b7f05a88a8f1664a43a0ef\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_12fd861c33c885f01b9a7da7d93\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_ac948dabe8d9f252302fa73c1e0\``);
        await queryRunner.query(`ALTER TABLE \`installments\` ADD \`payment_method_id\` int NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_c4409df6e1d10b19e71fa5fe13\` ON \`installment_payments\``);
        await queryRunner.query(`DROP INDEX \`IDX_d5540b7f05a88a8f1664a43a0e\` ON \`installment_payments\``);
        await queryRunner.query(`DROP TABLE \`installment_payments\``);
        await queryRunner.query(`DROP TABLE \`payments\``);
        await queryRunner.query(`ALTER TABLE \`installments\` ADD CONSTRAINT \`FK_9f726d476ac71bd917681477d41\` FOREIGN KEY (\`payment_method_id\`) REFERENCES \`payment_methods\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
