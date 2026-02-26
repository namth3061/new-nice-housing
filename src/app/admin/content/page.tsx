"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FileText, Shield } from "lucide-react";

const THEME_COLOR = "#F5D060";

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

  const apiPath = type === "terms" ? "/api/content/terms" : "/api/content/policy";

  useEffect(() => {
    setEditingId(null);
    setLoading(true);
    fetch(apiPath)
      .then((r) => r.json())
      .then((data) => setSections(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [type, apiPath]);

  const startEdit = (section: ContentSection) => {
    setEditingId(section.id);
    setEditTitle(section.title);
    setEditContent(section.content);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const res = await fetch(apiPath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, title: editTitle, content: editContent }),
      });
      if (res.ok) {
        setSections((prev) =>
          prev.map((s) => (s.id === editingId ? { ...s, title: editTitle, content: editContent } : s))
        );
        setEditingId(null);
      }
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const isTerms = type === "terms";
  const title = isTerms ? "Điều khoản sử dụng" : "Chính sách bảo mật";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {isTerms ? <FileText size={28} style={{ color: THEME_COLOR }} /> : <Shield size={28} style={{ color: THEME_COLOR }} />}
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            <p className="text-sm text-slate-500">Chỉnh sửa nội dung hiển thị trên trang công khai</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/content?type=terms"
          className={`px-4 py-2 rounded-xl font-semibold ${isTerms ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          Điều khoản
        </Link>
        <Link
          href="/admin/content?type=policy"
          className={`px-4 py-2 rounded-xl font-semibold ${!isTerms ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          Chính sách
        </Link>
      </div>

      {loading && <p className="text-slate-500">Đang tải...</p>}
      <div className="space-y-6 max-w-3xl">
        {sections.map((section) => (
          <div key={section.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            {editingId === section.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-3 border rounded-xl font-bold text-lg outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: THEME_COLOR }}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 border rounded-xl h-48 outline-none focus:ring-2 resize-y"
                  style={{ ["--tw-ring-color" as string]: THEME_COLOR }}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => void saveEdit()}
                    disabled={saving}
                    style={{ backgroundColor: THEME_COLOR }}
                    className="px-4 py-2 rounded-xl font-bold text-slate-900 hover:brightness-95 disabled:opacity-70"
                  >
                    {saving ? "Đang lưu..." : "Lưu"}
                  </button>
                  <button onClick={cancelEdit} className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100">
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2 mb-3">
                  {section.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
                <button
                  onClick={() => startEdit(section)}
                  className="mt-3 text-sm font-semibold"
                  style={{ color: THEME_COLOR }}
                >
                  Chỉnh sửa
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400">
        Lưu ý: Thay đổi ở đây đang dùng state tạm. Để lưu vĩnh viễn cần tích hợp API hoặc cập nhật file data (terms.ts / policy.ts).
      </p>
    </div>
  );
}

export default function AdminContentPage() {
  return (
    <Suspense fallback={<div className="text-slate-500">Đang tải...</div>}>
      <AdminContentEditor />
    </Suspense>
  );
}
