import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameLoansFields1713835537026 implements MigrationInterface {
    name = 'RenameLoansFields1713835537026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`interest_paid\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`accumulated_interests\``);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`current_interest\` decimal(15) NOT NULL COMMENT 'Current interest generated since the last payment date' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`total_interest_paid\` decimal(15) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`amount\` \`amount\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_rate\` \`interest_rate\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`debt\` \`debt\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`interests\` CHANGE \`amount\` \`amount\` decimal(15) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`interests\` CHANGE \`amount\` \`amount\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`debt\` \`debt\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_rate\` \`interest_rate\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`amount\` \`amount\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`total_interest_paid\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`current_interest\``);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`accumulated_interests\` decimal(15) NOT NULL COMMENT 'Current interest generated since the last payment date' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`interest_paid\` decimal(15) NOT NULL DEFAULT '0'`);
    }

}
