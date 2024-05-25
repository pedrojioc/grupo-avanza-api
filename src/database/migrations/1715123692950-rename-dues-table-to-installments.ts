import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameDuesTableToInstallments1715123692950 implements MigrationInterface {
    name = 'RenameDuesTableToInstallments1715123692950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`installment_states\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`installments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`debt\` decimal(15,2) NOT NULL, \`capital\` decimal(15,2) NOT NULL COMMENT 'Abono que se hace a la deuda capital', \`interest\` decimal(15,2) NOT NULL, \`total\` decimal(15,2) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`loan_id\` int NOT NULL, \`payment_method_id\` int NOT NULL, \`installment_state_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`installments_interests\` (\`installment_id\` int NOT NULL, \`interest_id\` int NOT NULL, INDEX \`IDX_330b14abc3d156871676c8b78c\` (\`installment_id\`), INDEX \`IDX_c2359ccc2be2d103d6d645e365\` (\`interest_id\`), PRIMARY KEY (\`installment_id\`, \`interest_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`installments\` ADD CONSTRAINT \`FK_6a0de085bb82a1e96164dc1b900\` FOREIGN KEY (\`loan_id\`) REFERENCES \`loans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`installments\` ADD CONSTRAINT \`FK_9f726d476ac71bd917681477d41\` FOREIGN KEY (\`payment_method_id\`) REFERENCES \`payment_methods\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`installments\` ADD CONSTRAINT \`FK_0eb82bf5d8b622fbce52f1b0b4e\` FOREIGN KEY (\`installment_state_id\`) REFERENCES \`installment_states\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`installments_interests\` ADD CONSTRAINT \`FK_330b14abc3d156871676c8b78c2\` FOREIGN KEY (\`installment_id\`) REFERENCES \`installments\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`installments_interests\` ADD CONSTRAINT \`FK_c2359ccc2be2d103d6d645e3655\` FOREIGN KEY (\`interest_id\`) REFERENCES \`interests\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`installments_interests\` DROP FOREIGN KEY \`FK_c2359ccc2be2d103d6d645e3655\``);
        await queryRunner.query(`ALTER TABLE \`installments_interests\` DROP FOREIGN KEY \`FK_330b14abc3d156871676c8b78c2\``);
        await queryRunner.query(`ALTER TABLE \`installments\` DROP FOREIGN KEY \`FK_0eb82bf5d8b622fbce52f1b0b4e\``);
        await queryRunner.query(`ALTER TABLE \`installments\` DROP FOREIGN KEY \`FK_9f726d476ac71bd917681477d41\``);
        await queryRunner.query(`ALTER TABLE \`installments\` DROP FOREIGN KEY \`FK_6a0de085bb82a1e96164dc1b900\``);
        await queryRunner.query(`DROP INDEX \`IDX_c2359ccc2be2d103d6d645e365\` ON \`installments_interests\``);
        await queryRunner.query(`DROP INDEX \`IDX_330b14abc3d156871676c8b78c\` ON \`installments_interests\``);
        await queryRunner.query(`DROP TABLE \`installments_interests\``);
        await queryRunner.query(`DROP TABLE \`installments\``);
        await queryRunner.query(`DROP TABLE \`installment_states\``);
    }

}
