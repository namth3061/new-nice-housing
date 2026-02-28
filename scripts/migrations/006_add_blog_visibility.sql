-- Migration: 006_add_blog_visibility
-- Add visibility status for blog posts (visible = show on website, hidden = admin only)
-- Run: psql -U root -d Nine_housing -f scripts/migrations/006_add_blog_visibility.sql

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'visible'
  CHECK (status IN ('visible', 'hidden'));

CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

COMMENT ON COLUMN blog_posts.status IS 'visible = hiển thị trên website, hidden = ẩn';
