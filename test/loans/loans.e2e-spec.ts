import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import * as request from 'supertest'
import { DataSource, Repository } from 'typeorm'

import { Loan } from 'src/loans/entities/loan.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { authenticate } from 'test/helpers/login'
import { CreateLoanDto } from 'src/loans/dtos/loans.dto'
import { LOAN_STATES } from 'src/loans/shared/constants'
import { INSTALLMENT_STATES } from 'src/loans/constants/installments'
import { Interest } from 'src/loans/entities/interest.entity'
import { INTEREST_STATE } from 'src/loans/constants/interests'
import { Installment } from 'src/loans/entities/installment.entity'
import { AddPaymentDto } from 'src/loans/modules/payments/dtos/add-payment.dto'
import { DatabaseSeeder } from 'src/database/database-seeder'
import { error } from 'console'

describe('LoansController (e2e)', () => {
  let app: INestApplication
  let seeder: DatabaseSeeder
  let loanRepository: Repository<Loan>
  let interestRepository: Repository<Interest>
  let installmentRepository: Repository<Installment>
  let hostServer: string
  let accessToken: string

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [DatabaseSeeder],
    }).compile()

    loanRepository = moduleFixture.get<Repository<Loan>>(getRepositoryToken(Loan))
    interestRepository = moduleFixture.get<Repository<Interest>>(getRepositoryToken(Interest))
    installmentRepository = moduleFixture.get<Repository<Installment>>(
      getRepositoryToken(Installment),
    )

    app = moduleFixture.createNestApplication()
    await app.init()

    // Initialize seeder
    seeder = moduleFixture.get(DatabaseSeeder)

    hostServer = app.getHttpServer()
    accessToken = await authenticate(hostServer)
  })

  afterAll(async () => {
    await app.close()
  })

  it('/loans (POST)', async () => {
    const data: CreateLoanDto = {
      customerId: 1,
      employeeId: 1,
      paymentPeriodId: 1,
      amount: 2000000,
      interestRate: 10,
      installmentsNumber: 6,
      startAt: new Date(),
      endAt: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      loanStateId: LOAN_STATES.IN_PROGRESS,
    }
    return request(hostServer)
      .post('/loans')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toHaveProperty('id')
      })
  })

  it('/loans/:id/installments (POST) - WITHOUT CAPITAL', async () => {
    const loan = await seeder.seedLoans()
    const installmentRs = await seeder.seedInstallment(loan.id, INSTALLMENT_STATES.AWAITING_PAYMENT)
    const installment = await installmentRepository.findOne({
      where: { id: installmentRs.raw.insertId },
    })
    if (!loan) throw new Error('Loan not found')

    const data: AddPaymentDto = {
      loanId: loan.id,
      paymentMethodId: 1,
      capital: 0,
      installmentId: installment.id,
    }

    const response = await request(hostServer)
      .post(`/loans/${loan.id}/installments`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data)
      .expect(201)

    const installmentAfterPayment = await installmentRepository.findOneBy({
      id: installment.id,
    })
    const loanAfterPayment = await loanRepository.findOne({ where: { id: loan.id } })

    expect(Number(installmentAfterPayment.capital)).toEqual(0)
    expect(Number(loanAfterPayment.debt)).toEqual(loan.debt)
    expect(installmentAfterPayment.installmentStateId).toEqual(INSTALLMENT_STATES.PAID)

    return response
  })

  it('/loans/:id/installments (POST) - INTEREST + CAPITAL', async () => {
    const loan = await seeder.seedLoans()
    const installmentRs = await seeder.seedInstallment(loan.id, INSTALLMENT_STATES.AWAITING_PAYMENT)
    const installmentId = installmentRs.raw.insertId

    if (!loan) throw new Error('Loan not found')

    const capital = 500_000
    const data: AddPaymentDto = {
      loanId: loan.id,
      paymentMethodId: 1,
      capital,
      installmentId,
    }

    const response = await request(hostServer)
      .post(`/loans/${loan.id}/installments`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data)
      .expect(201)

    const installment = await installmentRepository.findOneBy({ id: installmentId })
    const loanAfterPayment = await loanRepository.findOne({ where: { id: loan.id } })

    const expectedDebt = Number(loan.debt) - capital

    expect(Number(installment.capital)).toEqual(capital)
    expect(Number(loanAfterPayment.debt)).toEqual(expectedDebt)
    expect(installment.installmentStateId).toEqual(INSTALLMENT_STATES.PAID)

    return response
  })

  it('/loans/:id/installments (POST) - ONLY CAPITAL NO PENDING INTEREST', async () => {
    const loan = await seeder.seedLoans()
    const installmentRs = await seeder.seedInstallment(loan.id, INSTALLMENT_STATES.AWAITING_PAYMENT)
    const installment = await installmentRepository.findOne({
      where: { id: installmentRs.raw.insertId },
    })

    if (!loan) throw new Error('Loan not found')

    const capital = 200_000
    const data: AddPaymentDto = {
      loanId: loan.id,
      paymentMethodId: 1,
      capital,
      installmentId: null,
    }

    const response = await request(hostServer)
      .post(`/loans/${data.loanId}/installments`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data)
      .expect(201)

    const installmentAfterPayment = await installmentRepository.findOneBy({
      id: installment.id,
    })
    const loanAfterPayment = await loanRepository.findOne({ where: { id: loan.id } })

    const expectedDebt = Number(loan.debt) - capital

    expect(Number(installmentAfterPayment.interest)).toEqual(0)
    expect(Number(installment.capital)).toEqual(capital)
    expect(Number(loanAfterPayment.debt)).toEqual(expectedDebt)

    return response
  })

  it('/loans/:id/installments (POST) - ONLY CAPITAL WITH PENDING INTEREST', async () => {
    const loan = await seeder.seedLoans()

    if (!loan) throw new Error('Loan not found')

    const data: AddPaymentDto = {
      loanId: loan.id,
      paymentMethodId: 1,
      capital: 200000,
      installmentId: null,
    }
    const response = await request(hostServer)
      .post(`/loans/${data.loanId}/installments`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data)
      .expect(422)

    return response
  })

  /*
  it('/loans/:id/pay-off (POST)', async () => {
    const loan = await loanRepository.findOne({ where: { loanStateId: LOAN_STATES.IN_PROGRESS } })
    const payOffData: AddPaymentDto = {
      loanId: loan.id,
      paymentMethodId: 1,
      capital: 0,
      instalmentId: 0
    }

    const response = await request(hostServer)
      .post(`/loans/${payOffData.loanId}/pay-off`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(payOffData)
      .expect(201)

    const loanAfterPayOff = await loanRepository.findOne({ where: { id: loan.id } })
    const installment = await installmentRepository.findOne({
      where: { id: response.body.raw.insertId },
    })
    expect(Number(loanAfterPayOff.debt)).toEqual(0)
    expect(Number(installment.capital)).toEqual(Number(loan.debt))
    expect(loanAfterPayOff.loanStateId).toEqual(LOAN_STATES.FINALIZED)
  })

  it('/loans/:id/pay-off (POST) - WITH CUSTOM INTEREST', async () => {
    const loan = await loanRepository.findOne({ where: { loanStateId: LOAN_STATES.IN_PROGRESS } })
    const interestToPay = 500_000
    const payOffData: AddPaymentDto = {
      loanId: loan.id,
      paymentMethodId: 1,
      installmentStateId: INSTALLMENT_STATES.PAID,
      capital: 0,
      customInterest: interestToPay,
      interestIds: [],
    }

    const response = await request(hostServer)
      .post(`/loans/${payOffData.loanId}/pay-off`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(payOffData)
      .expect(201)

    const loanAfterPayOff = await loanRepository.findOne({ where: { id: loan.id } })
    const installment = await installmentRepository.findOne({
      where: { id: response.body.raw.insertId },
    })
    expect(Number(loanAfterPayOff.debt)).toEqual(0)
    expect(Number(installment.capital)).toEqual(Number(loan.debt))
    expect(loanAfterPayOff.loanStateId).toEqual(LOAN_STATES.FINALIZED)
    expect(Number(installment.interest)).toEqual(interestToPay)
  })
  */
})
