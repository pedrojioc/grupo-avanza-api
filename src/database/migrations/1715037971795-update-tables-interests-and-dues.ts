import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTablesInterestsAndDues1715037971795 implements MigrationInterface {
    name = 'UpdateTablesInterestsAndDues1715037971795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`interests\` DROP COLUMN \`date\``);
        await queryRunner.query(`ALTER TABLE \`dues\` DROP COLUMN \`deadline\``);
        await queryRunner.query(`ALTER TABLE \`dues\` DROP COLUMN \`start_at\``);
        await queryRunner.query(`ALTER TABLE \`interests\` ADD \`start_at\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`interests\` ADD \`deadline\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`dues\` CHANGE \`capital\` \`capital\` decimal(15,2) NOT NULL COMMENT 'Abono que se hace a la deuda capital'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dues\` CHANGE \`capital\` \`capital\` decimal(15,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`interests\` DROP COLUMN \`deadline\``);
        await queryRunner.query(`ALTER TABLE \`interests\` DROP COLUMN \`start_at\``);
        await queryRunner.query(`ALTER TABLE \`dues\` ADD \`start_at\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`dues\` ADD \`deadline\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`interests\` ADD \`date\` date NOT NULL`);
    }

}
