import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDuesTable1714840276086 implements MigrationInterface {
    name = 'AddDuesTable1714840276086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dues\` ADD \`debt\` decimal(15,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`dues\` ADD \`start_at\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`dues\` ADD \`deadline\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`dues\` DROP FOREIGN KEY \`FK_0a4646ce82e0f6688f83de53d09\``);
        await queryRunner.query(`ALTER TABLE \`dues\` CHANGE \`loan_id\` \`loan_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`dues\` ADD CONSTRAINT \`FK_0a4646ce82e0f6688f83de53d09\` FOREIGN KEY (\`loan_id\`) REFERENCES \`loans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dues\` DROP FOREIGN KEY \`FK_0a4646ce82e0f6688f83de53d09\``);
        await queryRunner.query(`ALTER TABLE \`dues\` CHANGE \`loan_id\` \`loan_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`dues\` ADD CONSTRAINT \`FK_0a4646ce82e0f6688f83de53d09\` FOREIGN KEY (\`loan_id\`) REFERENCES \`loans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dues\` DROP COLUMN \`deadline\``);
        await queryRunner.query(`ALTER TABLE \`dues\` DROP COLUMN \`start_at\``);
        await queryRunner.query(`ALTER TABLE \`dues\` DROP COLUMN \`debt\``);
    }

}
