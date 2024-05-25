import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationsToDueStates1714887900620 implements MigrationInterface {
    name = 'AddRelationsToDueStates1714887900620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dues\` ADD \`due_state_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`dues\` ADD CONSTRAINT \`FK_ae464894b51b0e53576feecf552\` FOREIGN KEY (\`due_state_id\`) REFERENCES \`due_states\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dues\` DROP FOREIGN KEY \`FK_ae464894b51b0e53576feecf552\``);
        await queryRunner.query(`ALTER TABLE \`dues\` DROP COLUMN \`due_state_id\``);
    }

}
