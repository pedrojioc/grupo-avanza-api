import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDuesTable1714431185403 implements MigrationInterface {
    name = 'AddDuesTable1714431185403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`dues\` (\`id\` int NOT NULL AUTO_INCREMENT, \`capital\` decimal(15,2) NOT NULL, \`interest\` decimal(15,2) NOT NULL, \`total\` decimal(15,2) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`loan_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`dues\` ADD CONSTRAINT \`FK_0a4646ce82e0f6688f83de53d09\` FOREIGN KEY (\`loan_id\`) REFERENCES \`loans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dues\` DROP FOREIGN KEY \`FK_0a4646ce82e0f6688f83de53d09\``);
        await queryRunner.query(`DROP TABLE \`dues\``);
    }

}
