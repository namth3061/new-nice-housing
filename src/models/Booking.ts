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
  property_slug?: string;
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
    propertySlug: r.property_slug ?? "",
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
           p.name AS property_name, p.slug AS property_slug
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

export async function updateBooking(id: number, data: BookingUpdate) {
  const updates: string[] = ["updated_at = NOW()"];
  const params: unknown[] = [];
  let i = 1;
  if (data.status !== undefined) {
    updates.push(`status = $${i++}`);
    params.push(data.status);
  }
  if (data.guest !== undefined) {
    updates.push(`guest = $${i++}`);
    params.push(data.guest);
  }
  if (data.email !== undefined) {
    updates.push(`email = $${i++}`);
    params.push(data.email);
  }
  if (data.phone !== undefined) {
    updates.push(`phone = $${i++}`);
    params.push(data.phone);
  }
  if (data.note !== undefined) {
    updates.push(`note = $${i++}`);
    params.push(data.note);
  }
  if (params.length === 0) return findBookingById(id);
  params.push(id);
  const sql = `UPDATE bookings SET ${updates.join(", ")} WHERE id = $${i} RETURNING *`;
  const { rows } = await query<BookingRow>(sql, params);
  if (!rows[0]) return null;
  const { rows: withProp } = await query<BookingRow>(
    `SELECT b.*, p.name AS property_name FROM bookings b LEFT JOIN properties p ON p.id = b.property_id WHERE b.id = $1`,
    [id]
  );
  return withProp[0] ? toCamel(withProp[0]) : toCamel(rows[0]);
}

