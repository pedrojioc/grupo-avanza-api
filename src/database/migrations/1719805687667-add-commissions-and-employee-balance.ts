import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommissionsAndEmployeeBalance1719805687667 implements MigrationInterface {
    name = 'AddCommissionsAndEmployeeBalance1719805687667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`employee_balances\` (\`id\` int NOT NULL AUTO_INCREMENT, \`employee_id\` int NOT NULL, \`balance\` decimal(15,2) NOT NULL DEFAULT '0.00', \`total_paid\` decimal(15,2) NOT NULL DEFAULT '0.00', \`commissions_paid\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_4a110620f81f58e0aba1e9f892\` (\`employee_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`commissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`interest_amount\` decimal(15,2) NOT NULL, \`amount\` decimal(15,2) NOT NULL, \`rate\` int NOT NULL, \`is_paid\` tinyint NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`employee_id\` int NOT NULL, \`installment_id\` int NOT NULL, UNIQUE INDEX \`REL_7faaaed94b7423d43a24e27b93\` (\`installment_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`commissions_paid\` decimal(15,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`employee_balances\` ADD CONSTRAINT \`FK_4a110620f81f58e0aba1e9f892e\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employees\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`commissions\` ADD CONSTRAINT \`FK_e5933fb654b3eff6d50809cd441\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employees\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`commissions\` ADD CONSTRAINT \`FK_7faaaed94b7423d43a24e27b938\` FOREIGN KEY (\`installment_id\`) REFERENCES \`installments\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`commissions\` DROP FOREIGN KEY \`FK_7faaaed94b7423d43a24e27b938\``);
        await queryRunner.query(`ALTER TABLE \`commissions\` DROP FOREIGN KEY \`FK_e5933fb654b3eff6d50809cd441\``);
        await queryRunner.query(`ALTER TABLE \`employee_balances\` DROP FOREIGN KEY \`FK_4a110620f81f58e0aba1e9f892e\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`commissions_paid\``);
        await queryRunner.query(`DROP INDEX \`REL_7faaaed94b7423d43a24e27b93\` ON \`commissions\``);
        await queryRunner.query(`DROP TABLE \`commissions\``);
        await queryRunner.query(`DROP INDEX \`REL_4a110620f81f58e0aba1e9f892\` ON \`employee_balances\``);
        await queryRunner.query(`DROP TABLE \`employee_balances\``);
    }

}
