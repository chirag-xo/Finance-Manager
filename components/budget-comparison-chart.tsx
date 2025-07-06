'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Budget, Transaction } from '@/types';
import { formatCurrency, getCurrentMonth } from '@/lib/data';
import { BarChart3 } from 'lucide-react';

interface BudgetComparisonChartProps {
  budgets: Budget[];
  transactions: Transaction[];
}

export function BudgetComparisonChart({ budgets, transactions }: BudgetComparisonChartProps) {
  const currentMonth = getCurrentMonth();
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);

  const chartData = currentMonthBudgets.map(budget => {
    const categoryTransactions = transactions.filter(t => 
      t.category === budget.category && 
      t.type === 'expense' && 
      t.date.startsWith(budget.month)
    );
    const actualSpent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      category: budget.category,
      budget: budget.amount,
      actual: actualSpent,
      remaining: Math.max(0, budget.amount - actualSpent),
    };
  });

  if (chartData.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No budget data</h3>
          <p className="text-gray-500 text-center">Set up budgets to see spending comparisons</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Budget vs Actual Spending
        </CardTitle>
        <CardDescription>
          Compare your planned budget with actual spending
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
            <Bar dataKey="actual" fill="#EF4444" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}