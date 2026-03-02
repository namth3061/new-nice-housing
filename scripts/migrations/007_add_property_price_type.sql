-- Migration: 007_add_property_price_type
-- Description: Add price_type column to properties table

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS price_type VARCHAR(20) DEFAULT 'month';
