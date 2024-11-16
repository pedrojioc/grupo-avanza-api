import { Module } from '@nestjs/common'
import { DailyInterestService } from './daily-interest.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DailyInterest } from 'src/loans/entities/daily-interest.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DailyInterest])],
  providers: [DailyInterestService],
  exports: [DailyInterestService],
})
export class DailyInterestModule {}
