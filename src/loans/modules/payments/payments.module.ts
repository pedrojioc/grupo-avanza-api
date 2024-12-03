import { Module } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { LoansManagementModule } from '../loans-management/loans-management.module'
import { InterestsModule } from '../interests/interests.module'
import { InstallmentsModule } from '../installments/installments.module'
import { PaymentsController } from './payments.controller';

@Module({
  imports: [LoansManagementModule, InterestsModule, InstallmentsModule],
  providers: [PaymentsService],
  exports: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
