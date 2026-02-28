"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Edit3, Trash2, FileText } from "lucide-react";
import Swal from "sweetalert2";

const THEME_COLOR = "#F5D060";

const formatUSD = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

interface Booking {
  id: string;
  guest: string;
  email: string;
  phone?: string;
  property: string;
  propertySlug?: string;
  propertyId: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
}

const statusConfig: Record<BookingStatus, { label: string; cls: string }> = {
  Pending: { label: "Chờ xử lý", cls: "badge badge-amber" },
  Confirmed: { label: "Đã xác nhận", cls: "badge badge-green" },
  Cancelled: { label: "Đã hủy", cls: "badge badge-red" },
  Completed: { label: "Hoàn thành", cls: "badge badge-slate" },
};

const ALL_STATUSES = Object.keys(statusConfig) as BookingStatus[];

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (search.trim()) params.set("search", search.trim());
    setLoading(true);
    fetch(`/api/bookings?${params}`)
      .then((r) => r.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, search]);

  const filtered = useMemo(() => bookings, [bookings]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: bookings.length };
    ALL_STATUSES.forEach((s) => (c[s] = bookings.filter((b) => b.status === s).length));
    return c;
  }, [bookings]);

  const handleStatusChange = async (code: string, newStatus: BookingStatus) => {
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(code)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === code ? { ...b, status: newStatus } : b))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteClick = (bk: Booking) => {
    Swal.fire({
      title: "Xóa đơn hàng",
      text: `Bạn có chắc muốn xóa đơn "${bk.id}" - ${bk.guest}? Hành động này không thể hoàn tác.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const res = await fetch(`/api/bookings/${encodeURIComponent(bk.id)}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete");
          return true;
        } catch (error) {
          Swal.showValidationMessage(`Không thể xóa: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        setBookings((prev) => prev.filter((b) => b.id !== bk.id));
        Swal.fire({
          title: "Đã xóa!",
          text: "Đơn hàng đã được xóa thành công.",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>
            Quản lý Đơn hàng
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>
            Tất cả đơn đặt phòng trên hệ thống
          </p>
        </div>
        <Link
          href="/admin/bookings/new"
          className="admin-btn-gold"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}
        >
          <Plus size={18} /> Thêm đơn
        </Link>
      </div>

      {/* Status Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #f1f5f9", paddingBottom: "0" }}>
        {[
          { key: "all", label: "Tất cả" },
          ...ALL_STATUSES.map((s) => ({ key: s, label: statusConfig[s].label })),
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key as BookingStatus | "all")}
            style={{
              padding: "10px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background: "transparent",
              borderBottom:
                statusFilter === tab.key ? `2px solid ${THEME_COLOR}` : "2px solid transparent",
              color: statusFilter === tab.key ? "#0f172a" : "#64748b",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "color 0.15s",
              fontFamily: "inherit",
            }}
          >
            {tab.label}
            <span
              style={{
                background: statusFilter === tab.key ? "rgba(245,208,96,0.2)" : "#f1f5f9",
                color: statusFilter === tab.key ? "#92670a" : "#94a3b8",
                fontSize: "11px",
                fontWeight: 700,
                padding: "1px 7px",
                borderRadius: "20px",
              }}
            >
              {counts[tab.key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="admin-search-wrap" style={{ maxWidth: "420px" }}>
        <Search size={16} className="icon" />
        <input
          type="text"
          placeholder="Tìm theo mã đơn, khách, chỗ nghỉ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input"
          style={{ width: "100%", paddingLeft: "40px" }}
        />
      </div>

      {/* Table */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>SĐT</th>
              <th>Chỗ nghỉ</th>
              <th>Nhận / Trả phòng</th>
              <th>Tổng cộng</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: "right" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((bk) => (
              <tr key={bk.id}>
                <td>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#0f172a",
                      background: "#f8fafc",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    {bk.id}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
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
                    <div>
                      <p style={{ fontWeight: 700, color: "#0f172a", margin: 0, fontSize: "14px" }}>
                        {bk.guest}
                      </p>
                      <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{bk.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: "13px", color: "#475569", fontWeight: 500 }}>
                  {bk.phone || "—"}
                </td>
                <td style={{ color: "#475569", fontWeight: 500, maxWidth: "180px" }}>
                  {bk.propertySlug ? (
                    <Link
                      href={`/apartment/${encodeURIComponent(bk.propertySlug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                        color: "#92670a",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                      title="Xem trên website"
                    >
                      {bk.property}
                    </Link>
                  ) : (
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {bk.property}
                    </div>
                  )}
                </td>
                <td>
                  <div style={{ fontSize: "13px", color: "#475569" }}>
                    <div style={{ fontWeight: 600, color: "#0f172a" }}>{formatDate(bk.checkIn)}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                      → {formatDate(bk.checkOut)} <span style={{ color: "#cbd5e1" }}>({bk.nights} đêm)</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "14px" }}>
                    {formatUSD(bk.total)}
                  </span>
                </td>
                <td>
                  <select
                    className="admin-select"
                    value={bk.status}
                    onChange={(e) => handleStatusChange(bk.id, e.target.value as BookingStatus)}
                    style={{
                      minWidth: "120px",
                      padding: "6px 28px 6px 10px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {statusConfig[s].label}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px" }}>
                    <Link
                      href={`/admin/bookings/${bk.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "34px",
                        height: "34px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        color: "#64748b",
                        textDecoration: "none",
                        transition: "all 0.15s",
                      }}
                      title="Chi tiết"
                    >
                      <FileText size={15} />
                    </Link>
                    <Link
                      href={`/admin/bookings/${bk.id}/edit`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "34px",
                        height: "34px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        color: "#64748b",
                        textDecoration: "none",
                        transition: "all 0.15s",
                      }}
                      title="Sửa"
                    >
                      <Edit3 size={15} />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(bk)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "34px",
                        height: "34px",
                        borderRadius: "8px",
                        border: "1px solid #fee2e2",
                        color: "#ef4444",
                        background: "none",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      title="Xóa"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8" }}>
            Đang tải...
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#cbd5e1" }}>
            <Search size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
            <p style={{ fontWeight: 600 }}>Không tìm thấy đơn hàng nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
