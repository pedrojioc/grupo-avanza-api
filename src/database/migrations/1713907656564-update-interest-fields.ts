import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInterestFields1713907656564 implements MigrationInterface {
    name = 'UpdateInterestFields1713907656564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`amount\` \`amount\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_rate\` \`interest_rate\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`debt\` \`debt\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`current_interest\` \`current_interest\` decimal(15) NOT NULL COMMENT 'Current interest generated since the last payment date' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`total_interest_paid\` \`total_interest_paid\` decimal(15) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`interests\` DROP FOREIGN KEY \`FK_39049601d4b2fa7c02d34393471\``);
        await queryRunner.query(`ALTER TABLE \`interests\` DROP FOREIGN KEY \`FK_477042e18335cc99742a5c08f5e\``);
        await queryRunner.query(`ALTER TABLE \`interests\` CHANGE \`amount\` \`amount\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`interests\` CHANGE \`capital\` \`capital\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`interests\` CHANGE \`loan_id\` \`loan_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`interests\` CHANGE \`interest_state_id\` \`interest_state_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`interests\` ADD CONSTRAINT \`FK_39049601d4b2fa7c02d34393471\` FOREIGN KEY (\`loan_id\`) REFERENCES \`loans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`interests\` ADD CONSTRAINT \`FK_477042e18335cc99742a5c08f5e\` FOREIGN KEY (\`interest_state_id\`) REFERENCES \`interest_state\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`interests\` DROP FOREIGN KEY \`FK_477042e18335cc99742a5c08f5e\``);
        await queryRunner.query(`ALTER TABLE \`interests\` DROP FOREIGN KEY \`FK_39049601d4b2fa7c02d34393471\``);
        await queryRunner.query(`ALTER TABLE \`interests\` CHANGE \`interest_state_id\` \`interest_state_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`interests\` CHANGE \`loan_id\` \`loan_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`interests\` CHANGE \`capital\` \`capital\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`interests\` CHANGE \`amount\` \`amount\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`interests\` ADD CONSTRAINT \`FK_477042e18335cc99742a5c08f5e\` FOREIGN KEY (\`interest_state_id\`) REFERENCES \`interest_state\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`interests\` ADD CONSTRAINT \`FK_39049601d4b2fa7c02d34393471\` FOREIGN KEY (\`loan_id\`) REFERENCES \`loans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`total_interest_paid\` \`total_interest_paid\` decimal(15) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`current_interest\` \`current_interest\` decimal(15) NOT NULL COMMENT 'Current interest generated since the last payment date' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`debt\` \`debt\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_rate\` \`interest_rate\` decimal(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`amount\` \`amount\` decimal(15) NOT NULL`);
    }

}
