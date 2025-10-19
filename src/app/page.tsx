"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Users,
  Activity,
  BarChart3,
  PieChart,
  Receipt,
  CheckCircle,
  Clock,
  Eye
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  reference: string;
  description: string;
  status: 'draft' | 'posted' | 'approved';
  lines: Array<{
    debit: number;
    credit: number;
  }>;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  const fetchRecentTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions.slice(0, 5)); // Show only 5 most recent
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'posted': return <CheckCircle className="h-4 w-4" />;
      case 'approved': return <Eye className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'posted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate totals from transactions
  const totalDebit = transactions.reduce((sum, t) =>
    sum + t.lines.reduce((lineSum, line) => lineSum + line.debit, 0), 0);
  const totalCredit = transactions.reduce((sum, t) =>
    sum + t.lines.reduce((lineSum, line) => lineSum + line.credit, 0), 0);

  const handleExport = () => {
    // Create CSV content for dashboard summary
    const csvContent = [
      ['Dashboard Summary', '', '', ''],
      ['Metric', 'Amount', 'Count', 'Details'],
      ['Total Debits', totalDebit.toFixed(2), transactions.length, 'Sum of all debit amounts'],
      ['Total Credits', totalCredit.toFixed(2), transactions.length, 'Sum of all credit amounts'],
      ['Net Activity', (totalCredit - totalDebit).toFixed(2), '', 'Credit minus Debit'],
      ['', '', '', ''],
      ['Recent Transactions', '', '', ''],
      ['Date', 'Reference', 'Description', 'Status', 'Total Amount'],
      ...transactions.map(transaction => [
        transaction.date,
        transaction.reference,
        transaction.description,
        transaction.status,
        transaction.lines.reduce((sum, line) => sum + line.debit + line.credit, 0).toFixed(2)
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-summary-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            Export
          </Button>
          <Button asChild size="sm">
            <Link href="/transactions">
              <Receipt className="mr-2 h-4 w-4" />
              New Transaction
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debits</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalDebit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {transactions.length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalCredit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {transactions.length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Activity</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalCredit - totalDebit).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Credit minus Debit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">
              All transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest financial transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions yet. <Link href="/transactions" className="text-primary hover:underline">Create your first transaction</Link>.
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date} • {transaction.reference}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(transaction.status)}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1">{transaction.status}</span>
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          ${transaction.lines.reduce((sum, line) => sum + line.debit + line.credit, 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common accounting tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/transactions">
                <Receipt className="mr-2 h-4 w-4" />
                View All Transactions
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/accounts">
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Accounts
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/reports">
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Reports
              </Link>
            </Button>
                        <Separator />
            <div className="text-sm text-muted-foreground">
              <p>Fiscal Year 2024</p>
              <p className="font-medium text-foreground">Q4 in Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}