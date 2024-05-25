import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsToLoansTable1711053931105 implements MigrationInterface {
    name = 'AddFieldsToLoansTable1711053931105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`customerId\``);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`amount\` decimal(2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`interestRate\` decimal(1) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`installments\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`payment_deadline\` int NOT NULL COMMENT 'Payment deadline based on payment periods'`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`debt\` decimal(2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`interest_paid\` decimal(2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`start_at\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`end_at\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`customer_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`employee_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`payment_period_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`loan_state_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_407d3207500ffa10289f908f0ef\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_c283021e393bbf9f04c4656b292\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_e43956f9a98549aa2bc5d95cddb\` FOREIGN KEY (\`payment_period_id\`) REFERENCES \`payment_periods\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_848d815876f83abca88d0da87ab\` FOREIGN KEY (\`loan_state_id\`) REFERENCES \`loan_states\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_848d815876f83abca88d0da87ab\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_e43956f9a98549aa2bc5d95cddb\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_c283021e393bbf9f04c4656b292\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_407d3207500ffa10289f908f0ef\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`loan_state_id\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`payment_period_id\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`employee_id\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`customer_id\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`end_at\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`start_at\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`interest_paid\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`debt\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`payment_deadline\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`installments\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`interestRate\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`customerId\` int NOT NULL`);
    }

}
