-- Migration: 004_add_property_status
-- Add status column: available | unavailable
-- Run: psql -U root -d Nine_housing -f scripts/migrations/004_add_property_status.sql

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'available'
  CHECK (status IN ('available', 'unavailable'));

COMMENT ON COLUMN properties.status IS 'available = đang cho thuê, unavailable = tạm ngừng';
