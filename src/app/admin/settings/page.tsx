"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Save, Globe, Mail, Phone, MapPin } from "lucide-react";

function FieldLabel({ icon: Icon, children }: { icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <label className="admin-form-label">
      {Icon && <Icon size={13} />}
      {children}
    </label>
  );
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [settings, setSettings] = useState({
    address_value_vi: "",
    address_value_en: "",
    phone_value: "",
    email_value: "",
    domain_value: "",
    banner_active: false,
    banner_image: "",
    banner_link: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.error("Failed to load settings", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setSettings((prev) => ({ ...prev, banner_image: data.url }));
        setMsg({ type: "success", text: "Tải ảnh lên thành công!" });
        setTimeout(() => setMsg(null), 3000);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch {
      setMsg({ type: "error", text: "Có lỗi khi tải ảnh lên." });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMsg({ type: "success", text: "Lưu thay đổi thành công!" });
        setTimeout(() => setMsg(null), 3000);
      } else {
        throw new Error("Lỗi khi lưu");
      }
    } catch {
      setMsg({ type: "error", text: "Có lỗi xảy ra khi lưu thiết lập." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-form-root">
        <div className="admin-form-header">
          <Link href="/admin/dashboard" className="admin-form-back" aria-label="Quay lại">
            <ChevronLeft size={18} />
          </Link>
          <p className="admin-form-subtitle">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-form-root">
      <div className="admin-form-header">
        <Link href="/admin/dashboard" className="admin-form-back" aria-label="Quay lại">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="admin-form-title">Cài đặt thông tin liên hệ</h1>
          <p className="admin-form-subtitle">Quản lý thông tin hiển thị ở Footer trang web</p>
        </div>
      </div>

      {msg && (
        <div
          className="admin-form-error"
          style={{
            backgroundColor: msg.type === "success" ? "#dcfce7" : "#fee2e2",
            color: msg.type === "success" ? "#166534" : "#991b1b",
            border: "none",
          }}
        >
          {msg.text}
        </div>
      )}

      {/* BANNER MANAGEMENT */}
      <div className="admin-form-card" style={{ marginBottom: 24 }}>
        <div className="admin-form-card-header">
          <Globe size={14} style={{ color: "var(--a-gold)" }} />
          <span className="admin-form-card-header-title">Quản lý Banner Top</span>
          <div className="admin-form-card-header-dot" />
        </div>
        <div className="admin-form-card-body" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600 }}>
            <input
              type="checkbox"
              name="banner_active"
              checked={settings.banner_active}
              onChange={handleChange}
              style={{ width: "18px", height: "18px", accentColor: "var(--a-gold)", cursor: "pointer" }}
            />
            Bật hiển thị Banner trên Website
          </label>

          <div className="admin-form-field">
            <FieldLabel icon={Globe}>Hình ảnh Banner</FieldLabel>
            {settings.banner_image && (
              <div style={{ marginBottom: "12px", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={settings.banner_image} alt="Banner Preview" style={{ width: "100%", maxHeight: "150px", objectFit: "cover", display: "block" }} />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="admin-form-input"
              style={{ padding: "8px" }}
              disabled={saving}
            />
            <p style={{ fontSize: "12px", color: "#64748b", marginTop: "6px" }}>
              Upload ảnh ngang (ví dụ: 1920x200px) để hiển thị đẹp nhất.
            </p>
          </div>

          <div className="admin-form-field">
            <FieldLabel icon={Globe}>Đường dẫn chuyển hướng (Link)</FieldLabel>
            <input
              type="text"
              name="banner_link"
              value={settings.banner_link}
              onChange={handleChange}
              className="admin-form-input"
              placeholder="VD: /apartment hoặc https://example.com"
            />
          </div>

        </div>
      </div>

      <div className="admin-form-card">
        <div className="admin-form-card-header">
          <Globe size={14} style={{ color: "var(--a-gold)" }} />
          <span className="admin-form-card-header-title">Thông tin liên hệ</span>
          <div className="admin-form-card-header-dot" />
        </div>
        <form onSubmit={handleSave} className="admin-form-card-body" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="admin-form-field">
            <FieldLabel icon={Globe}>Tên miền (Website)</FieldLabel>
            <input
              type="text"
              name="domain_value"
              value={settings.domain_value}
              onChange={handleChange}
              className="admin-form-input"
              placeholder="VD: ninehousing.com"
            />
          </div>

          <div className="admin-form-row2">
            <div className="admin-form-field">
              <FieldLabel icon={Mail}>Email liên hệ</FieldLabel>
              <input
                type="email"
                name="email_value"
                value={settings.email_value}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="VD: contact@ninehousing.com"
              />
            </div>
            <div className="admin-form-field">
              <FieldLabel icon={Phone}>Số điện thoại</FieldLabel>
              <input
                type="text"
                name="phone_value"
                value={settings.phone_value}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="VD: 1900 1234"
              />
            </div>
          </div>

          <div className="admin-form-field">
            <FieldLabel icon={MapPin}>Địa chỉ (Tiếng Việt)</FieldLabel>
            <input
              type="text"
              name="address_value_vi"
              value={settings.address_value_vi}
              onChange={handleChange}
              className="admin-form-input"
              placeholder="VD: 123 Trần Phú, Ba Đình, Hà Nội"
            />
          </div>

          <div className="admin-form-field">
            <FieldLabel icon={MapPin}>Địa chỉ (Tiếng Anh)</FieldLabel>
            <input
              type="text"
              name="address_value_en"
              value={settings.address_value_en}
              onChange={handleChange}
              className="admin-form-input"
              placeholder="VD: 123 Tran Phu Street, Ba Dinh, Hanoi"
            />
          </div>

          <div className="admin-form-actions" style={{ marginTop: 8, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
            <Link href="/admin/dashboard" className="admin-btn-ghost">
              Hủy
            </Link>
            <button type="submit" disabled={saving} className="admin-form-submit">
              {saving ? (
                "Đang lưu..."
              ) : (
                <>
                  <Save size={15} /> Lưu thiết lập
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
