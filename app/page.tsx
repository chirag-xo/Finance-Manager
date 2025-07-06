'use client';

import { useState } from 'react';
import { StatsCard } from '@/components/ui/stats-card';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionList } from '@/components/transaction-list';
import { ExpenseChart } from '@/components/expense-chart';
import { CategoryChart } from '@/components/category-chart';
import { BudgetManager } from '@/components/budget-manager';
import { BudgetComparisonChart } from '@/components/budget-comparison-chart';
import { InsightsPanel } from '@/components/insights-panel';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Transaction, Budget } from '@/types';
import { mockTransactions, mockBudgets, formatCurrency, getCurrentMonth } from '@/lib/data';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Wallet } from 'lucide-react';

export default function Home() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', mockTransactions);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', mockBudgets);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const currentMonth = getCurrentMonth();
  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdateTransaction = (updatedTransaction: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      setTransactions(prev => prev.map(t => 
        t.id === editingTransaction.id 
          ? { ...updatedTransaction, id: editingTransaction.id }
          : t
      ));
      setEditingTransaction(null);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const handleUpdateBudget = (id: string, updatedBudget: Partial<Budget>) => {
    setBudgets(prev => prev.map(b => 
      b.id === id ? { ...b, ...updatedBudget } : b
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Personal Finance Dashboard
          </h1>
          <p className="text-gray-600">
            Track your expenses, manage budgets, and achieve your financial goals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            icon={TrendingUp}
            description="This month"
          />
          <StatsCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            icon={TrendingDown}
            description="This month"
          />
          <StatsCard
            title="Savings"
            value={formatCurrency(savings)}
            icon={PiggyBank}
            description={`${savingsRate.toFixed(1)}% of income`}
            trend={{
              value: `${savingsRate.toFixed(1)}%`,
              isPositive: savings > 0,
            }}
          />
          <StatsCard
            title="Transactions"
            value={transactions.length.toString()}
            icon={Wallet}
            description="Total recorded"
          />
        </div>

        {/* Transaction Form */}
        <div className="mb-8">
          <TransactionForm
            onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
            editingTransaction={editingTransaction}
            onCancel={() => setEditingTransaction(null)}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ExpenseChart transactions={transactions} />
          <CategoryChart transactions={transactions} />
        </div>

        {/* Budget Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BudgetManager
            budgets={budgets}
            transactions={transactions}
            onAddBudget={handleAddBudget}
            onUpdateBudget={handleUpdateBudget}
          />
          <BudgetComparisonChart budgets={budgets} transactions={transactions} />
        </div>

        {/* Insights */}
        <div className="mb-8">
          <InsightsPanel budgets={budgets} transactions={transactions} />
        </div>

        {/* Transaction List */}
        <TransactionList
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </div>
  );
}