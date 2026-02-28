"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Moon,
  Users,
  FileText,
  CreditCard,
  Sparkles,
  X,
} from "lucide-react";

const GOLD = "#F5D060";

type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

interface PropertyOption {
  id: number;
  name: string;
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

function parseDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const a = parseDate(checkIn);
  const b = parseDate(checkOut);
  if (!a || !b || b <= a) return 1;
  return Math.ceil((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000));
}

export default function NewBookingPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [propertyId, setPropertyId] = useState<number | "">("");
  const [guest, setGuest] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [nights, setNights] = useState(1);
  const [guests, setGuests] = useState(1);
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState<BookingStatus>("Pending");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Thẻ tín dụng");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setProperties(list.map((p: { id: number; name: string }) => ({ id: p.id, name: p.name || `Property #${p.id}` })));
        if (list.length && !propertyId) setPropertyId(list[0].id);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (checkIn && checkOut) {
      const n = nightsBetween(checkIn, checkOut);
      setNights(n >= 1 ? n : 1);
    }
  }, [checkIn, checkOut]);

  const handleCreate = async () => {
    setError("");
    if (!guest.trim()) {
      setError("Vui lòng nhập tên khách hàng.");
      return;
    }
    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }
    if (propertyId === "" || propertyId === undefined) {
      setError("Vui lòng chọn chỗ nghỉ.");
      return;
    }
    if (!checkIn || !checkOut) {
      setError("Vui lòng chọn ngày nhận phòng và trả phòng.");
      return;
    }
    const totalNum = parseFloat(total.replace(/[^\d.]/g, "")) || 0;
    setSaving(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: `BK-${Date.now()}`,
          propertyId: Number(propertyId),
          guest: guest.trim(),
          email: email.trim(),
          phone: phone.trim(),
          checkIn,
          checkOut,
          nights,
          guests,
          total: totalNum,
          status,
          note: note.trim() || undefined,
          paymentMethod: paymentMethod.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push("/admin/bookings");
        return;
      }
      setError(data?.error || "Không thể tạo đơn. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-form-root">
      <div className="admin-form-header">
        <Link href="/admin/bookings" className="admin-form-back" aria-label="Quay lại">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="admin-form-title">Thêm đơn đặt phòng</h1>
          <p className="admin-form-subtitle">Điền thông tin khách và chỗ nghỉ</p>
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
              <div className="admin-form-row2">
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
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form-card">
          <div className="admin-form-card-header">
            <Building2 size={14} style={{ color: GOLD }} />
            <span className="admin-form-card-header-title">Chỗ nghỉ & ngày đặt</span>
            <div className="admin-form-card-header-dot" />
          </div>
          <div className="admin-form-card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="admin-form-field">
                <FieldLabel icon={Building2}>Chỗ nghỉ *</FieldLabel>
                <select
                  className="admin-form-input"
                  value={propertyId === "" ? "" : propertyId}
                  onChange={(e) => setPropertyId(e.target.value === "" ? "" : Number(e.target.value))}
                >
                  <option value="">-- Chọn chỗ nghỉ --</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-form-row2">
                <div className="admin-form-field">
                  <FieldLabel icon={Calendar}>Ngày nhận phòng *</FieldLabel>
                  <input
                    type="date"
                    className="admin-form-input"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div className="admin-form-field">
                  <FieldLabel icon={Calendar}>Ngày trả phòng *</FieldLabel>
                  <input
                    type="date"
                    className="admin-form-input"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>
              <div className="admin-form-row2">
                <div className="admin-form-field">
                  <FieldLabel icon={Moon}>Số đêm</FieldLabel>
                  <input
                    type="number"
                    min={1}
                    className="admin-form-input"
                    value={nights}
                    onChange={(e) => setNights(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  />
                </div>
                <div className="admin-form-field">
                  <FieldLabel icon={Users}>Số khách</FieldLabel>
                  <input
                    type="number"
                    min={1}
                    className="admin-form-input"
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  />
                </div>
              </div>
              <div className="admin-form-field">
                <FieldLabel icon={CreditCard}>Tổng tiền (USD)</FieldLabel>
                <input
                  type="text"
                  className="admin-form-input"
                  value={total}
                  onChange={(e) => setTotal(e.target.value.replace(/[^\d.]/g, ""))}
                  placeholder="150"
                />
              </div>
              <div className="admin-form-row2">
                <div className="admin-form-field">
                  <FieldLabel>Trạng thái</FieldLabel>
                  <select
                    className="admin-form-input"
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
                  <FieldLabel icon={CreditCard}>Thanh toán</FieldLabel>
                  <select
                    className="admin-form-input"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Tiền mặt">Tiền mặt</option>
                    <option value="Chuyển khoản">Chuyển khoản</option>
                    <option value="Thẻ tín dụng">Thẻ tín dụng</option>
                  </select>
                </div>
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
          <button
            onClick={() => void handleCreate()}
            disabled={saving}
            className="admin-form-submit"
          >
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
                Đang tạo...
              </>
            ) : (
              <>
                <Sparkles size={15} /> Tạo đơn
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
