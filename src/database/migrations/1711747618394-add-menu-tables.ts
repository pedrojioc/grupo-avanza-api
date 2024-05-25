import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMenuTables1711747618394 implements MigrationInterface {
    name = 'AddMenuTables1711747618394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`menus\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`icon\` varchar(100) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`options\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`path\` varchar(100) NOT NULL, \`icon\` varchar(100) NOT NULL, \`order\` int NOT NULL DEFAULT '0', \`menu_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles_options\` (\`role_id\` int NOT NULL, \`option_id\` int NOT NULL, INDEX \`IDX_79d5662f3d3f0b0b313ec47b73\` (\`role_id\`), INDEX \`IDX_e70326512a9e171fce968918d8\` (\`option_id\`), PRIMARY KEY (\`role_id\`, \`option_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`amount\` \`amount\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_rate\` \`interest_rate\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`debt\` \`debt\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`accumulated_interests\` \`accumulated_interests\` decimal(15) NOT NULL COMMENT 'Current interest generated since the last payment date' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_paid\` \`interest_paid\` decimal(15) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`options\` ADD CONSTRAINT \`FK_fe3976809040211dbbf2009a203\` FOREIGN KEY (\`menu_id\`) REFERENCES \`menus\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`roles_options\` ADD CONSTRAINT \`FK_79d5662f3d3f0b0b313ec47b730\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`roles_options\` ADD CONSTRAINT \`FK_e70326512a9e171fce968918d80\` FOREIGN KEY (\`option_id\`) REFERENCES \`options\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`roles_options\` DROP FOREIGN KEY \`FK_e70326512a9e171fce968918d80\``);
        await queryRunner.query(`ALTER TABLE \`roles_options\` DROP FOREIGN KEY \`FK_79d5662f3d3f0b0b313ec47b730\``);
        await queryRunner.query(`ALTER TABLE \`options\` DROP FOREIGN KEY \`FK_fe3976809040211dbbf2009a203\``);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_paid\` \`interest_paid\` decimal(15) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`accumulated_interests\` \`accumulated_interests\` decimal(15) NOT NULL COMMENT 'Current interest generated since the last payment date' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`debt\` \`debt\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_rate\` \`interest_rate\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`amount\` \`amount\` decimal(15) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_e70326512a9e171fce968918d8\` ON \`roles_options\``);
        await queryRunner.query(`DROP INDEX \`IDX_79d5662f3d3f0b0b313ec47b73\` ON \`roles_options\``);
        await queryRunner.query(`DROP TABLE \`roles_options\``);
        await queryRunner.query(`DROP TABLE \`options\``);
        await queryRunner.query(`DROP TABLE \`menus\``);
    }

}
