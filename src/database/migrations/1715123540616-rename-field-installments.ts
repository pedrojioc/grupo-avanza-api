import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameFieldInstallments1715123540616 implements MigrationInterface {
    name = 'RenameFieldInstallments1715123540616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`installments\` \`installmentsNumber\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`installmentsNumber\` \`installmentsNumber\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`installmentsNumber\` \`installmentsNumber\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`installmentsNumber\` \`installments\` int NOT NULL`);
    }

}
