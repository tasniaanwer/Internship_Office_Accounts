-- Migration: Add profile fields to users table
-- This migration adds profile-related fields to the users table

-- Add new profile columns to users table
ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN location TEXT;
ALTER TABLE users ADD COLUMN website TEXT;
ALTER TABLE users ADD COLUMN date_of_birth TEXT;

-- Update existing users to have empty profile fields
UPDATE users SET
  phone = NULL,
  bio = NULL,
  location = NULL,
  website = NULL,
  date_of_birth = NULL
WHERE phone IS NULL OR bio IS NULL OR location IS NULL OR website IS NULL OR date_of_birth IS NULL;