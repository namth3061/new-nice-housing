-- Migration: 003_add_password_hash
-- Add password_hash to users for admin login (bcrypt)

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) DEFAULT NULL;

COMMENT ON COLUMN users.password_hash IS 'Bcrypt hash for admin login; NULL for users without login';
