import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameFieldOnLoansTable1711054004521 implements MigrationInterface {
    name = 'RenameFieldOnLoansTable1711054004521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interestRate\` \`interest_rate\` decimal(1) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`interest_rate\` \`interestRate\` decimal(1) NOT NULL`);
    }

}