export async function deleteBooking(id: number) {
  const { rowCount } = await query(
    `DELETE FROM bookings WHERE id = $1`,
    [id]
  );
  return (rowCount ?? 0) > 0;
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

/** Thống kê tháng này vs tháng trước để tính % growth (doanh thu, số booking, pending mới; không có newUsers). */
export async function getBookingStatsGrowth() {
  const { rows } = await query<{
    rev_this: string;
    rev_prev: string;
    count_this: string;
    count_prev: string;
    pending_this: string;
    pending_prev: string;
  }>(
    `SELECT
       COALESCE(SUM(total) FILTER (WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE) AND status IN ('Confirmed','Completed')), 0)::bigint AS rev_this,
       COALESCE(SUM(total) FILTER (WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE - INTERVAL '1 month') AND status IN ('Confirmed','Completed')), 0)::bigint AS rev_prev,
       COUNT(*) FILTER (WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE))::text AS count_this,
       COUNT(*) FILTER (WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE - INTERVAL '1 month'))::text AS count_prev,
       COUNT(*) FILTER (WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE) AND status = 'Pending')::text AS pending_this,
       COUNT(*) FILTER (WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE - INTERVAL '1 month') AND status = 'Pending')::text AS pending_prev
     FROM bookings`
  );
  const r = rows[0];
  const revThis = Number(r?.rev_this ?? 0);
  const revPrev = Number(r?.rev_prev ?? 0);
  const countThis = Number(r?.count_this ?? 0);
  const countPrev = Number(r?.count_prev ?? 0);
  const pendingThis = Number(r?.pending_this ?? 0);
  const pendingPrev = Number(r?.pending_prev ?? 0);

  const pct = (curr: number, prev: number) =>
    prev === 0 ? (curr === 0 ? 0 : 100) : Math.round(((curr - prev) / prev) * 1000) / 10;

  return {
    revenueGrowthPercent: pct(revThis, revPrev),
    bookingsGrowthPercent: pct(countThis, countPrev),
    pendingGrowthPercent: pct(pendingThis, pendingPrev),
  };
}

export interface RevenueByMonthRow {
  month: string;
  revenue: number;
  bookings: number;
}

/** Doanh thu và số booking theo tháng (7 tháng gần nhất, chỉ tính Confirmed + Completed). */
export async function getRevenueByMonth(): Promise<RevenueByMonthRow[]> {
  const { rows } = await query<{ month: string; revenue: string; bookings: string }>(
    `SELECT
       to_char(date_trunc('month', created_at), 'YYYY-MM') AS month,
       COALESCE(SUM(total) FILTER (WHERE status IN ('Confirmed','Completed')), 0)::bigint AS revenue,
       COUNT(*)::text AS bookings
     FROM bookings
     WHERE created_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '6 months'
     GROUP BY date_trunc('month', created_at)
     ORDER BY month ASC`
  );
  return rows.map((r) => ({
    month: r.month,
    revenue: Number(r.revenue ?? 0),
    bookings: Number(r.bookings ?? 0),
  }));
}

export type RevenuePeriod = "week" | "month" | "year";

export interface RevenueByPeriodRow {
  period: string;
  revenue: number;
  bookings: number;
}

/** Doanh thu theo kỳ: week = 7 ngày, month = 30 ngày, year = 12 tháng. Trả về đủ các điểm (0 nếu không có). */
export async function getRevenueByPeriod(period: RevenuePeriod): Promise<RevenueByPeriodRow[]> {
  if (period === "week") {
    const { rows } = await query<{ period: string; revenue: string; bookings: string }>(
      `SELECT
         to_char(d.d, 'YYYY-MM-DD') AS period,
         COALESCE(b.revenue, 0)::bigint AS revenue,
         COALESCE(b.bookings, 0)::bigint AS bookings
       FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day'::interval) AS d(d)
       LEFT JOIN (
         SELECT date_trunc('day', created_at)::date AS d,
                COALESCE(SUM(total) FILTER (WHERE status IN ('Confirmed','Completed')), 0)::bigint AS revenue,
                COUNT(*)::bigint AS bookings
         FROM bookings
         WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
         GROUP BY date_trunc('day', created_at)::date
       ) b ON d.d = b.d
       ORDER BY d.d ASC`
    );
    return rows.map((r) => ({
      period: r.period,
      revenue: Number(r.revenue ?? 0),
      bookings: Number(r.bookings ?? 0),
    }));
  }
  if (period === "month") {
    const { rows } = await query<{ period: string; revenue: string; bookings: string }>(
      `SELECT
         to_char(d.d, 'YYYY-MM-DD') AS period,
         COALESCE(b.revenue, 0)::bigint AS revenue,
         COALESCE(b.bookings, 0)::bigint AS bookings
       FROM generate_series(CURRENT_DATE - INTERVAL '29 days', CURRENT_DATE, '1 day'::interval) AS d(d)
       LEFT JOIN (
         SELECT date_trunc('day', created_at)::date AS d,
                COALESCE(SUM(total) FILTER (WHERE status IN ('Confirmed','Completed')), 0)::bigint AS revenue,
                COUNT(*)::bigint AS bookings
         FROM bookings
         WHERE created_at >= CURRENT_DATE - INTERVAL '29 days'
         GROUP BY date_trunc('day', created_at)::date
       ) b ON d.d = b.d
       ORDER BY d.d ASC`
    );
    return rows.map((r) => ({
      period: r.period,
      revenue: Number(r.revenue ?? 0),
      bookings: Number(r.bookings ?? 0),
    }));
  }
  // year: 12 months
  const { rows } = await query<{ period: string; revenue: string; bookings: string }>(
    `SELECT
       to_char(m.m, 'YYYY-MM') AS period,
       COALESCE(b.revenue, 0)::bigint AS revenue,
       COALESCE(b.bookings, 0)::bigint AS bookings
     FROM generate_series(
            date_trunc('month', CURRENT_DATE) - INTERVAL '11 months',
            date_trunc('month', CURRENT_DATE),
            '1 month'::interval
          ) AS m(m)
     LEFT JOIN (
       SELECT date_trunc('month', created_at) AS m,
              COALESCE(SUM(total) FILTER (WHERE status IN ('Confirmed','Completed')), 0)::bigint AS revenue,
              COUNT(*)::bigint AS bookings
       FROM bookings
       WHERE created_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '11 months'
       GROUP BY date_trunc('month', created_at)
     ) b ON m.m = b.m
     ORDER BY m.m ASC`
  );
  return rows.map((r) => ({
    period: r.period,
    revenue: Number(r.revenue ?? 0),
    bookings: Number(r.bookings ?? 0),
  }));
}
