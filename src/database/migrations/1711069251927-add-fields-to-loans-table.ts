import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsToLoansTable1711069251927 implements MigrationInterface {
    name = 'AddFieldsToLoansTable1711069251927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`accumulated_interests\` decimal(2) NOT NULL COMMENT 'Current interest generated since the last payment date'`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`last_payment\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_paid\` \`interest_paid\` decimal(2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_paid\` \`interest_paid\` decimal(2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`last_payment\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`accumulated_interests\``);
    }

}
