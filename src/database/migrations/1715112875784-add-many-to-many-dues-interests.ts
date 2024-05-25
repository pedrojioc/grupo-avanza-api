import { MigrationInterface, QueryRunner } from "typeorm";

export class AddManyToManyDuesInterests1715112875784 implements MigrationInterface {
    name = 'AddManyToManyDuesInterests1715112875784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`dues_interests\` (\`due_id\` int NOT NULL, \`interest_id\` int NOT NULL, INDEX \`IDX_167ac67a576a10912f2cf045a7\` (\`due_id\`), INDEX \`IDX_7aa1360094ab5fe9f70d4247a4\` (\`interest_id\`), PRIMARY KEY (\`due_id\`, \`interest_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`dues_interests\` ADD CONSTRAINT \`FK_167ac67a576a10912f2cf045a75\` FOREIGN KEY (\`due_id\`) REFERENCES \`dues\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`dues_interests\` ADD CONSTRAINT \`FK_7aa1360094ab5fe9f70d4247a46\` FOREIGN KEY (\`interest_id\`) REFERENCES \`interests\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dues_interests\` DROP FOREIGN KEY \`FK_7aa1360094ab5fe9f70d4247a46\``);
        await queryRunner.query(`ALTER TABLE \`dues_interests\` DROP FOREIGN KEY \`FK_167ac67a576a10912f2cf045a75\``);
        await queryRunner.query(`DROP INDEX \`IDX_7aa1360094ab5fe9f70d4247a4\` ON \`dues_interests\``);
        await queryRunner.query(`DROP INDEX \`IDX_167ac67a576a10912f2cf045a7\` ON \`dues_interests\``);
        await queryRunner.query(`DROP TABLE \`dues_interests\``);
    }

}
