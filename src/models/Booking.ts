import { query } from "@/lib/db";

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

export interface BookingRow {
  id: number;
  code: string;
  user_id: number | null;
  property_id: number;
  guest: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  total: number;
  status: BookingStatus;
  note: string;
  payment_method: string;
  created_at: Date;
  updated_at: Date;
  property_name?: string;
}

export interface BookingCreate {
  code: string;
  userId?: number | null;
  propertyId: number;
  guest: string;
  email: string;
  phone?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  status?: BookingStatus;
  note?: string;
  paymentMethod?: string;
}

export interface BookingUpdate {
  status?: BookingStatus;
  guest?: string;
  email?: string;
  phone?: string;
  note?: string;
}

function toCamel(r: BookingRow) {
  return {
    id: r.code,
    code: r.code,
    dbId: r.id,
    userId: r.user_id,
    propertyId: r.property_id,
    property: r.property_name ?? "",
    guest: r.guest,
    email: r.email,
    phone: r.phone,
    checkIn: r.check_in,
    checkOut: r.check_out,
    nights: r.nights,
    guests: r.guests,
    total: r.total,
    status: r.status,
    note: r.note,
    paymentMethod: r.payment_method,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function findAllBookings(filters?: { status?: string; search?: string }) {
  let sql = `
    SELECT b.id, b.code, b.user_id, b.property_id, b.guest, b.email, b.phone,
           b.check_in, b.check_out, b.nights, b.guests, b.total, b.status, b.note, b.payment_method, b.created_at, b.updated_at,
           p.name AS property_name
    FROM bookings b
    LEFT JOIN properties p ON p.id = b.property_id
    WHERE 1=1
  `;
  const params: unknown[] = [];
  let i = 1;
  if (filters?.status && filters.status !== "all") {
    sql += ` AND b.status = $${i}`;
    params.push(filters.status);
    i++;
  }
  if (filters?.search) {
    sql += ` AND (b.code ILIKE $${i} OR b.guest ILIKE $${i} OR b.email ILIKE $${i} OR p.name ILIKE $${i})`;
    params.push(`%${filters.search}%`);
    i++;
  }
  sql += ` ORDER BY b.created_at DESC`;
  const { rows } = await query<BookingRow>(sql, params);
  return rows.map(toCamel);
}

export async function findBookingByCode(code: string) {
  const { rows } = await query<BookingRow>(
    `SELECT b.*, p.name AS property_name FROM bookings b LEFT JOIN properties p ON p.id = b.property_id WHERE b.code = $1`,
    [code]
  );
  return rows[0] ? toCamel(rows[0]) : null;
}

export async function findBookingById(id: number) {
  const { rows } = await query<BookingRow>(
    `SELECT b.*, p.name AS property_name FROM bookings b LEFT JOIN properties p ON p.id = b.property_id WHERE b.id = $1`,
    [id]
  );
  return rows[0] ? toCamel(rows[0]) : null;
}

export async function createBooking(data: BookingCreate) {
  const { rows } = await query<BookingRow>(
    `INSERT INTO bookings (code, user_id, property_id, guest, email, phone, check_in, check_out, nights, guests, total, status, note, payment_method)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     RETURNING id, code, user_id, property_id, guest, email, phone, check_in, check_out, nights, guests, total, status, note, payment_method, created_at, updated_at`,
    [
      data.code,
      data.userId ?? null,
      data.propertyId,
      data.guest,
      data.email,
      data.phone ?? "",
      data.checkIn,
      data.checkOut,
      data.nights,
      data.guests,
      data.total,
      data.status ?? "Pending",
      data.note ?? "",
      data.paymentMethod ?? "",
    ]
  );
  const r = rows[0];
  if (!r) return null;
  return { ...toCamel(r), property: "" };
}

export async function updateBookingStatus(id: number, status: BookingStatus) {
  const { rows } = await query<BookingRow>(
    `UPDATE bookings SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id, status]
  );
  if (!rows[0]) return null;
  const { rows: withProp } = await query<BookingRow>(
    `SELECT b.*, p.name AS property_name FROM bookings b LEFT JOIN properties p ON p.id = b.property_id WHERE b.id = $1`,
    [id]
  );
  return withProp[0] ? toCamel(withProp[0]) : toCamel(rows[0]);
}

export async function getBookingStats() {
  const { rows } = await query<{ total_revenue: string; total_bookings: string; pending_count: string }>(
    `SELECT
       COALESCE(SUM(total) FILTER (WHERE status IN ('Confirmed','Completed')), 0)::bigint AS total_revenue,
       COUNT(*)::text AS total_bookings,
       COUNT(*) FILTER (WHERE status = 'Pending')::text AS pending_count
     FROM bookings`
  );
  const r = rows[0];
  return {
    totalRevenue: Number(r?.total_revenue ?? 0),
    totalBookings: Number(r?.total_bookings ?? 0),
    pendingCount: Number(r?.pending_count ?? 0),
  };
}
