import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInterestsTableAndStates1713546573872 implements MigrationInterface {
    name = 'AddInterestsTableAndStates1713546573872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`interest_state\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`interests\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(15) NOT NULL, \`date\` date NOT NULL, \`days\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`loan_id\` int NULL, \`interest_state_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`amount\` \`amount\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_rate\` \`interest_rate\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`debt\` \`debt\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`accumulated_interests\` \`accumulated_interests\` decimal(15) NOT NULL COMMENT 'Current interest generated since the last payment date' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_paid\` \`interest_paid\` decimal(15) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`interests\` ADD CONSTRAINT \`FK_39049601d4b2fa7c02d34393471\` FOREIGN KEY (\`loan_id\`) REFERENCES \`loans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`interests\` ADD CONSTRAINT \`FK_477042e18335cc99742a5c08f5e\` FOREIGN KEY (\`interest_state_id\`) REFERENCES \`interest_state\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`interests\` DROP FOREIGN KEY \`FK_477042e18335cc99742a5c08f5e\``);
        await queryRunner.query(`ALTER TABLE \`interests\` DROP FOREIGN KEY \`FK_39049601d4b2fa7c02d34393471\``);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_paid\` \`interest_paid\` decimal(15) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`accumulated_interests\` \`accumulated_interests\` decimal(15) NOT NULL COMMENT 'Current interest generated since the last payment date' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`debt\` \`debt\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_rate\` \`interest_rate\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`amount\` \`amount\` decimal(15) NOT NULL`);
        await queryRunner.query(`DROP TABLE \`interests\``);
        await queryRunner.query(`DROP TABLE \`interest_state\``);
    }

}
