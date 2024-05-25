import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationsToDuesTable1714886680216 implements MigrationInterface {
    name = 'AddRelationsToDuesTable1714886680216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dues\` ADD \`payment_type_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`dues\` ADD \`payment_method_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`dues\` ADD CONSTRAINT \`FK_c83c9ed745271d7747bf1ee0fed\` FOREIGN KEY (\`payment_type_id\`) REFERENCES \`payment_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dues\` ADD CONSTRAINT \`FK_806db56036dfb6b14d7b800afb9\` FOREIGN KEY (\`payment_method_id\`) REFERENCES \`payment_methods\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dues\` DROP FOREIGN KEY \`FK_806db56036dfb6b14d7b800afb9\``);
        await queryRunner.query(`ALTER TABLE \`dues\` DROP FOREIGN KEY \`FK_c83c9ed745271d7747bf1ee0fed\``);
        await queryRunner.query(`ALTER TABLE \`dues\` DROP COLUMN \`payment_method_id\``);
        await queryRunner.query(`ALTER TABLE \`dues\` DROP COLUMN \`payment_type_id\``);
    }

}
