import { Test, TestingModule } from '@nestjs/testing'
import { PaymentsService } from './payments.service'

import { InterestsService } from '../interests/interests.service'
import { InstallmentsService } from '../installments/installments.service'
import { PayOffDto } from 'src/loans/dtos/pay-off.dto'
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { Loan } from 'src/loans/entities/loan.entity'
import { LoanManagementService } from '../loans-management/loans-management.service'
import { AddPaymentDto } from './dtos/add-payment.dto'
import { INSTALLMENT_STATES } from 'src/loans/constants/installments'
import { InstallmentFactoryService } from '../installments/installment-factory.service'
import { mockLoan } from '../../../../test/mocks/loans'
import { mockInstallment } from '../../../../test/mocks/installments'

const mockInstallmentService = {
  create: jest.fn(),
  findOne: jest.fn(),
  makePayment: jest.fn(),
  findUnpaidInstallments: jest.fn(),
}

describe('PaymentsService', () => {
  let paymentService: PaymentsService
  let loanManagementService: LoanManagementService
  let interestService: InterestsService
  let installmentService: InstallmentsService
  let installmentFactoryService: InstallmentFactoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: LoanManagementService, useValue: { findOne: jest.fn() } },
        {
          provide: InterestsService,
          useValue: { findUnpaidInterests: jest.fn(), getInterestsAmount: jest.fn() },
        },
        { provide: InstallmentsService, useValue: mockInstallmentService },
        { provide: InstallmentFactoryService, useValue: { update: jest.fn() } },
      ],
    }).compile()

    paymentService = module.get<PaymentsService>(PaymentsService)
    loanManagementService = module.get<LoanManagementService>(LoanManagementService)
    interestService = module.get<InterestsService>(InterestsService)
    installmentService = module.get<InstallmentsService>(InstallmentsService)
    installmentFactoryService = module.get<InstallmentFactoryService>(InstallmentFactoryService)
  })

  it('should be defined', () => {
    expect(paymentService).toBeDefined()
  })

  it('should make a payment to one installment, only interest', async () => {
    jest.spyOn(loanManagementService, 'findOne').mockResolvedValueOnce(mockLoan)
    jest.spyOn(installmentService, 'findOne').mockResolvedValueOnce(mockInstallment)
    jest
      .spyOn(installmentService, 'makePayment')
      .mockResolvedValueOnce({ generatedMaps: [{}], raw: {} })

    const paymentDto: AddPaymentDto = {
      loanId: mockLoan.id,
      paymentMethodId: 1,
      capital: 0,
      installmentId: mockInstallment.id,
    }

    const rs = await paymentService.addPayment(paymentDto)
    expect(installmentService.makePayment).toHaveBeenCalled()
  })

  it('Should throw an error when the payment is only to capital, with overdue installments', async () => {
    jest.clearAllMocks()

    const overdueInstallment = mockInstallment
    overdueInstallment.id = 2
    overdueInstallment.installmentStateId = INSTALLMENT_STATES.OVERDUE
    jest.spyOn(loanManagementService, 'findOne').mockResolvedValueOnce(mockLoan)
    jest.spyOn(installmentService, 'findOne').mockResolvedValueOnce(mockInstallment)
    const spy = jest
      .spyOn(installmentService, 'makePayment')
      .mockResolvedValueOnce({ generatedMaps: [{}], raw: {} })
    jest
      .spyOn(installmentService, 'findUnpaidInstallments')
      .mockResolvedValueOnce([overdueInstallment])

    const paymentDto: AddPaymentDto = {
      loanId: mockLoan.id,
      paymentMethodId: 1,
      capital: 100_000,
      installmentId: null,
    }

    await expect(paymentService.addPayment(paymentDto)).rejects.toThrow(
      UnprocessableEntityException,
    )
    expect(spy).not.toHaveBeenCalled()
  })

  it('Should throw an error when capital is 0 and installmentId is empty', async () => {
    jest.clearAllMocks()

    jest.spyOn(loanManagementService, 'findOne').mockResolvedValueOnce(mockLoan)
    jest.spyOn(installmentService, 'findOne').mockResolvedValueOnce(mockInstallment)
    const spy = jest
      .spyOn(installmentService, 'makePayment')
      .mockResolvedValueOnce({ generatedMaps: [{}], raw: {} })
    jest.spyOn(installmentService, 'findUnpaidInstallments').mockResolvedValueOnce([])

    const paymentDto: AddPaymentDto = {
      loanId: mockLoan.id,
      paymentMethodId: 1,
      capital: 0,
      installmentId: null,
    }

    await expect(paymentService.addPayment(paymentDto)).rejects.toThrow(
      UnprocessableEntityException,
    )
    expect(spy).not.toHaveBeenCalled()
  })

  it('should record a partial payment when the amount is less than the interest', async () => {
    jest.clearAllMocks()

    jest.spyOn(loanManagementService, 'findOne').mockResolvedValueOnce(mockLoan)
    jest.spyOn(installmentService, 'findOne').mockResolvedValueOnce(mockInstallment)
    jest
      .spyOn(installmentService, 'makePayment')
      .mockResolvedValueOnce({ generatedMaps: [{}], raw: {} })

    const paymentDto: AddPaymentDto = {
      loanId: mockLoan.id,
      paymentMethodId: 1,
      capital: 0,
      installmentId: mockInstallment.id,
      customInterest: 50_000,
    }

    const rs = await paymentService.addPayment(paymentDto)
    expect(installmentService.makePayment).toHaveBeenCalled()
  })

  // describe('PayOff', () => {
  //   it('should throw NotFoundException if no unpaid interests are found', async () => {
  //     // Arrange
  //     jest.spyOn(loanManagementService, 'findOne').mockResolvedValueOnce({ id: 1 } as Loan)
  //     jest.spyOn(interestService, 'findUnpaidInterests').mockResolvedValueOnce([])

  //     const paymentDto: AddPaymentDto = {
  //       loanId: 3,
  //       paymentMethodId: 3,
  //       installmentStateId: INSTALLMENT_STATES.PAID,
  //       capital: 0,
  //       instalmentId: 1,
  //     }

  //     // Act & Assert
  //     await expect(paymentService.payOff(1, paymentDto)).rejects.toThrow(NotFoundException)
  //   })
  // })
})
