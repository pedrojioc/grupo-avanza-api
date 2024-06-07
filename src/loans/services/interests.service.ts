import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { addDay, addMonth, diffDays, format, isEqual, parse } from '@formkit/tempo'

import { Interest } from '../entities/interest.entity'
import { CreateInterestDto } from '../dtos/create-interest.dto'
import { UpdateInterestDto } from '../dtos/update-interest.dto'
import { FilterPaginator } from 'src/lib/filter-paginator'
import { LoansService } from './loans.service'

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest) private repository: Repository<Interest>,
    private loanService: LoansService,
  ) {}

  getDailyInterest(debt: number, interestRate: number) {
    const MONTH_DAYS = 30
    const interest = (debt * interestRate) / 100
    return interest / MONTH_DAYS
  }

  async rawCreate(interest: CreateInterestDto) {
    return await this.repository
      .createQueryBuilder()
      .insert()
      .into(Interest)
      .values(interest)
      .execute()
  }

  findAllByLoan(loanId: number) {
    const paginator = new FilterPaginator(this.repository, {
      where: { loanId },
      relations: ['state'],
    })
    const result = paginator.paginate(1).execute()
    return result
  }

  async update(id: number, data: UpdateInterestDto) {}

  async rawUpdate(id: number, data: UpdateInterestDto) {
    await this.repository.createQueryBuilder().update(Interest).set(data).where({ id }).execute()
  }

  async runDailyInterest() {
    const INTEREST_PENDING_STATE = 1
    const DATE_FORMAT = 'YYYY-MM-DD'
    const today = new Date()
    const todayString = format(today, DATE_FORMAT)

    const loans = await this.loanService.getPendingLoans()

    for (const loan of loans) {
      const dailyInterest = this.getDailyInterest(loan.debt, loan.interestRate)

      const interest = await this.repository
        .createQueryBuilder('interest')
        .where(
          'loan_id = :loanId AND interest_state_id = :interestStateId AND deadline >= :currentDate',
          {
            loanId: loan.id,
            interestStateId: INTEREST_PENDING_STATE,
            currentDate: todayString,
          },
        )
        .getOne()

      if (interest) {
        if (isEqual(interest.lastInterestGenerated, todayString)) continue

        const amount = Number(interest.amount) + dailyInterest
        const days = interest.days + 1

        await this.rawUpdate(interest.id, { amount, days, lastInterestGenerated: today })
      } else {
        const nextMonth = addMonth(addDay(today, -1), 1)
        const newInterest: CreateInterestDto = {
          amount: dailyInterest,
          capital: loan.debt,
          startAt: today,
          deadline: nextMonth,
          days: 1,
          loanId: loan.id,
          interestStateId: 1,
          lastInterestGenerated: today,
        }
        await this.rawCreate(newInterest)
      }
      // Update current interest on loans table
      const currentInterest = Number(loan.currentInterest) + dailyInterest
      await this.loanService.rawUpdate(loan.id, {
        currentInterest,
      })
    }
    return true
  }

  async fillPendingInterest() {
    const DATE_FORMAT = 'YYYY-MM-DD'
    const today = new Date()
    const todayString = format(today, DATE_FORMAT)

    const loans = await this.loanService.getPendingLoans()
    for (const loan of loans) {
      const dailyInterest = this.getDailyInterest(loan.debt, loan.interestRate)
      const paymentDay = Number(loan.paymentDay) < 10 ? `0${loan.paymentDay}` : loan.paymentDay
      const interestFrom = `2024-05-${paymentDay}`
      const interestTo = `2024-06-${paymentDay}`
      const daysLeft = diffDays(todayString, interestFrom)
      const pendingInterest = daysLeft >= 20 ? dailyInterest * 30 : dailyInterest * daysLeft
      const newInterest: CreateInterestDto = {
        amount: pendingInterest,
        capital: loan.debt,
        startAt: today,
        deadline: parse(interestTo, DATE_FORMAT),
        days: daysLeft,
        loanId: loan.id,
        interestStateId: 1,
        lastInterestGenerated: today,
      }
      await this.rawCreate(newInterest)

      let newCurrentInterest = 0

      if (daysLeft > 30) {
        const days = daysLeft - 30
        newCurrentInterest = days * dailyInterest
        const newInterest: CreateInterestDto = {
          amount: newCurrentInterest,
          capital: loan.debt,
          startAt: addDay(interestTo),
          deadline: parse(`2024-07-${paymentDay}`, DATE_FORMAT),
          days: days,
          loanId: loan.id,
          interestStateId: 1,
          lastInterestGenerated: today,
        }
        await this.rawCreate(newInterest)
      }

      // Update current interest on loans table
      const currentInterest = Number(loan.currentInterest) + pendingInterest + newCurrentInterest
      await this.loanService.rawUpdate(loan.id, {
        currentInterest,
      })
    }
  }
}
