import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDailyInterest1731729764822 implements MigrationInterface {
  name = 'AddDailyInterest1731729764822'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`daily_interest\` (\`id\` int NOT NULL AUTO_INCREMENT, \`installment_id\` int NOT NULL, \`amount\` decimal(15,2) NOT NULL, \`date\` date NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(`ALTER TABLE \`installments\` ADD \`starts_on\` date NULL`)
    await queryRunner.query(`ALTER TABLE \`installments\` ADD \`payment_deadline\` date NULL`)
    await queryRunner.query(`ALTER TABLE \`installments\` ADD \`days\` int NOT NULL DEFAULT '0'`)
    await queryRunner.query(
      `ALTER TABLE \`installments\` CHANGE \`capital\` \`capital\` decimal(15,2) NOT NULL COMMENT 'Abono que se hace a la deuda capital' DEFAULT '0.00'`,
    )
    await queryRunner.query(`ALTER TABLE \`installments\` MODIFY \`payment_method_id\` int NULL`)
    await queryRunner.query(
      `ALTER TABLE \`daily_interest\` ADD CONSTRAINT \`FK_932f7c72d7e10339ffdf3ca589e\` FOREIGN KEY (\`installment_id\`) REFERENCES \`installments\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`daily_interest\` DROP FOREIGN KEY \`FK_932f7c72d7e10339ffdf3ca589e\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`installments\` CHANGE \`capital\` \`capital\` decimal(15,2) NOT NULL COMMENT 'Abono que se hace a la deuda capital'`,
    )
    await queryRunner.query(`ALTER TABLE \`installments\` DROP COLUMN \`days\``)
    await queryRunner.query(`ALTER TABLE \`installments\` DROP COLUMN \`payment_deadline\``)
    await queryRunner.query(`ALTER TABLE \`installments\` DROP COLUMN \`starts_on\``)
    await queryRunner.query(`DROP TABLE \`daily_interest\``)
  }
}
