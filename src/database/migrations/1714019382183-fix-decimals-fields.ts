import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixDecimalsFields1714019382183 implements MigrationInterface {
  name = 'FixDecimalsFields1714019382183'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`loans\` CHANGE \`amount\` \`amount\` decimal(15,2) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`loans\` CHANGE \`interest_rate\` \`interest_rate\` decimal(10,2) NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`debt\` \`debt\` decimal(15,2) NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE \`loans\` CHANGE \`current_interest\` \`current_interest\` decimal(15,2) NOT NULL COMMENT 'Current interest generated since the last payment date' DEFAULT '0.00'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`loans\` CHANGE \`total_interest_paid\` \`total_interest_paid\` decimal(15,2) NOT NULL DEFAULT '0.00'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`interests\` CHANGE \`amount\` \`amount\` decimal(15,2) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`interests\` CHANGE \`capital\` \`capital\` decimal(15,2) NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`interests\` CHANGE \`capital\` \`capital\` decimal(15,0) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`interests\` CHANGE \`amount\` \`amount\` decimal(15,0) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`loans\` CHANGE \`total_interest_paid\` \`total_interest_paid\` decimal(15,0) NOT NULL DEFAULT '0'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`loans\` CHANGE \`current_interest\` \`current_interest\` decimal(15,0) NOT NULL COMMENT 'Current interest generated since the last payment date' DEFAULT '0'`,
    )
    await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`debt\` \`debt\` decimal(15,0) NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE \`loans\` CHANGE \`interest_rate\` \`interest_rate\` decimal(15,0) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`loans\` CHANGE \`amount\` \`amount\` decimal(15,0) NOT NULL`,
    )
  }
}
