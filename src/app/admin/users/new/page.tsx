"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Mail, Phone, ShieldCheck } from "lucide-react";

const STEPS = [
  { num: 1, label: "Thông tin liên hệ", icon: User },
  { num: 2, label: "Vai trò & Trạng thái", icon: ShieldCheck },
];

type UserRole = "user" | "host" | "admin";
type UserStatus = "active" | "blocked";

interface FormData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
}

const emptyForm: FormData = {
  name: "",
  email: "",
  phone: "",
  role: "user",
  status: "active",
};

function FieldLabel({ icon: Icon, children }: { icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <label className="admin-form-label">
      {Icon && <Icon size={13} />}
      {children}
    </label>
  );
}

export default function NewUserPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(emptyForm);

  const update = (part: Partial<FormData>) => setForm((f) => ({ ...f, ...part }));

  const handleSubmit = async () => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        role: form.role,
        status: form.status,
      }),
    });
    if (res.ok) router.push("/admin/users");
  };

  return (
    <div className="admin-form-root">
      <div className="admin-form-header">
        <Link href="/admin/users" className="admin-form-back" aria-label="Quay lại">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="admin-form-title">Thêm người dùng</h1>
          <p className="admin-form-subtitle">Hoàn thành 2 bước để tạo tài khoản mới</p>
        </div>
      </div>

      <div className="admin-form-steps">
        {STEPS.map(({ num, label, icon: Icon }) => {
          const isActive = step === num;
          const isDone = step > num;
          return (
            <button
              key={num}
              type="button"
              className={`admin-form-step${isActive ? " active" : ""}${isDone ? " done" : ""}`}
              onClick={() => setStep(num)}
              aria-current={isActive ? "step" : undefined}
            >
              <Icon size={13} />
              {label}
            </button>
          );
        })}
      </div>

      <div className="admin-form-card">
        <div className="admin-form-card-header">
          {React.createElement(STEPS[step - 1].icon, { size: 14, style: { color: "var(--a-gold)" } })}
          <span className="admin-form-card-header-title">{STEPS[step - 1].label}</span>
          <div className="admin-form-card-header-dot" />
        </div>
        <div className="admin-form-card-body" style={{ minHeight: "320px" }}>
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "420px" }}>
              <div className="admin-form-field">
                <FieldLabel icon={User}>Họ và tên</FieldLabel>
                <input
                  type="text"
                  className="admin-form-title-input"
                  placeholder="VD: Nguyễn Văn A"
                  value={form.name}
                  onChange={(e) => update({ name: e.target.value })}
                />
              </div>
              <div className="admin-form-field">
                <FieldLabel icon={Mail}>Email</FieldLabel>
                <input
                  type="email"
                  className="admin-form-input"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => update({ email: e.target.value })}
                />
              </div>
              <div className="admin-form-field">
                <FieldLabel icon={Phone}>Số điện thoại</FieldLabel>
                <input
                  type="tel"
                  className="admin-form-input"
                  placeholder="VD: 0901234567"
                  value={form.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "420px" }}>
              <div className="admin-form-field">
                <FieldLabel icon={ShieldCheck}>Vai trò</FieldLabel>
                <select
                  value={form.role}
                  onChange={(e) => update({ role: e.target.value as UserRole })}
                  className="admin-form-select"
                >
                  <option value="user">Khách hàng</option>
                  <option value="host">Chủ nhà</option>
                  <option value="admin">Quản trị</option>
                </select>
              </div>
              <div className="admin-form-field">
                <FieldLabel>Trạng thái</FieldLabel>
                <select
                  value={form.status}
                  onChange={(e) => update({ status: e.target.value as UserStatus })}
                  className="admin-form-select"
                >
                  <option value="active">Hoạt động</option>
                  <option value="blocked">Đã khóa</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="admin-form-actions" style={{ marginTop: 0, padding: "16px 24px", borderTop: "1px solid #f1f5f9" }}>
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => s - 1)}
            className="admin-btn-ghost"
            style={{ opacity: step === 1 ? 0.5 : 1, cursor: step === 1 ? "not-allowed" : "pointer" }}
          >
            Quay lại
          </button>
          {step < 2 ? (
            <button type="button" onClick={() => setStep((s) => s + 1)} className="admin-form-submit">
              Bước tiếp theo
            </button>
          ) : (
            <button type="button" onClick={() => void handleSubmit()} className="admin-form-submit">
              Xác nhận & Tạo tài khoản
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
