import { query } from "@/lib/db";

export type UserRole = "user" | "host" | "admin";
export type UserStatus = "active" | "blocked";

export interface UserRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  password_hash?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserCreate {
  name: string;
  email: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

function toCamel(o: UserRow) {
  return {
    id: o.id,
    name: o.name,
    email: o.email,
    phone: o.phone,
    role: o.role,
    status: o.status,
    joinedAt: o.created_at,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
  };
}

export async function findAllUsers(filters?: { role?: string; search?: string }) {
  let sql = `
    SELECT u.id, u.name, u.email, u.phone, u.role, u.status, u.created_at, u.updated_at,
           COUNT(b.id)::int AS bookings_count
    FROM users u
    LEFT JOIN bookings b ON b.user_id = u.id
    WHERE 1=1
  `;
  const params: unknown[] = [];
  let i = 1;
  if (filters?.role && filters.role !== "all") {
    sql += ` AND u.role = $${i}`;
    params.push(filters.role);
    i++;
  }
  if (filters?.search) {
    sql += ` AND (u.name ILIKE $${i} OR u.email ILIKE $${i} OR u.phone ILIKE $${i})`;
    params.push(`%${filters.search}%`);
    i++;
  }
  sql += ` GROUP BY u.id ORDER BY u.created_at DESC`;
  const { rows } = await query<UserRow & { bookings_count: number }>(sql, params);
  return rows.map((r) => ({
    ...toCamel(r),
    bookingsCount: r.bookings_count,
  }));
}

export async function findUserById(id: number) {
  const { rows } = await query<UserRow>(
    "SELECT id, name, email, phone, role, status, created_at, updated_at FROM users WHERE id = $1",
    [id]
  );
  return rows[0] ? toCamel(rows[0]) : null;
}

/** For auth: returns id, email, role, password_hash. Use only for login. */
export async function findUserByEmailForAuth(email: string) {
  const normalized = email.trim().toLowerCase();
  const { rows } = await query<UserRow & { password_hash: string | null }>(
    "SELECT id, name, email, role, status, password_hash FROM users WHERE LOWER(email) = LOWER($1)",
    [normalized]
  );
  return rows[0] ?? null;
}

export async function createUser(data: UserCreate) {
  const { rows } = await query<UserRow>(
    `INSERT INTO users (name, email, phone, role, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role, status, created_at, updated_at`,
    [data.name, data.email, data.phone ?? "", data.role ?? "user", data.status ?? "active"]
  );
  return rows[0] ? toCamel(rows[0]) : null;
}

export async function updateUser(id: number, data: UserUpdate) {
  const { rows } = await query<UserRow>(
    `UPDATE users SET name = COALESCE($2, name), email = COALESCE($3, email), phone = COALESCE($4, phone),
      role = COALESCE($5, role), status = COALESCE($6, status), updated_at = NOW()
     WHERE id = $1
     RETURNING id, name, email, phone, role, status, created_at, updated_at`,
    [id, data.name, data.email, data.phone, data.role, data.status]
  );
  return rows[0] ? toCamel(rows[0]) : null;
}

export async function deleteUser(id: number) {
  const { rowCount } = await query("DELETE FROM users WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
}
