import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTelegramFieldsToUsers1742014871834 implements MigrationInterface {
    name = 'AddTelegramFieldsToUsers1742014871834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`chatId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`verification_code\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`verificationCodeExpires\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`verificationCodeExpires\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`verification_code\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`chatId\``);
    }

}
