"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const THEME_COLOR = "#F5D060";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  const [post, setPost] = useState<{ id: number; slug: string; title: string; excerpt: string; content: string; category: string; author: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetch(`/api/blogs/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setPost(data);
        if (data) {
          setTitle(data.title);
          setExcerpt(data.excerpt ?? "");
          setContent(data.content ?? "");
          setCategory(data.category ?? "");
          setAuthor(data.author ?? "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-slate-500">Đang tải...</div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <p className="text-slate-500">Không tìm thấy bài viết.</p>
        <Link href="/admin/blogs" className="text-sm font-semibold mt-4 inline-block" style={{ color: THEME_COLOR }}>
          ← Quay lại
        </Link>
      </div>
    );
  }

  const inputClass = "w-full p-3 border rounded-xl outline-none focus:ring-2 border-slate-200";
  const focusRing = { ["--tw-ring-color" as string]: THEME_COLOR };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, excerpt, content, category, author }),
      });
      if (res.ok) router.push("/admin/blogs");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Chỉnh sửa bài viết</h2>
          <p className="text-sm text-slate-500">{post.slug}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Tiêu đề</label>
          <input type="text" className={inputClass} style={focusRing} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Danh mục</label>
            <input type="text" className={inputClass} style={focusRing} value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Tác giả</label>
            <input type="text" className={inputClass} style={focusRing} value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Mô tả ngắn</label>
          <textarea className={inputClass + " h-24"} style={focusRing} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Nội dung</label>
          <textarea className={inputClass + " h-64 resize-y"} style={focusRing} value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Link href="/admin/blogs" className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100">
          Hủy
        </Link>
        <button onClick={() => void handleSave()} disabled={saving} style={{ backgroundColor: THEME_COLOR }} className="px-6 py-2.5 rounded-xl font-bold text-slate-900 hover:brightness-95 disabled:opacity-70">
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}
