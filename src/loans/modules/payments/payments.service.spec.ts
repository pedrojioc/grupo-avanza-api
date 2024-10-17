import { Test, TestingModule } from '@nestjs/testing'
import { PaymentsService } from './payments.service'

import { InterestsService } from '../interests/interests.service'
import { InstallmentsService } from '../installments/installments.service'
import { PayOffDto } from 'src/loans/dtos/pay-off.dto'
import { NotFoundException } from '@nestjs/common'
import { Loan } from 'src/loans/entities/loan.entity'
import { LoanManagementService } from '../loans-management/loans-management.service'
import { AddPaymentDto } from './dtos/add-payment.dto'
import { INSTALLMENT_STATES } from 'src/loans/constants/installments'

describe('PaymentsService', () => {
  let paymentService: PaymentsService
  let loanManagementService: LoanManagementService
  let interestService: InterestsService
  let installmentService: InstallmentsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: LoanManagementService, useValue: { findOne: jest.fn() } },
        {
          provide: InterestsService,
          useValue: { findUnpaidInterests: jest.fn(), getInterestsAmount: jest.fn() },
        },
        { provide: InstallmentsService, useValue: { create: jest.fn() } },
      ],
    }).compile()

    paymentService = module.get<PaymentsService>(PaymentsService)
    loanManagementService = module.get<LoanManagementService>(LoanManagementService)
    interestService = module.get<InterestsService>(InterestsService)
    installmentService = module.get<InstallmentsService>(InstallmentsService)
  })

  it('should be defined', () => {
    expect(paymentService).toBeDefined()
  })

  describe('PayOff', () => {
    it('should throw NotFoundException if no unpaid interests are found', async () => {
      // Arrange
      jest.spyOn(loanManagementService, 'findOne').mockResolvedValueOnce({ id: 1 } as Loan)
      jest.spyOn(interestService, 'findUnpaidInterests').mockResolvedValueOnce([])

      const paymentDto: AddPaymentDto = {
        loanId: 3,
        paymentMethodId: 3,
        installmentStateId: INSTALLMENT_STATES.PAID,
        capital: 0,
        interestIds: [],
      }

      // Act & Assert
      await expect(paymentService.payOff(1, paymentDto)).rejects.toThrow(NotFoundException)
    })
  })
})
