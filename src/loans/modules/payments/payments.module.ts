import { Module } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { LoansManagementModule } from '../loans-management/loans-management.module'
import { InterestsModule } from '../interests/interests.module'
import { InstallmentsModule } from '../installments/installments.module'

@Module({
  imports: [LoansManagementModule, InterestsModule, InstallmentsModule],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
