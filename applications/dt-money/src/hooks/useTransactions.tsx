import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { api } from '../services/api';

interface ITransaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

interface ITransactionsProviderProps {
    children: ReactNode;
}

// interface ITransactionInput {
//     title: string;
//     amount: number;
//     type: string;
//     category: string;
// }

// Alternative for creating a new interface
type TransactionInput = Omit<ITransaction, 'id' | 'createdAt'>

// Pick also can be used like
// type TransactionInput = Pick<ITransaction, 'title' | 'amount' | 'type' | 'category'>

interface ITransactionsContextData {
    transactions: ITransaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<ITransactionsContextData>({} as ITransactionsContextData);

export function TransactionsProvider({children}:ITransactionsProviderProps) {

  const [transactions, setTransactions] = useState<ITransaction[]>([]); 

  useEffect(() => {
    api.get('/transactions').then(response => setTransactions(response.data.transactions));
  }, []);

  async function createTransaction(transactionInput:TransactionInput) {
    const response = await api.post('/transactions', {
        ...transactionInput,
        createdAt: new Date()
    });
    const { transaction } = response.data;

    setTransactions([...transactions, transaction]);
  }

  return (
      <TransactionsContext.Provider value={{ transactions, createTransaction}}>
          {children}
      </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}
