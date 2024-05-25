import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomersAndActivities1710895613963 implements MigrationInterface {
    name = 'CreateCustomersAndActivities1710895613963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`financial_activities\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4ad06d334570fb953266e2e6dd\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`customers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`id_number\` varchar(20) NOT NULL, \`address\` varchar(50) NOT NULL, \`phone_number\` varchar(50) NOT NULL, \`birthdate\` date NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`financial_activity_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD CONSTRAINT \`FK_3f06e2321549e22cb2c7b85cb60\` FOREIGN KEY (\`financial_activity_id\`) REFERENCES \`financial_activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_3f06e2321549e22cb2c7b85cb60\``);
        await queryRunner.query(`DROP TABLE \`customers\``);
        await queryRunner.query(`DROP INDEX \`IDX_4ad06d334570fb953266e2e6dd\` ON \`financial_activities\``);
        await queryRunner.query(`DROP TABLE \`financial_activities\``);
    }

}
