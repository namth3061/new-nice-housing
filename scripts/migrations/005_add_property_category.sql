-- Migration: 005_add_property_category
-- Add category (danh mục) for properties
-- Run: psql -U root -d nice_housing -f scripts/migrations/005_add_property_category.sql

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS category VARCHAR(255) DEFAULT '';

COMMENT ON COLUMN properties.category IS 'Danh mục chỗ nghỉ (text, e.g. Căn hộ, Biệt thự)';
