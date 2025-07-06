'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Budget, Transaction } from '@/types';
import { categories, formatCurrency, getCurrentMonth } from '@/lib/data';
import { Target, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface BudgetManagerProps {
  budgets: Budget[];
  transactions: Transaction[];
  onAddBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  onUpdateBudget: (id: string, budget: Partial<Budget>) => void;
}

export function BudgetManager({ budgets, transactions, onAddBudget, onUpdateBudget }: BudgetManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: getCurrentMonth(),
  });

  const currentMonth = getCurrentMonth();
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);

  // Calculate actual spending for each budget
  const budgetsWithSpending = currentMonthBudgets.map(budget => {
    const categoryTransactions = transactions.filter(t => 
      t.category === budget.category && 
      t.type === 'expense' && 
      t.date.startsWith(budget.month)
    );
    const actualSpent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...budget,
      spent: actualSpent,
      percentage: (actualSpent / budget.amount) * 100,
      status: actualSpent > budget.amount ? 'over' : 
               actualSpent > budget.amount * 0.8 ? 'warning' : 'on-track'
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category && formData.amount) {
      onAddBudget({
        category: formData.category,
        amount: Number(formData.amount),
        month: formData.month,
      });
      setFormData({ category: '', amount: '', month: getCurrentMonth() });
      setShowForm(false);
    }
  };

  const expenseCategories = categories.filter(c => c.name !== 'Income');

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Budget Manager
        </CardTitle>
        <CardDescription>
          Set and track your monthly spending limits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {!showForm ? (
            <Button onClick={() => setShowForm(true)}>
              Add Budget
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg border">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add Budget</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {budgetsWithSpending.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p>No budgets set for this month</p>
                <p className="text-sm">Add a budget to start tracking your spending</p>
              </div>
            ) : (
              budgetsWithSpending.map((budget) => (
                <div key={budget.id} className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{budget.category}</h3>
                      <Badge
                        variant={
                          budget.status === 'over' ? 'destructive' :
                          budget.status === 'warning' ? 'secondary' : 'default'
                        }
                      >
                        {budget.status === 'over' ? 'Over Budget' :
                         budget.status === 'warning' ? 'Near Limit' : 'On Track'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(budget.amount - budget.spent)} remaining
                      </div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={Math.min(budget.percentage, 100)} 
                    className="mb-2"
                  />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {budget.percentage.toFixed(1)}% used
                    </span>
                    {budget.status === 'over' && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Over by {formatCurrency(budget.spent - budget.amount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}