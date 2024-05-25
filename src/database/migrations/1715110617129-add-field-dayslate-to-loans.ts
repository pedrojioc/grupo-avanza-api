import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldDayslateToLoans1715110617129 implements MigrationInterface {
    name = 'AddFieldDayslateToLoans1715110617129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`days_late\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`days_late\``);
    }

}
