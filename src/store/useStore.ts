// src/store/useStore.ts - FIXED VERSION
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  phoneNumber: string;
  name: string;
  email?: string;
}

interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'paid';
  amount: number;
  contact: string;
  note?: string;
  timestamp: Date;
  status?: 'completed' | 'pending' | 'failed';
}

interface Store {
  // User
  user: User | null;
  setUser: (user: User) => void;
  
  // Balance
  balance: number;
  balanceIsVisible: boolean;
  showBalance: () => void;
  hideBalance: () => void;
  toggleBalanceVisibility: () => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;

  // Actions
  sendMoney: (amount: number, to: string, note?: string) => void;
  requestMoney: (amount: number, from: string, note?: string) => void;
  payContact: (amount: number, to: string, note?: string) => void;
  addMoney: (amount: number) => void;

  // Add missing logout function
  logout: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // User
      user: { phoneNumber: '+1 (555) 123-4567', name: 'John Doe', email: 'john.doe@example.com' },
      setUser: (user) => set({ user }),

      // Balance - Start with hidden balance for security
      balance: 1250.75,
      balanceIsVisible: false,

      // Explicit balance visibility controls
      showBalance: () => set({ balanceIsVisible: true }),
      hideBalance: () => set({ balanceIsVisible: false }),
      toggleBalanceVisibility: () => set((state) => ({ balanceIsVisible: !state.balanceIsVisible })),

      // Transactions with status
      transactions: [
        {
          id: '1',
          type: 'received',
          amount: 50.00,
          contact: 'John Doe',
          note: 'Lunch',
          timestamp: new Date('2024-01-15T14:30:00'),
          status: 'completed'
        },
        {
          id: '2',
          type: 'sent',
          amount: 25.00,
          contact: 'Sarah Smith',
          note: 'Coffee',
          timestamp: new Date('2024-01-15T12:15:00'),
          status: 'completed'
        },
        {
          id: '3',
          type: 'received',
          amount: 100.00,
          contact: 'Mike Johnson',
          note: 'Birthday gift',
          timestamp: new Date('2024-01-14T16:45:00'),
          status: 'completed'
        }
      ],

      addTransaction: (transaction) => set((state) => ({
        transactions: [{
          ...transaction,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          status: 'completed'
        }, ...state.transactions]
      })),

      // Actions
      sendMoney: (amount, to, note) => {
        const { balance, addTransaction } = get();
        if (amount > balance) {
          alert('Insufficient balance');
          return;
        }
        set({ balance: balance - amount });
        addTransaction({ type: 'sent', amount, contact: to, note });
        alert(`Sent $${amount.toFixed(2)} to ${to}`);
      },

      requestMoney: (amount, from, note) => {
        const { addTransaction } = get();
        addTransaction({ type: 'received', amount, contact: from, note });
        alert(`Requested $${amount.toFixed(2)} from ${from}`);
      },

      payContact: (amount, to, note) => {
        const { balance, addTransaction } = get();
        if (amount > balance) {
          alert('Insufficient balance');
          return;
        }
        set({ balance: balance - amount });
        addTransaction({ type: 'paid', amount, contact: to, note });
      },

      addMoney: (amount) => {
        const { balance } = get();
        set({ balance: balance + amount });
        alert(`Added $${amount.toFixed(2)} to your balance`);
      },

      // Add logout function
      logout: () => {
        set({ 
          user: null,
          balance: 0,
          transactions: [],
          balanceIsVisible: false
        });
        alert('Logged out successfully');
      }
    }),
    {
      name: 'zwip-storage'
    }
  )
);
