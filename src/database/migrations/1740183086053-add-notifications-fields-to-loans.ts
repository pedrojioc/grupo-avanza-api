import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotificationsFieldsToLoans1740183086053 implements MigrationInterface {
    name = 'AddNotificationsFieldsToLoans1740183086053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`is_notifications_paused\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`pause_notifications_until\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`last_notification_sent\` date NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`last_notification_sent\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`pause_notifications_until\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`is_notifications_paused\``);
    }

}
