"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  FileText,
  Sparkles,
  X,
  Building2,
} from "lucide-react";

const GOLD = "#F5D060";

type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

interface BookingData {
  id: string;
  guest: string;
  email: string;
  phone: string;
  property: string;
  propertyId: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  status: BookingStatus;
  note?: string;
  paymentMethod?: string;
}

function FieldLabel({
  icon: Icon,
  children,
}: {
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <label className="admin-form-label">
      {Icon && <Icon size={13} />}
      {children}
    </label>
  );
}

export default function EditBookingPage() {
  const params = useParams();
  const router = useRouter();
  const code = params?.id as string;
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<BookingStatus>("Pending");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) {
      setLoading(false);
      return;
    }
    fetch(`/api/bookings/${encodeURIComponent(code)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setBooking(data ?? null);
        if (data) {
          setGuest(data.guest ?? "");
          setEmail(data.email ?? "");
          setPhone(data.phone ?? "");
          setStatus(data.status ?? "Pending");
          setNote(data.note ?? "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [code]);

  const handleSave = async () => {
    setError("");
    if (!guest.trim()) {
      setError("Vui lòng nhập tên khách hàng.");
      return;
    }
    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(code)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest: guest.trim(),
          email: email.trim(),
          phone: phone.trim(),
          status,
          note: note.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push("/admin/bookings");
        return;
      }
      setError(data?.error || "Không thể lưu. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-form-root">
        <div className="admin-form-header">
          <Link href="/admin/bookings" className="admin-form-back" aria-label="Quay lại">
            <ChevronLeft size={18} />
          </Link>
          <p className="admin-form-subtitle">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="admin-form-root">
        <div className="admin-form-header">
          <Link href="/admin/bookings" className="admin-form-back" aria-label="Quay lại">
            <ChevronLeft size={18} />
          </Link>
          <p className="admin-form-subtitle" style={{ color: "#b91c1c" }}>
            Không tìm thấy đơn hàng.
          </p>
          <Link href="/admin/bookings" style={{ color: GOLD, fontWeight: 700, marginTop: 8 }}>
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-form-root">
      <div className="admin-form-header">
        <Link href="/admin/bookings" className="admin-form-back" aria-label="Quay lại">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="admin-form-title">Chỉnh sửa đơn hàng</h1>
          <p className="admin-form-subtitle">{booking.id}</p>
        </div>
      </div>

      {error && (
        <div className="admin-form-error">
          <X size={15} /> {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className="admin-form-card">
          <div className="admin-form-card-header">
            <Building2 size={14} style={{ color: GOLD }} />
            <span className="admin-form-card-header-title">Thông tin đặt phòng (chỉ xem)</span>
            <div className="admin-form-card-header-dot" />
          </div>
          <div className="admin-form-card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", color: "#64748b", fontSize: "13px" }}>
              <p><strong style={{ color: "#0f172a" }}>Chỗ nghỉ:</strong> {booking.property}</p>
              <p><strong style={{ color: "#0f172a" }}>Nhận phòng:</strong> {booking.checkIn} → {booking.checkOut} ({booking.nights} đêm, {booking.guests} khách)</p>
              <p><strong style={{ color: "#0f172a" }}>Tổng:</strong> {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(booking.total)}</p>
            </div>
          </div>
        </div>

        <div className="admin-form-card">
          <div className="admin-form-card-header">
            <User size={14} style={{ color: GOLD }} />
            <span className="admin-form-card-header-title">Thông tin khách hàng</span>
            <div className="admin-form-card-header-dot" />
          </div>
          <div className="admin-form-card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="admin-form-field">
                <FieldLabel icon={User}>Tên khách hàng *</FieldLabel>
                <input
                  type="text"
                  className="admin-form-input"
                  value={guest}
                  onChange={(e) => setGuest(e.target.value)}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="admin-form-field">
                <FieldLabel icon={Mail}>Email *</FieldLabel>
                <input
                  type="email"
                  className="admin-form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div className="admin-form-field">
                <FieldLabel icon={Phone}>Số điện thoại</FieldLabel>
                <input
                  type="text"
                  className="admin-form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901234567"
                />
              </div>
              <div className="admin-form-field">
                <FieldLabel>Trạng thái</FieldLabel>
                <select
                  className="admin-form-input"
                  style={{ maxWidth: "220px" }}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BookingStatus)}
                >
                  <option value="Pending">Chờ xử lý</option>
                  <option value="Confirmed">Đã xác nhận</option>
                  <option value="Cancelled">Đã hủy</option>
                  <option value="Completed">Hoàn thành</option>
                </select>
              </div>
              <div className="admin-form-field">
                <FieldLabel icon={FileText}>Ghi chú</FieldLabel>
                <textarea
                  className="admin-form-input"
                  style={{ height: "80px" }}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú nội bộ..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <Link href="/admin/bookings" className="admin-form-cancel">
            Hủy bỏ
          </Link>
          <button onClick={() => void handleSave()} disabled={saving} className="admin-form-submit">
            {saving ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ animation: "admin-form-spin 1s linear infinite" }}
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                </svg>
                Đang lưu...
              </>
            ) : (
              <>
                <Sparkles size={15} /> Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
