import { Customer } from 'src/customers/entities/customer.entity'
import { FinancialActivity } from 'src/customers/entities/financial-activity.entity'

export const mockCustomer: Customer = {
  id: 1,
  uuid: '',
  financialActivity: new FinancialActivity(),
  name: 'Pedro J',
  idNumber: '1081926747',
  address: 'Calle 11',
  phoneNumber: '3135948595',
  birthdate: new Date('1995-12-04'),
  createdAt: new Date(),
  updatedAt: new Date(),
}
