import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefinancingTableAndFields1745802664054 implements MigrationInterface {
    name = 'AddRefinancingTableAndFields1745802664054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`refinancing\` (\`id\` int NOT NULL AUTO_INCREMENT, \`previous_amount\` decimal(15,2) NOT NULL, \`new_amount\` decimal(15,2) NOT NULL, \`refinancing_date\` date NOT NULL, \`note\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`origin_loan_id\` int NOT NULL, \`new_loan_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`parent_loan_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`refinancing\` ADD CONSTRAINT \`FK_47bafa7589e7a744d9b515cf9f1\` FOREIGN KEY (\`origin_loan_id\`) REFERENCES \`loans\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`refinancing\` ADD CONSTRAINT \`FK_e6c58f9e19040856f525783d347\` FOREIGN KEY (\`new_loan_id\`) REFERENCES \`loans\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_1c5b9aa9669cb2b59775f44f9c9\` FOREIGN KEY (\`parent_loan_id\`) REFERENCES \`loans\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_1c5b9aa9669cb2b59775f44f9c9\``);
        await queryRunner.query(`ALTER TABLE \`refinancing\` DROP FOREIGN KEY \`FK_e6c58f9e19040856f525783d347\``);
        await queryRunner.query(`ALTER TABLE \`refinancing\` DROP FOREIGN KEY \`FK_47bafa7589e7a744d9b515cf9f1\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`parent_loan_id\``);
        await queryRunner.query(`DROP TABLE \`refinancing\``);
    }

}
