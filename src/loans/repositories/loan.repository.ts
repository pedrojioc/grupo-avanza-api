import { Repository } from 'typeorm'
import { Loan } from '../entities/loan.entity'

export class LoanRepository extends Repository<Loan> {}
