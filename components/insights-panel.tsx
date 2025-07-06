'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Budget, Transaction } from '@/types';
import { formatCurrency, getCurrentMonth } from '@/lib/data';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

interface InsightsPanelProps {
  budgets: Budget[];
  transactions: Transaction[];
}

export function InsightsPanel({ budgets, transactions }: InsightsPanelProps) {
  const currentMonth = getCurrentMonth();
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);
  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));

  const insights = [];

  // Budget insights
  currentMonthBudgets.forEach(budget => {
    const categoryTransactions = currentMonthTransactions.filter(t => 
      t.category === budget.category && t.type === 'expense'
    );
    const actualSpent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const percentage = (actualSpent / budget.amount) * 100;

    if (actualSpent > budget.amount) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: `${budget.category} Budget Exceeded`,
        description: `You've exceeded your ${budget.category} budget by ${formatCurrency(actualSpent - budget.amount)}`,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      });
    } else if (percentage > 80) {
      insights.push({
        type: 'caution',
        icon: TrendingUp,
        title: `${budget.category} Budget Alert`,
        description: `You've used ${percentage.toFixed(1)}% of your ${budget.category} budget`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
      });
    } else if (percentage < 50) {
      insights.push({
        type: 'positive',
        icon: CheckCircle,
        title: `${budget.category} Budget On Track`,
        description: `You're well within your ${budget.category} budget with ${formatCurrency(budget.amount - actualSpent)} remaining`,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      });
    }
  });

  // Spending pattern insights
  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  if (savingsRate > 20) {
    insights.push({
      type: 'positive',
      icon: TrendingUp,
      title: 'Excellent Savings Rate',
      description: `You're saving ${savingsRate.toFixed(1)}% of your income this month`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    });
  } else if (savingsRate < 10) {
    insights.push({
      type: 'tip',
      icon: Lightbulb,
      title: 'Improve Your Savings',
      description: `Consider reducing expenses to increase your savings rate from ${savingsRate.toFixed(1)}%`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    });
  }

  // Category-specific insights
  const categorySpending = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const highestSpendingCategory = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)[0];

  if (highestSpendingCategory) {
    const [category, amount] = highestSpendingCategory;
    const percentage = (amount / totalExpenses) * 100;
    
    if (percentage > 40) {
      insights.push({
        type: 'info',
        icon: TrendingDown,
        title: `${category} is Your Biggest Expense`,
        description: `${category} represents ${percentage.toFixed(1)}% of your total expenses (${formatCurrency(amount)})`,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
      });
    }
  }

  if (insights.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Lightbulb className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No insights yet</h3>
          <p className="text-gray-500 text-center">Add more transactions and budgets to get personalized insights</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Financial Insights
        </CardTitle>
        <CardDescription>
          Personalized recommendations based on your spending patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${insight.bgColor} ${insight.borderColor}`}
            >
              <div className="flex items-start gap-3">
                <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                <div className="flex-1">
                  <h4 className={`font-semibold ${insight.color}`}>{insight.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}