import { TransactionTable } from '../components/TransactionTable'
import { transactions } from '../mocks/transactions.mock'

export function TransactionsPage() {
  return <TransactionTable transactions={transactions} />
}