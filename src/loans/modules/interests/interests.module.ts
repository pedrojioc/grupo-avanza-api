import { Module } from '@nestjs/common'
import { InterestsService } from './interests.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Interest } from 'src/loans/entities/interest.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Interest])],
  providers: [InterestsService],
  exports: [InterestsService],
})
export class InterestsModule {}
