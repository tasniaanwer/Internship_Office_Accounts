// Core Database Schema
// This file contains the core accounting tables: users, accounts, transactions, periods

import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Account Types enum
export const accountTypeEnum = text('type', {
  enum: ['asset', 'liability', 'equity', 'revenue', 'expense'],
});

// User Roles enum
export const userRoleEnum = text('role', {
  enum: ['admin', 'accountant', 'viewer'],
});

// Transaction Status enum
export const transactionStatusEnum = text('status', {
  enum: ['draft', 'posted', 'approved'],
});

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: userRoleEnum.notNull().default('viewer'),
  passwordHash: text('password_hash').notNull(),
  // Profile fields
  phone: text('phone'),
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  dateOfBirth: text('date_of_birth'),
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  roleIdx: index('users_role_idx').on(table.role),
  createdAtIdx: index('users_created_at_idx').on(table.createdAt),
}));

// Accounts table - Chart of Accounts
export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  type: accountTypeEnum.notNull(),
  parentId: text('parent_id'),
  description: text('description'),
  normalBalance: text('normal_balance', { enum: ['debit', 'credit'] }).notNull().default('debit'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  codeIdx: index('accounts_code_idx').on(table.code),
  nameIdx: index('accounts_name_idx').on(table.name),
  typeIdx: index('accounts_type_idx').on(table.type),
  parentIdIdx: index('accounts_parent_id_idx').on(table.parentId),
  isActiveIdx: index('accounts_is_active_idx').on(table.isActive),
  typeActiveIdx: index('accounts_type_active_idx').on(table.type, table.isActive),
}));

// Transactions table - Journal entries
export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  reference: text('reference').notNull().unique(),
  description: text('description').notNull(),
  status: transactionStatusEnum.notNull().default('draft'),
  createdBy: text('created_by').notNull().references(() => users.id),
  approvedBy: text('approved_by').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  dateIdx: index('transactions_date_idx').on(table.date),
  referenceIdx: index('transactions_reference_idx').on(table.reference),
  statusIdx: index('transactions_status_idx').on(table.status),
  createdByIdx: index('transactions_created_by_idx').on(table.createdBy),
  approvedByIdx: index('transactions_approved_by_idx').on(table.approvedBy),
  dateStatusIdx: index('transactions_date_status_idx').on(table.date, table.status),
}));

// Transaction Lines table - Individual debit/credit entries
export const transactionLines = sqliteTable('transaction_lines', {
  id: text('id').primaryKey(),
  transactionId: text('transaction_id').notNull().references(() => transactions.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull().references(() => accounts.id),
  description: text('description'),
  debit: real('debit').notNull().default(0),
  credit: real('credit').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  transactionIdIdx: index('transaction_lines_transaction_id_idx').on(table.transactionId),
  accountIdIdx: index('transaction_lines_account_id_idx').on(table.accountId),
  accountTransactionIdx: index('transaction_lines_account_transaction_idx').on(table.accountId, table.transactionId),
  accountDebitIdx: index('transaction_lines_account_debit_idx').on(table.accountId, table.debit),
  accountCreditIdx: index('transaction_lines_account_credit_idx').on(table.accountId, table.credit),
  createdAtIdx: index('transaction_lines_created_at_idx').on(table.createdAt),
}));

// Accounting Periods table
export const accountingPeriods = sqliteTable('accounting_periods', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  isClosed: integer('is_closed', { mode: 'boolean' }).notNull().default(false),
  fiscalYear: integer('fiscal_year').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  fiscalYearIdx: index('accounting_periods_fiscal_year_idx').on(table.fiscalYear),
  isClosedIdx: index('accounting_periods_is_closed_idx').on(table.isClosed),
  startEndIdx: index('accounting_periods_start_end_idx').on(table.startDate, table.endDate),
  nameIdx: index('accounting_periods_name_idx').on(table.name),
}));

// Export all core schema types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type TransactionLine = typeof transactionLines.$inferSelect;
export type NewTransactionLine = typeof transactionLines.$inferInsert;

export type AccountingPeriod = typeof accountingPeriods.$inferSelect;
export type NewAccountingPeriod = typeof accountingPeriods.$inferInsert;