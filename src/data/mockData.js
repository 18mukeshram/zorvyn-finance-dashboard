/**
 * Mock transaction data for the Zorvyn Finance Dashboard.
 * 25 realistic transactions spanning 6 months (Oct 2025 – Mar 2026).
 */

export const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Refund'],
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education'],
}

export const ALL_CATEGORIES = [...CATEGORIES.income, ...CATEGORIES.expense]

export const mockTransactions = [
  // --- October 2025 ---
  {
    id: '1',
    date: '2025-10-01',
    description: 'Monthly Salary',
    amount: 5200,
    category: 'Salary',
    type: 'income',
  },
  {
    id: '2',
    date: '2025-10-03',
    description: 'Grocery Shopping',
    amount: 142.5,
    category: 'Food',
    type: 'expense',
  },
  {
    id: '3',
    date: '2025-10-07',
    description: 'Uber Rides',
    amount: 38.75,
    category: 'Transport',
    type: 'expense',
  },
  {
    id: '4',
    date: '2025-10-12',
    description: 'Netflix & Spotify',
    amount: 25.98,
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: '5',
    date: '2025-10-18',
    description: 'Freelance Web Project',
    amount: 1800,
    category: 'Freelance',
    type: 'income',
  },
  {
    id: '6',
    date: '2025-10-22',
    description: 'Electricity Bill',
    amount: 95.4,
    category: 'Bills',
    type: 'expense',
  },

  // --- November 2025 ---
  {
    id: '7',
    date: '2025-11-01',
    description: 'Monthly Salary',
    amount: 5200,
    category: 'Salary',
    type: 'income',
  },
  {
    id: '8',
    date: '2025-11-05',
    description: 'New Running Shoes',
    amount: 129.99,
    category: 'Shopping',
    type: 'expense',
  },
  {
    id: '9',
    date: '2025-11-10',
    description: 'Restaurant Dinner',
    amount: 67.8,
    category: 'Food',
    type: 'expense',
  },
  {
    id: '10',
    date: '2025-11-15',
    description: 'Dividend Payout',
    amount: 340,
    category: 'Investment',
    type: 'income',
  },
  {
    id: '11',
    date: '2025-11-20',
    description: 'Internet Bill',
    amount: 59.99,
    category: 'Bills',
    type: 'expense',
  },

  // --- December 2025 ---
  {
    id: '12',
    date: '2025-12-01',
    description: 'Monthly Salary',
    amount: 5200,
    category: 'Salary',
    type: 'income',
  },
  {
    id: '13',
    date: '2025-12-05',
    description: 'Holiday Gifts',
    amount: 320,
    category: 'Shopping',
    type: 'expense',
  },
  {
    id: '14',
    date: '2025-12-10',
    description: 'Gym Membership',
    amount: 45,
    category: 'Health',
    type: 'expense',
  },
  {
    id: '15',
    date: '2025-12-18',
    description: 'Year-End Bonus',
    amount: 2500,
    category: 'Salary',
    type: 'income',
  },
  {
    id: '16',
    date: '2025-12-22',
    description: 'Flight Tickets',
    amount: 485,
    category: 'Transport',
    type: 'expense',
  },

  // --- January 2026 ---
  {
    id: '17',
    date: '2026-01-02',
    description: 'Monthly Salary',
    amount: 5400,
    category: 'Salary',
    type: 'income',
  },
  {
    id: '18',
    date: '2026-01-08',
    description: 'Online Course — React',
    amount: 199,
    category: 'Education',
    type: 'expense',
  },
  {
    id: '19',
    date: '2026-01-14',
    description: 'Groceries & Essentials',
    amount: 178.3,
    category: 'Food',
    type: 'expense',
  },
  {
    id: '20',
    date: '2026-01-25',
    description: 'Freelance UI Design',
    amount: 1200,
    category: 'Freelance',
    type: 'income',
  },

  // --- February 2026 ---
  {
    id: '21',
    date: '2026-02-01',
    description: 'Monthly Salary',
    amount: 5400,
    category: 'Salary',
    type: 'income',
  },
  {
    id: '22',
    date: '2026-02-09',
    description: 'Valentine Dinner',
    amount: 112,
    category: 'Food',
    type: 'expense',
  },
  {
    id: '23',
    date: '2026-02-14',
    description: 'Amazon Refund',
    amount: 89.99,
    category: 'Refund',
    type: 'income',
  },
  {
    id: '24',
    date: '2026-02-20',
    description: 'Phone Bill',
    amount: 42,
    category: 'Bills',
    type: 'expense',
  },

  // --- March 2026 ---
  {
    id: '25',
    date: '2026-03-01',
    description: 'Monthly Salary',
    amount: 5400,
    category: 'Salary',
    type: 'income',
  },
  {
    id: '26',
    date: '2026-03-06',
    description: 'Concert Tickets',
    amount: 150,
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: '27',
    date: '2026-03-12',
    description: 'Metro Pass',
    amount: 85,
    category: 'Transport',
    type: 'expense',
  },
  {
    id: '28',
    date: '2026-03-20',
    description: 'Stock Dividends',
    amount: 275,
    category: 'Investment',
    type: 'income',
  },
]
