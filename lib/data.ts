import { Transaction, Category, Budget, MonthlyData } from '@/types';

// Mock categories
export const categories: Category[] = [
  { id: '1', name: 'Food', color: '#FF6B6B', icon: '🍕' },
  { id: '2', name: 'Rent', color: '#4ECDC4', icon: '🏠' },
  { id: '3', name: 'Utilities', color: '#45B7D1', icon: '💡' },
  { id: '4', name: 'Transportation', color: '#96CEB4', icon: '🚗' },
  { id: '5', name: 'Entertainment', color: '#FFEAA7', icon: '🎬' },
  { id: '6', name: 'Shopping', color: '#DDA0DD', icon: '🛍️' },
  { id: '7', name: 'Healthcare', color: '#F39C12', icon: '⚕️' },
  { id: '8', name: 'Income', color: '#27AE60', icon: '💰' },
];

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 5000,
    description: 'Monthly Salary',
    date: '2024-01-01',
    category: 'Income',
    type: 'income'
  },
  {
    id: '2',
    amount: 1200,
    description: 'Rent Payment',
    date: '2024-01-02',
    category: 'Rent',
    type: 'expense'
  },
  {
    id: '3',
    amount: 150,
    description: 'Electricity Bill',
    date: '2024-01-03',
    category: 'Utilities',
    type: 'expense'
  },
  {
    id: '4',
    amount: 80,
    description: 'Grocery Shopping',
    date: '2024-01-04',
    category: 'Food',
    type: 'expense'
  },
  {
    id: '5',
    amount: 45,
    description: 'Bus Pass',
    date: '2024-01-05',
    category: 'Transportation',
    type: 'expense'
  },
  {
    id: '6',
    amount: 300,
    description: 'Weekend Shopping',
    date: '2024-01-06',
    category: 'Shopping',
    type: 'expense'
  },
  {
    id: '7',
    amount: 120,
    description: 'Movie Night',
    date: '2024-01-07',
    category: 'Entertainment',
    type: 'expense'
  },
  {
    id: '8',
    amount: 200,
    description: 'Doctor Visit',
    date: '2024-01-08',
    category: 'Healthcare',
    type: 'expense'
  },
];

// Mock budgets
export const mockBudgets: Budget[] = [
  { id: '1', category: 'Food', amount: 500, spent: 320, month: '2024-01' },
  { id: '2', category: 'Rent', amount: 1200, spent: 1200, month: '2024-01' },
  { id: '3', category: 'Utilities', amount: 200, spent: 150, month: '2024-01' },
  { id: '4', category: 'Transportation', amount: 100, spent: 45, month: '2024-01' },
  { id: '5', category: 'Entertainment', amount: 200, spent: 120, month: '2024-01' },
  { id: '6', category: 'Shopping', amount: 400, spent: 300, month: '2024-01' },
  { id: '7', category: 'Healthcare', amount: 300, spent: 200, month: '2024-01' },
];

// Mock monthly data
export const mockMonthlyData: MonthlyData[] = [
  { month: '2023-07', income: 5000, expenses: 3500, savings: 1500 },
  { month: '2023-08', income: 5000, expenses: 3200, savings: 1800 },
  { month: '2023-09', income: 5200, expenses: 3800, savings: 1400 },
  { month: '2023-10', income: 5000, expenses: 3100, savings: 1900 },
  { month: '2023-11', income: 5300, expenses: 3600, savings: 1700 },
  { month: '2023-12', income: 5500, expenses: 4200, savings: 1300 },
  { month: '2024-01', income: 5000, expenses: 2335, savings: 2665 },
];

// Utility functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export function getCategoryColor(categoryName: string): string {
  const category = categories.find(c => c.name === categoryName);
  return category?.color || '#6B7280';
}

export function getCategoryIcon(categoryName: string): string {
  const category = categories.find(c => c.name === categoryName);
  return category?.icon || '💰';
}