import { Test, TestingModule } from '@nestjs/testing'
import { WhatsAppService } from './whatsapp.service'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { LoanManagementService } from 'src/loans/modules/loans-management/loans-management.service'
import { InstallmentsService } from 'src/loans/modules/installments/installments.service'
import { mockLoan } from '../../test/mocks/loans'
import { Loan } from 'src/loans/entities/loan.entity'
import { Observable } from 'rxjs'

describe('LoansManagementService', () => {
  let service: WhatsAppService
  let loanManagementService: LoanManagementService
  let installmentService: InstallmentsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsAppService,
        { provide: HttpService, useValue: {} },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: LoanManagementService, useValue: { getLoansInDefault: jest.fn() } },
        { provide: InstallmentsService, useValue: { getAmountOfInterestInArrears: jest.fn() } },
      ],
    }).compile()

    service = module.get<WhatsAppService>(WhatsAppService)
    loanManagementService = module.get<LoanManagementService>(LoanManagementService)
    installmentService = module.get<InstallmentsService>(InstallmentsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should skip notification when notifications are paused', async () => {
    jest.clearAllMocks()
    const loans: Loan[] = [{ ...mockLoan, isNotificationsPaused: true, daysLate: 6 }]
    jest.spyOn(loanManagementService, 'getLoansInDefault').mockResolvedValueOnce(loans)
    jest.spyOn(installmentService, 'getAmountOfInterestInArrears').mockResolvedValue(400_000)
    const spied = jest.spyOn(service, 'sendMessage').mockResolvedValue({} as Observable<any>)

    const rs = await service.runNotifications()

    expect(spied).not.toHaveBeenCalled()
  })

  it('should skip notification when notifications are paused for 3 days', async () => {
    jest.clearAllMocks()
    const pauseUntil = new Date(new Date().setDate(new Date().getDate() + 3))
    const loans: Loan[] = [{ ...mockLoan, daysLate: 6, pauseNotificationsUntil: pauseUntil }]

    jest.spyOn(loanManagementService, 'getLoansInDefault').mockResolvedValueOnce(loans)
    jest.spyOn(installmentService, 'getAmountOfInterestInArrears').mockResolvedValue(400_000)
    const spied = jest.spyOn(service, 'sendMessage').mockResolvedValue({} as Observable<any>)

    const rs = await service.runNotifications()

    expect(spied).not.toHaveBeenCalled()
  })

  it('should skip the notification, if the last notification was sent recently', async () => {
    jest.clearAllMocks()
    const lastSent = new Date(new Date().setDate(new Date().getDate() - 3))
    const loans: Loan[] = [{ ...mockLoan, daysLate: 6, lastNotificationSent: lastSent }]

    jest.spyOn(loanManagementService, 'getLoansInDefault').mockResolvedValueOnce(loans)
    jest.spyOn(installmentService, 'getAmountOfInterestInArrears').mockResolvedValue(400_000)
    const spied = jest.spyOn(service, 'sendMessage').mockResolvedValue({} as Observable<any>)

    const rs = await service.runNotifications()

    expect(spied).not.toHaveBeenCalled()
  })
})
