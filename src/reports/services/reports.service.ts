import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class ReportsService {
  constructor(private readonly dataSource: DataSource) {}

  profitHistory() {
    return this.dataSource
      .createQueryBuilder()
      .select('MONTH(i.payment_date) AS month, SUM(interest) AS total')
      .from('installments', 'i')
      .where('i.payment_date >= DATE_ADD(NOW(), INTERVAL -12 MONTH)')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany()
  }
}
