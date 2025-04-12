import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableInstallmentsTypes1743628963434 implements MigrationInterface {
    name = 'AddTableInstallmentsTypes1743628963434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`installments_types\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` char(100) NOT NULL, \`description\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD \`installment_type_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_cb3915d88c898ee9c18d4069656\` FOREIGN KEY (\`installment_type_id\`) REFERENCES \`installments_types\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_cb3915d88c898ee9c18d4069656\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP COLUMN \`installment_type_id\``);
        await queryRunner.query(`DROP TABLE \`installments_types\``);
    }

}
