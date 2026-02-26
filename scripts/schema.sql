-- Nice Housing - PostgreSQL schema
-- Run: psql -U root -d nice_housing -f scripts/schema.sql
-- Or create DB first: CREATE DATABASE nice_housing;

-- Users (admin UI: name, email, phone, role, joinedAt, bookingsCount, status)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) DEFAULT '',
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'host', 'admin')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties (admin UI + hotel type: name, location, price, stars, image, images, amenities, specs, description, etc.)
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) DEFAULT '',
  province VARCHAR(100) DEFAULT '',
  district VARCHAR(100) DEFAULT '',
  ward VARCHAR(100) DEFAULT '',
  address TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image VARCHAR(500) DEFAULT '',
  images TEXT[] DEFAULT '{}',
  raw_price INTEGER NOT NULL DEFAULT 0,
  stars INTEGER DEFAULT 3 CHECK (stars >= 1 AND stars <= 5),
  rating DECIMAL(3,1) DEFAULT 0,
  reviews VARCHAR(50) DEFAULT '0',
  views VARCHAR(50) DEFAULT '0',
  badge VARCHAR(100) DEFAULT '',
  amenities TEXT[] DEFAULT '{}',
  specs JSONB DEFAULT '{}',
  detailed_amenities JSONB DEFAULT '[]',
  max_guests INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings (admin UI: id/code, guest, email, property, propertyId, checkIn, checkOut, nights, total, status, phone, guests, note)
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  guest VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT '',
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INTEGER NOT NULL DEFAULT 1,
  guests INTEGER NOT NULL DEFAULT 1,
  total INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed')),
  note TEXT DEFAULT '',
  payment_method VARCHAR(100) DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts (admin UI: title, category, author, excerpt, content, date, image)
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT DEFAULT '',
  date DATE DEFAULT CURRENT_DATE,
  image VARCHAR(500) DEFAULT '',
  author VARCHAR(255) DEFAULT '',
  category VARCHAR(100) DEFAULT '',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Terms sections (admin content page ?type=terms)
CREATE TABLE IF NOT EXISTS terms_sections (
  id SERIAL PRIMARY KEY,
  section_id VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policy sections (admin content page ?type=policy)
CREATE TABLE IF NOT EXISTS policy_sections (
  id SERIAL PRIMARY KEY,
  section_id VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common filters
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_stars ON properties(stars);
