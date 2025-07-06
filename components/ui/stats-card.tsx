import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, description, trend }: StatsCardProps) {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mb-2">{description}</p>
        )}
        {trend && (
          <Badge
            variant={trend.isPositive ? "default" : "secondary"}
            className={`text-xs ${
              trend.isPositive 
                ? "bg-green-100 text-green-800 hover:bg-green-200" 
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            {trend.isPositive ? "↗" : "↘"} {trend.value}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}