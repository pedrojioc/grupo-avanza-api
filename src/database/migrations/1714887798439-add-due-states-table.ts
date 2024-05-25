import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDueStatesTable1714887798439 implements MigrationInterface {
    name = 'AddDueStatesTable1714887798439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`due_states\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`due_states\``);
    }

}
