import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderFieldToMenuTable1743056935045 implements MigrationInterface {
    name = 'AddOrderFieldToMenuTable1743056935045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`menus\` ADD \`order\` int NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`menus\` DROP COLUMN \`order\``);
    }

}
