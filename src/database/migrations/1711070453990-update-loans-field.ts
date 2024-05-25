import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLoansField1711070453990 implements MigrationInterface {
    name = 'UpdateLoansField1711070453990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`accumulated_interests\` \`accumulated_interests\` decimal(2) NOT NULL COMMENT 'Current interest generated since the last payment date' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`last_payment\` \`last_payment\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`last_payment\` \`last_payment\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`accumulated_interests\` \`accumulated_interests\` decimal(2) NOT NULL COMMENT 'Current interest generated since the last payment date'`);
    }

}
