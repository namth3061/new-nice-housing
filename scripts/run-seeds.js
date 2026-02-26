/**
 * Run seed SQL files using the project's pg connection.
 * Usage: node scripts/run-seeds.js
 *
 * Loads DATABASE_URL from .env.local or .env (or existing process.env).
 * Runs all .sql files in scripts/seeds/ in order.
 */

const path = require("path");
const fs = require("fs");
const { Client } = require("pg");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const SEEDS_DIR = path.join(__dirname, "seeds");

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
if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL. Set it in .env.local or .env");
  process.exit(1);
}

function getSeedFiles() {
  if (!fs.existsSync(SEEDS_DIR)) {
    console.error("Seeds folder not found:", SEEDS_DIR);
    process.exit(1);
  }
  const files = fs.readdirSync(SEEDS_DIR).filter((f) => f.endsWith(".sql")).sort();
  return files.map((f) => path.join(SEEDS_DIR, f));
}

async function runSeeds() {
  const client = new Client({ connectionString: DATABASE_URL });
  const files = getSeedFiles();
  if (files.length === 0) {
    console.log("No .sql files found in scripts/seeds/");
    return;
  }
  try {
    await client.connect();
    console.log("Connected to database.\n");
    for (const filepath of files) {
      const name = path.basename(filepath);
      const sql = fs.readFileSync(filepath, "utf8");
      console.log("Running", name, "...");
      await client.query(sql);
      console.log("  OK\n");
    }
    console.log("All seeds finished.");
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSeeds();
