import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldToInterestsTable1717024488108 implements MigrationInterface {
    name = 'AddFieldToInterestsTable1717024488108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`interests\` ADD \`last_interest_generated\` date NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`interests\` DROP COLUMN \`last_interest_generated\``);
    }

}
