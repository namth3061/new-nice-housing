"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Building2,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  Moon,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";

const THEME_COLOR = "#F5D060";

const formatUSD = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

interface BookingData {
  id: string;
  guest: string;
  email: string;
  phone: string;
  property: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
  note?: string;
  paymentMethod?: string;
}

const statusConfig: Record<BookingStatus, { label: string; cls: string; icon: React.ElementType; color: string; bg: string }> = {
  Pending: { label: "Chờ xử lý", cls: "badge badge-amber", icon: Clock, color: "#b45309", bg: "rgba(245,158,11,0.08)" },
  Confirmed: { label: "Đã xác nhận", cls: "badge badge-green", icon: CheckCircle2, color: "#15803d", bg: "rgba(16,185,129,0.08)" },
  Cancelled: { label: "Đã hủy", cls: "badge badge-red", icon: XCircle, color: "#b91c1c", bg: "rgba(239,68,68,0.08)" },
  Completed: { label: "Hoàn thành", cls: "badge badge-slate", icon: CheckCircle2, color: "#475569", bg: "rgba(100,116,139,0.08)" },
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 0", borderBottom: "1px solid #f8fafc" }}>
      <div style={{
        width: "34px", height: "34px", borderRadius: "8px",
        background: "rgba(245,208,96,0.1)", color: "#92670a",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={16} />
      </div>
      <div>
        <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>{label}</p>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", margin: "2px 0 0" }}>{value}</p>
      </div>
    </div>
  );
}

export default function BookingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<BookingStatus | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetch(`/api/bookings/${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setBooking(data ?? null);
        setStatus(data?.status ?? null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (newStatus: BookingStatus) => {
    if (!id || !booking) return;
    const res = await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setStatus(updated.status);
      setBooking((b) => (b ? { ...b, status: updated.status } : null));
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", color: "#94a3b8" }}>Đang tải...</div>
    );
  }

  if (!booking) {
    return (
      <div style={{ maxWidth: "600px", margin: "80px auto", textAlign: "center" }}>
        <p style={{ color: "#94a3b8", fontSize: "16px", marginBottom: "16px" }}>Không tìm thấy đơn hàng.</p>
        <Link href="/admin/bookings" className="admin-btn-gold" style={{ display: "inline-flex" }}>
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
      </div>
    );
  }

  const currentStatus = status ?? booking.status;
  const canChangeStatus = currentStatus === "Pending" || currentStatus === "Confirmed";
  const statusInfo = statusConfig[currentStatus];
  const StatusIcon = statusInfo.icon;

  const perNight = booking.total / booking.nights;
  const createdAtDisplay = typeof booking.createdAt === "string"
    ? booking.createdAt.slice(0, 10)
    : "";

  return (
    <div style={{ maxWidth: "900px", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Back + Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Link
          href="/admin/bookings"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "38px", height: "38px", borderRadius: "10px",
            border: "1px solid #e2e8f0", color: "#64748b",
            textDecoration: "none", transition: "all 0.15s",
            background: "white",
          }}
        >
          <ChevronLeft size={20} />
        </Link>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Chi tiết đơn hàng
            </h2>
            <span style={{
              fontFamily: "monospace", fontSize: "13px", fontWeight: 700,
              background: "#f1f5f9", border: "1px solid #e2e8f0",
              padding: "3px 10px", borderRadius: "6px", color: "#475569",
            }}>
              {booking.id}
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0", fontWeight: 500 }}>
            Đặt ngày {createdAtDisplay}
          </p>
        </div>

        {/* Status Badge large */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "10px 16px", borderRadius: "12px",
          background: statusInfo.bg,
          color: statusInfo.color, fontWeight: 700, fontSize: "14px",
        }}>
          <StatusIcon size={16} />
          {statusInfo.label}
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" }}>

        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Guest Info Card */}
          <div className="admin-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "20px", color: "#4f46e5" }}>
                {booking.guest.charAt(0)}
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: "17px", color: "#0f172a", margin: 0 }}>{booking.guest}</p>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0" }}>Khách hàng</p>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", marginTop: "16px" }}>
              <InfoRow icon={Mail} label="Email" value={booking.email} />
              <InfoRow icon={Phone} label="Số điện thoại" value={booking.phone} />
            </div>
          </div>

          {/* Property & Dates */}
          <div className="admin-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>
              Thông tin đặt phòng
            </h3>
            <InfoRow icon={Building2} label="Chỗ nghỉ" value={booking.property} />
            <InfoRow icon={Calendar} label="Nhận phòng" value={booking.checkIn} />
            <InfoRow icon={Calendar} label="Trả phòng" value={booking.checkOut} />
            <InfoRow icon={Moon} label="Số đêm" value={`${booking.nights} đêm`} />
            <InfoRow icon={Users} label="Số khách" value={`${booking.guests} khách`} />
            {booking.note && (
              <div style={{ marginTop: "16px", padding: "12px 16px", background: "rgba(239,68,68,0.06)", borderRadius: "10px", borderLeft: "3px solid #fca5a5" }}>
                <p style={{ fontSize: "12px", color: "#dc2626", fontWeight: 600, margin: 0 }}>Ghi chú: {booking.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Payment Card */}
          <div className="admin-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 20px" }}>
              Thanh toán
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#64748b" }}>Giá / đêm</span>
                <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "14px" }}>{formatUSD(perNight)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#64748b" }}>Số đêm</span>
                <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "14px" }}>× {booking.nights}</span>
              </div>
              <div style={{ height: "1px", background: "#f1f5f9", margin: "4px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>Tổng cộng</span>
                <span style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a" }}>
                  {formatUSD(booking.total)}
                </span>
              </div>
            </div>
            <div style={{ marginTop: "20px", padding: "12px", background: "#f8fafc", borderRadius: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard size={16} style={{ color: "#94a3b8" }} />
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                Phương thức: {booking.paymentMethod || "Thẻ tín dụng"}
              </span>
            </div>
          </div>

          {/* Actions Card */}
          {canChangeStatus && (
            <div className="admin-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>
                Thao tác
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {currentStatus !== "Confirmed" && (
                  <button
                    onClick={() => void updateStatus("Confirmed")}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
                      width: "100%", padding: "11px 16px", borderRadius: "10px",
                      background: "rgba(16,185,129,0.1)", color: "#059669",
                      border: "1px solid rgba(16,185,129,0.2)", fontWeight: 700, fontSize: "14px",
                      cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                    }}
                  >
                    <CheckCircle2 size={16} /> Xác nhận đơn
                  </button>
                )}
                {currentStatus === "Confirmed" && (
                  <button
                    onClick={() => void updateStatus("Completed")}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
                      width: "100%", padding: "11px 16px", borderRadius: "10px",
                      background: "#f1f5f9", color: "#475569",
                      border: "1px solid #e2e8f0", fontWeight: 700, fontSize: "14px",
                      cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                    }}
                  >
                    <CheckCircle2 size={16} /> Đánh dấu Hoàn thành
                  </button>
                )}
                <button
                  onClick={() => void updateStatus("Cancelled")}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
                    width: "100%", padding: "11px 16px", borderRadius: "10px",
                    background: "rgba(239,68,68,0.08)", color: "#dc2626",
                    border: "1px solid rgba(239,68,68,0.15)", fontWeight: 700, fontSize: "14px",
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                  }}
                >
                  <XCircle size={16} /> Hủy đơn
                </button>
              </div>
            </div>
          )}

          {/* Back Button */}
          <Link
            href="/admin/bookings"
            className="admin-btn-ghost"
            style={{ justifyContent: "center" }}
          >
            <ArrowLeft size={16} /> Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
}
