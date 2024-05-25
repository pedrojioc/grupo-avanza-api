import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRelationPaymentTypeFromDues1714929535530 implements MigrationInterface {
    name = 'RemoveRelationPaymentTypeFromDues1714929535530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dues\` DROP FOREIGN KEY \`FK_c83c9ed745271d7747bf1ee0fed\``);
        await queryRunner.query(`ALTER TABLE \`dues\` DROP COLUMN \`payment_type_id\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dues\` ADD \`payment_type_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`dues\` ADD CONSTRAINT \`FK_c83c9ed745271d7747bf1ee0fed\` FOREIGN KEY (\`payment_type_id\`) REFERENCES \`payment_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
