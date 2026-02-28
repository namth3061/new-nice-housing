"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, FileText, Shield, PenLine, Download, CheckCircle, AlertCircle } from "lucide-react";

const GOLD = "var(--a-gold)";

type ContentType = "terms" | "policy";

interface ContentSection {
  id: string;
  title: string;
  content: string;
}

function AdminContentEditor() {
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") || "terms") as ContentType;

  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  const apiPath = type === "terms" ? "/api/content/terms" : "/api/content/policy";
  const seedPath = type === "terms" ? "/api/content/terms/seed" : "/api/content/policy/seed";

  const loadSections = () => {
    setLoading(true);
    fetch(apiPath)
      .then((r) => r.json())
      .then((data) => setSections(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setEditingId(null);
    setSaveError(null);
    setSaveSuccess(false);
    setSeedError(null);
    loadSections();
  }, [type, apiPath]);

  const startEdit = (section: ContentSection) => {
    setEditingId(section.id);
    setEditTitle(section.title);
    setEditContent(section.content);
    setSaveError(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const res = await fetch(apiPath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, title: editTitle, content: editContent }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSections((prev) =>
          prev.map((s) => (s.id === editingId ? { ...s, title: editTitle, content: editContent } : s))
        );
        setEditingId(null);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        setSaveError(data?.error || "Không thể cập nhật. Vui lòng thử lại.");
      }
    } finally {
      setSaving(false);
    }
  };

  const loadDefaults = async () => {
    setSeeding(true);
    setSeedError(null);
    try {
      const res = await fetch(seedPath, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        loadSections();
      } else {
        setSeedError(data?.error || "Không thể tải nội dung mặc định.");
      }
    } finally {
      setSeeding(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const isTerms = type === "terms";
  const title = isTerms ? "Điều khoản sử dụng" : "Chính sách bảo mật";
  const Icon = isTerms ? FileText : Shield;

  return (
    <div className="admin-form-root">
      <div className="admin-form-header">
        <Link href="/admin/dashboard" className="admin-form-back" aria-label="Quay lại">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="admin-form-title">{title}</h1>
          <p className="admin-form-subtitle">Chỉnh sửa nội dung hiển thị trên trang công khai</p>
        </div>
      </div>

      <div className="admin-form-tabs">
        <Link href="/admin/content?type=terms" className={`admin-form-tab${isTerms ? " active" : ""}`} style={{ textDecoration: "none", color: "inherit" }}>
          <FileText size={13} /> Điều khoản
        </Link>
        <Link href="/admin/content?type=policy" className={`admin-form-tab${!isTerms ? " active" : ""}`} style={{ textDecoration: "none", color: "inherit" }}>
          <Shield size={13} /> Chính sách
        </Link>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", marginTop: 16, marginBottom: 8 }}>
        <button
          type="button"
          onClick={() => void loadDefaults()}
          disabled={seeding}
          className="admin-btn-ghost"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
        >
          <Download size={16} />
          {seeding ? "Đang tải..." : "Tải nội dung mặc định"}
        </button>
        {saveSuccess && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#15803d" }}>
            <CheckCircle size={16} /> Đã cập nhật
          </span>
        )}
        {saveError && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#b91c1c" }}>
            <AlertCircle size={16} /> {saveError}
          </span>
        )}
        {seedError && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#b91c1c" }}>
            <AlertCircle size={16} /> {seedError}
          </span>
        )}
      </div>

      {loading && <p className="admin-form-subtitle" style={{ marginTop: 8 }}>Đang tải...</p>}

      {!loading && sections.length === 0 && (
        <div className="admin-form-card" style={{ maxWidth: "500px" }}>
          <div className="admin-form-card-body">
            <p style={{ marginBottom: 16, color: "#64748b" }}>Chưa có nội dung. Nhấn nút bên trên để tải nội dung mặc định từ hệ thống, sau đó bạn có thể chỉnh sửa từng mục.</p>
            <button type="button" onClick={() => void loadDefaults()} disabled={seeding} className="admin-form-submit" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <Download size={16} /> {seeding ? "Đang tải..." : "Tải nội dung mặc định"}
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "800px" }}>
        {sections.map((section) => (
          <div key={section.id} className="admin-form-card">
            <div className="admin-form-card-header">
              <Icon size={14} style={{ color: GOLD }} />
              <span className="admin-form-card-header-title">
                {editingId === section.id ? "Đang chỉnh sửa" : section.title}
              </span>
              <div className="admin-form-card-header-dot" />
            </div>
            <div className="admin-form-card-body">
              {editingId === section.id ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div className="admin-form-field">
                    <label className="admin-form-label"><PenLine size={13} /> Tiêu đề mục</label>
                    <input type="text" className="admin-form-title-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Tiêu đề mục" />
                  </div>
                  <div className="admin-form-field">
                    <label className="admin-form-label">Nội dung</label>
                    <textarea className="admin-form-input" style={{ minHeight: "200px" }} value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="Nội dung..." />
                  </div>
                  <div className="admin-form-actions" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
                    <button type="button" onClick={cancelEdit} className="admin-btn-ghost">Hủy</button>
                    <button type="button" onClick={() => void saveEdit()} disabled={saving} className="admin-form-submit">
                      {saving ? "Đang lưu..." : "Cập nhật"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="admin-form-label" style={{ textTransform: "none", marginBottom: 8, fontWeight: 700, color: "#0f172a" }}>{section.title}</p>
                  <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.7, whiteSpace: "pre-line", marginBottom: 12 }}>{section.content}</p>
                  <button type="button" onClick={() => startEdit(section)} className="admin-form-back" style={{ fontSize: "13px", fontWeight: 600 }}>
                    <PenLine size={14} /> Chỉnh sửa
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminContentPage() {
  return (
    <Suspense fallback={<div className="admin-form-root"><p className="admin-form-subtitle">Đang tải...</p></div>}>
      <AdminContentEditor />
    </Suspense>
  );
}
