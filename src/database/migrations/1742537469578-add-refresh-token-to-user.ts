import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUser1742537469578 implements MigrationInterface {
    name = 'AddRefreshTokenToUser1742537469578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`refresh_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`refresh_token\``);
    }

}
