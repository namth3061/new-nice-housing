/**
 * Seed admin user with bcrypt-hashed password into the users table.
 * Usage: node scripts/seed-admin.js
 *
 * Login uses accounts from the users table only (role=admin, password_hash set).
 * This script creates/updates one admin in that table. No env required for account:
 * - Default: admin@nicehousing.vn / Admin123! (change after first login).
 * - Optional override: set ADMIN_EMAIL, ADMIN_PASSWORD in .env.local or .env.
 *
 * Requires: DATABASE_URL only.
 */

const path = require("path");
const fs = require("fs");
const { Client } = require("pg");
const bcrypt = require("bcrypt");

const PROJECT_ROOT = path.resolve(__dirname, "..");

const DEFAULT_ADMIN_EMAIL = "admin@nicehousing.vn";
const DEFAULT_ADMIN_PASSWORD = "Admin123!";

function loadEnvFile(filename) {
  const filepath = path.join(PROJECT_ROOT, filename);
  if (!fs.existsSync(filepath)) return;
  const content = fs.readFileSync(filepath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1).replace(/\\"/g, '"');
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1).replace(/\\'/g, "'");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").trim() || DEFAULT_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL. Set it in .env.local or .env");
  process.exit(1);
}

const SALT_ROUNDS = 10;
const ADMIN_NAME = process.env.ADMIN_NAME || "Quản trị viên";

async function seedAdmin() {
  const client = new Client({ connectionString: DATABASE_URL });
  try {
    await client.connect();
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

    const emailLower = ADMIN_EMAIL.trim().toLowerCase();
    const res = await client.query(
      `INSERT INTO users (name, email, phone, role, status, password_hash)
       VALUES ($1, $2, '', 'admin', 'active', $3)
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         role = 'admin',
         status = 'active',
         password_hash = EXCLUDED.password_hash,
         updated_at = NOW()
       RETURNING id, email, role, length(password_hash) as hash_len`,
      [ADMIN_NAME, emailLower, passwordHash]
    );
    const row = res.rows[0];
    const hashLen = row?.hash_len ?? passwordHash.length;

    console.log("Admin account seeded successfully:", emailLower);
    console.log("  role:", row?.role, "| password_hash length:", hashLen);
    console.log("Login at /admin/login with:");
    console.log("  Email:   ", emailLower);
    console.log("  Password:", ADMIN_PASSWORD === DEFAULT_ADMIN_PASSWORD ? "Admin123!" : "(value from ADMIN_PASSWORD)");
  } catch (err) {
    console.error("Seed admin failed:", err.message);
    if (err.message && err.message.includes("password_hash")) {
      console.error("Tip: Run 'npm run migrate' first to add the password_hash column.");
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedAdmin();
