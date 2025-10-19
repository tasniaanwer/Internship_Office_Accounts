// Application constants

export const APP_CONFIG = {
  name: 'Accounting Pro',
  description: 'Professional Accounting Management System',
  version: '1.0.0',
} as const;

export const ACCOUNT_TYPES = {
  ASSET: 'asset',
  LIABILITY: 'liability',
  EQUITY: 'equity',
  REVENUE: 'revenue',
  EXPENSE: 'expense',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  ACCOUNTANT: 'accountant',
  VIEWER: 'viewer',
} as const;

export const TRANSACTION_STATUS = {
  DRAFT: 'draft',
  POSTED: 'posted',
  APPROVED: 'approved',
} as const;

export const NAVIGATION_ITEMS: Array<{
  title: string;
  href: string;
  icon: string;
  description?: string;
}> = [
  {
    title: 'Dashboard',
    href: '/',
    icon: 'layout-dashboard',
    description: 'Overview of financial metrics',
  },
  {
    title: 'Chart of Accounts',
    href: '/accounts',
    icon: 'account-tree',
    description: 'Manage account structure',
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: 'receipt',
    description: 'Record and manage transactions',
  },
    {
    title: 'Reports',
    href: '/reports',
    icon: 'file-text',
    description: 'Financial reports and analytics',
  },
  {
    title: 'Application Settings',
    href: '/settings',
    icon: 'settings',
    description: 'Application configuration and preferences',
  },
];