import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldIsVisibleToOptionsTable1712962178501 implements MigrationInterface {
    name = 'AddFieldIsVisibleToOptionsTable1712962178501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`options\` ADD \`is_visible\` tinyint NOT NULL COMMENT 'Determina si se muestra en el menú o no' DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`amount\` \`amount\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_rate\` \`interest_rate\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`debt\` \`debt\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`accumulated_interests\` \`accumulated_interests\` decimal(15) NOT NULL COMMENT 'Current interest generated since the last payment date' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_paid\` \`interest_paid\` decimal(15) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_paid\` \`interest_paid\` decimal(15) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`accumulated_interests\` \`accumulated_interests\` decimal(15) NOT NULL COMMENT 'Current interest generated since the last payment date' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`debt\` \`debt\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_rate\` \`interest_rate\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`amount\` \`amount\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`options\` DROP COLUMN \`is_visible\``);
    }

}
