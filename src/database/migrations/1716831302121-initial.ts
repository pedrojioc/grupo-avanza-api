import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1716831302121 implements MigrationInterface {
    name = 'Initial1716831302121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`positions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_5c70dc5aa01e351730e4ffc929\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`employees\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`position_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`menus\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`icon\` varchar(100) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`options\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`path\` varchar(100) NOT NULL, \`icon\` varchar(100) NOT NULL, \`order\` int NOT NULL DEFAULT '0', \`is_visible\` tinyint NOT NULL COMMENT 'Determina si se muestra en el menú o no' DEFAULT '1', \`menu_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(50) NOT NULL, \`password\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`employee_id\` int NOT NULL, \`role_id\` int NOT NULL, UNIQUE INDEX \`REL_9760615d88ed518196bb79ea03\` (\`employee_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment_methods\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`description\` varchar(300) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment_periods\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`days\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`financial_activities\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4ad06d334570fb953266e2e6dd\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`customers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`id_number\` varchar(20) NOT NULL, \`address\` varchar(50) NOT NULL, \`phone_number\` varchar(50) NOT NULL, \`birthdate\` date NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`financial_activity_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`loan_states\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`loans\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(15,2) NOT NULL, \`interest_rate\` decimal(10,2) NOT NULL, \`debt\` decimal(15,2) NOT NULL, \`installmentsNumber\` int NOT NULL DEFAULT '0', \`installments_paid\` int NOT NULL DEFAULT '0', \`days_late\` int NOT NULL DEFAULT '0', \`current_interest\` decimal(15,2) NOT NULL COMMENT 'Current interest generated since the last payment date' DEFAULT '0.00', \`total_interest_paid\` decimal(15,2) NOT NULL DEFAULT '0.00', \`start_at\` datetime NOT NULL, \`end_at\` datetime NOT NULL, \`payment_day\` int NULL, \`last_interest_payment\` date NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`customer_id\` int NOT NULL, \`employee_id\` int NOT NULL, \`payment_period_id\` int NOT NULL, \`loan_state_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`interest_states\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`installment_states\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`installments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`loan_id\` int NOT NULL, \`payment_method_id\` int NOT NULL, \`installment_state_id\` int NOT NULL, \`debt\` decimal(15,2) NOT NULL, \`capital\` decimal(15,2) NOT NULL COMMENT 'Abono que se hace a la deuda capital', \`interest\` decimal(15,2) NOT NULL, \`total\` decimal(15,2) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`interests\` (\`id\` int NOT NULL AUTO_INCREMENT, \`loan_id\` int NOT NULL, \`amount\` decimal(15,2) NOT NULL, \`capital\` decimal(15,2) NOT NULL, \`start_at\` date NOT NULL, \`deadline\` date NOT NULL, \`days\` int NOT NULL, \`interest_state_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles_options\` (\`role_id\` int NOT NULL, \`option_id\` int NOT NULL, INDEX \`IDX_79d5662f3d3f0b0b313ec47b73\` (\`role_id\`), INDEX \`IDX_e70326512a9e171fce968918d8\` (\`option_id\`), PRIMARY KEY (\`role_id\`, \`option_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`installments_interests\` (\`installment_id\` int NOT NULL, \`interest_id\` int NOT NULL, INDEX \`IDX_330b14abc3d156871676c8b78c\` (\`installment_id\`), INDEX \`IDX_c2359ccc2be2d103d6d645e365\` (\`interest_id\`), PRIMARY KEY (\`installment_id\`, \`interest_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD CONSTRAINT \`FK_8b14204e8af5e371e36b8c11e1b\` FOREIGN KEY (\`position_id\`) REFERENCES \`positions\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`options\` ADD CONSTRAINT \`FK_fe3976809040211dbbf2009a203\` FOREIGN KEY (\`menu_id\`) REFERENCES \`menus\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_9760615d88ed518196bb79ea03d\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employees\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_a2cecd1a3531c0b041e29ba46e1\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD CONSTRAINT \`FK_3f06e2321549e22cb2c7b85cb60\` FOREIGN KEY (\`financial_activity_id\`) REFERENCES \`financial_activities\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_407d3207500ffa10289f908f0ef\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_c283021e393bbf9f04c4656b292\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employees\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_e43956f9a98549aa2bc5d95cddb\` FOREIGN KEY (\`payment_period_id\`) REFERENCES \`payment_periods\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_848d815876f83abca88d0da87ab\` FOREIGN KEY (\`loan_state_id\`) REFERENCES \`loan_states\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`installments\` ADD CONSTRAINT \`FK_6a0de085bb82a1e96164dc1b900\` FOREIGN KEY (\`loan_id\`) REFERENCES \`loans\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`installments\` ADD CONSTRAINT \`FK_9f726d476ac71bd917681477d41\` FOREIGN KEY (\`payment_method_id\`) REFERENCES \`payment_methods\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`installments\` ADD CONSTRAINT \`FK_0eb82bf5d8b622fbce52f1b0b4e\` FOREIGN KEY (\`installment_state_id\`) REFERENCES \`installment_states\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`interests\` ADD CONSTRAINT \`FK_39049601d4b2fa7c02d34393471\` FOREIGN KEY (\`loan_id\`) REFERENCES \`loans\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`interests\` ADD CONSTRAINT \`FK_477042e18335cc99742a5c08f5e\` FOREIGN KEY (\`interest_state_id\`) REFERENCES \`interest_states\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`roles_options\` ADD CONSTRAINT \`FK_79d5662f3d3f0b0b313ec47b730\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`roles_options\` ADD CONSTRAINT \`FK_e70326512a9e171fce968918d80\` FOREIGN KEY (\`option_id\`) REFERENCES \`options\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`installments_interests\` ADD CONSTRAINT \`FK_330b14abc3d156871676c8b78c2\` FOREIGN KEY (\`installment_id\`) REFERENCES \`installments\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`installments_interests\` ADD CONSTRAINT \`FK_c2359ccc2be2d103d6d645e3655\` FOREIGN KEY (\`interest_id\`) REFERENCES \`interests\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`installments_interests\` DROP FOREIGN KEY \`FK_c2359ccc2be2d103d6d645e3655\``);
        await queryRunner.query(`ALTER TABLE \`installments_interests\` DROP FOREIGN KEY \`FK_330b14abc3d156871676c8b78c2\``);
        await queryRunner.query(`ALTER TABLE \`roles_options\` DROP FOREIGN KEY \`FK_e70326512a9e171fce968918d80\``);
        await queryRunner.query(`ALTER TABLE \`roles_options\` DROP FOREIGN KEY \`FK_79d5662f3d3f0b0b313ec47b730\``);
        await queryRunner.query(`ALTER TABLE \`interests\` DROP FOREIGN KEY \`FK_477042e18335cc99742a5c08f5e\``);
        await queryRunner.query(`ALTER TABLE \`interests\` DROP FOREIGN KEY \`FK_39049601d4b2fa7c02d34393471\``);
        await queryRunner.query(`ALTER TABLE \`installments\` DROP FOREIGN KEY \`FK_0eb82bf5d8b622fbce52f1b0b4e\``);
        await queryRunner.query(`ALTER TABLE \`installments\` DROP FOREIGN KEY \`FK_9f726d476ac71bd917681477d41\``);
        await queryRunner.query(`ALTER TABLE \`installments\` DROP FOREIGN KEY \`FK_6a0de085bb82a1e96164dc1b900\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_848d815876f83abca88d0da87ab\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_e43956f9a98549aa2bc5d95cddb\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_c283021e393bbf9f04c4656b292\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_407d3207500ffa10289f908f0ef\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_3f06e2321549e22cb2c7b85cb60\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_9760615d88ed518196bb79ea03d\``);
        await queryRunner.query(`ALTER TABLE \`options\` DROP FOREIGN KEY \`FK_fe3976809040211dbbf2009a203\``);
        await queryRunner.query(`ALTER TABLE \`employees\` DROP FOREIGN KEY \`FK_8b14204e8af5e371e36b8c11e1b\``);
        await queryRunner.query(`DROP INDEX \`IDX_c2359ccc2be2d103d6d645e365\` ON \`installments_interests\``);
        await queryRunner.query(`DROP INDEX \`IDX_330b14abc3d156871676c8b78c\` ON \`installments_interests\``);
        await queryRunner.query(`DROP TABLE \`installments_interests\``);
        await queryRunner.query(`DROP INDEX \`IDX_e70326512a9e171fce968918d8\` ON \`roles_options\``);
        await queryRunner.query(`DROP INDEX \`IDX_79d5662f3d3f0b0b313ec47b73\` ON \`roles_options\``);
        await queryRunner.query(`DROP TABLE \`roles_options\``);
        await queryRunner.query(`DROP TABLE \`interests\``);
        await queryRunner.query(`DROP TABLE \`installments\``);
        await queryRunner.query(`DROP TABLE \`installment_states\``);
        await queryRunner.query(`DROP TABLE \`interest_states\``);
        await queryRunner.query(`DROP TABLE \`loans\``);
        await queryRunner.query(`DROP TABLE \`loan_states\``);
        await queryRunner.query(`DROP TABLE \`customers\``);
        await queryRunner.query(`DROP INDEX \`IDX_4ad06d334570fb953266e2e6dd\` ON \`financial_activities\``);
        await queryRunner.query(`DROP TABLE \`financial_activities\``);
        await queryRunner.query(`DROP TABLE \`payment_periods\``);
        await queryRunner.query(`DROP TABLE \`payment_methods\``);
        await queryRunner.query(`DROP INDEX \`REL_9760615d88ed518196bb79ea03\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`options\``);
        await queryRunner.query(`DROP TABLE \`menus\``);
        await queryRunner.query(`DROP TABLE \`employees\``);
        await queryRunner.query(`DROP INDEX \`IDX_5c70dc5aa01e351730e4ffc929\` ON \`positions\``);
        await queryRunner.query(`DROP TABLE \`positions\``);
    }

}
