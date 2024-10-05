export const LOAN_STATES = {
  PENDING: 1,
  IN_PROGRESS: 2,
  FINALIZED: 3,
  REJECTED: 4,
}

export const PAYMENT_PERIODS = {
  WEEKLY: 1,
  FORTNIGHTLY: 2,
  MONTHLY: 3,
}

type Keys = keyof typeof LOAN_STATES

export type LoanStateValueTypes = (typeof LOAN_STATES)[Keys]
