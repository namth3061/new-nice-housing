"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  CalendarCheck,
  Clock,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const THEME_COLOR = "#F5D060";

const formatVND = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const REVENUE_DATA = [
  { name: "Th1", revenue: 40000000, bookings: 240 },
  { name: "Th2", revenue: 30000000, bookings: 198 },
  { name: "Th3", revenue: 20000000, bookings: 150 },
  { name: "Th4", revenue: 27800000, bookings: 210 },
  { name: "Th5", revenue: 18900000, bookings: 120 },
  { name: "Th6", revenue: 23900000, bookings: 170 },
  { name: "Th7", revenue: 34900000, bookings: 250 },
];

const statusStyles: Record<string, string> = {
  Confirmed: "badge badge-green",
  Pending: "badge badge-amber",
  Cancelled: "badge badge-red",
  Completed: "badge badge-slate",
};

const statusLabels: Record<string, string> = {
  Confirmed: "Đã xác nhận",
  Pending: "Chờ xử lý",
  Cancelled: "Đã hủy",
  Completed: "Hoàn thành",
};

export default function DashboardPage() {
  const [statsData, setStatsData] = useState<{
    totalRevenue: number;
    totalBookings: number;
    pendingCount: number;
    newUsersThisMonth: number;
  } | null>(null);
  const [recentBookings, setRecentBookings] = useState<Array<{
    id: string;
    guest: string;
    property: string;
    total: number;
    status: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats").then((r) => r.json()),
      fetch("/api/dashboard/recent-bookings").then((r) => r.json()),
    ])
      .then(([stats, recent]) => {
        setStatsData(stats);
        setRecentBookings(Array.isArray(recent) ? recent : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: "Tổng doanh thu",
      value: statsData ? formatVND(statsData.totalRevenue) : "—",
      growth: "+12%",
      up: true,
      icon: DollarSign,
      iconBg: "rgba(245,208,96,0.15)",
      iconColor: "#92670a",
      sub: "so với tháng trước",
    },
    {
      label: "Tổng Booking",
      value: statsData?.totalBookings?.toLocaleString() ?? "—",
      growth: "+5.4%",
      up: true,
      icon: CalendarCheck,
      iconBg: "rgba(16,185,129,0.12)",
      iconColor: "#059669",
      sub: "đơn đặt phòng",
    },
    {
      label: "Chờ xử lý",
      value: String(statsData?.pendingCount ?? "—"),
      growth: "-2%",
      up: false,
      icon: Clock,
      iconBg: "rgba(239,68,68,0.1)",
      iconColor: "#dc2626",
      sub: "cần xử lý ngay",
    },
    {
      label: "Người dùng mới",
      value: String(statsData?.newUsersThisMonth ?? "—"),
      growth: "+18%",
      up: true,
      icon: Users,
      iconBg: "rgba(99,102,241,0.12)",
      iconColor: "#4f46e5",
      sub: "trong tháng này",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Page Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>
            Tổng quan hệ thống
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>
            Thống kê hoạt động của NiceHousing
          </p>
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#64748b",
            background: "white",
            border: "1px solid #e2e8f0",
            padding: "6px 14px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: 600,
          }}
        >
          <TrendingUp size={14} />
          Cập nhật lúc{" "}
          {new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {/* Stats Grid */}
      {loading && (
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>Đang tải thống kê...</p>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {stats.map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div
                className="admin-icon-box"
                style={{ background: stat.iconBg, color: stat.iconColor }}
              >
                <stat.icon size={22} />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  background: stat.up ? "#dcfce7" : "#fee2e2",
                  color: stat.up ? "#15803d" : "#b91c1c",
                }}
              >
                {stat.growth}
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, marginBottom: "4px" }}>
              {stat.label}
            </p>
            <p style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
              {stat.value}
            </p>
            <p style={{ fontSize: "11px", color: "#cbd5e1", marginTop: "4px" }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts + Recent */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px" }}>
        {/* Revenue Chart */}
        <div className="admin-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: "15px" }}>
                Phân tích doanh thu
              </h3>
              <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>7 tháng gần đây (VNĐ)</p>
            </div>
            <span className="badge badge-gold">
              <ArrowUpRight size={12} style={{ marginRight: "3px" }} /> +12% tháng này
            </span>
          </div>
          <div style={{ height: "280px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={THEME_COLOR} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={THEME_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickFormatter={(v) => `${v / 1000000}M`}
                  width={40}
                />
                <Tooltip
                  formatter={(value: number | undefined) =>
                    value != null ? formatVND(value) : ""
                  }
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                    fontSize: "13px",
                  }}
                  cursor={{ stroke: "#f1f5f9", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={THEME_COLOR}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: THEME_COLOR, stroke: "white", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: "15px", marginBottom: "20px" }}>
            Booking gần đây
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {recentBookings.map((bk) => (
              <Link
                key={bk.id}
                href={`/admin/bookings/${bk.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "14px",
                    color: "#475569",
                    flexShrink: 0,
                  }}
                >
                  {bk.guest.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {bk.guest}
                  </p>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {bk.property}
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                    {formatVND(bk.total)}
                  </p>
                  <span className={statusStyles[bk.status] || "badge badge-slate"} style={{ marginTop: "2px", fontSize: "10px" }}>
                    {statusLabels[bk.status] || bk.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
            <Link
              href="/admin/bookings"
              style={{ fontSize: "13px", fontWeight: 700, color: "#92670a", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
            >
              Xem tất cả đơn hàng <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
