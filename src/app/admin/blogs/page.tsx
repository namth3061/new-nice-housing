"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit3, Trash2, Tag } from "lucide-react";

const THEME_COLOR = "#F5D060";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });

interface BlogPostRow {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  author: string;
  category: string;
  content: string;
}

export default function AdminBlogsPage() {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    setLoading(true);
    fetch(`/api/blogs?${params}`)
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search]);

  const filtered = posts;

  const handleDelete = async (id: number) => {
    if (typeof window === "undefined" || !window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>
            Quản lý Blog
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>
            Tin tức & bài viết hiển thị trên website
          </p>
        </div>
        <button className="admin-btn-gold">
          <Plus size={18} /> Thêm bài viết
        </button>
      </div>

      {/* Search */}
      <div className="admin-search-wrap" style={{ maxWidth: "400px" }}>
        <Search size={16} className="icon" />
        <input
          type="text"
          placeholder="Tìm theo tiêu đề, tác giả, danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input"
          style={{ width: "100%", paddingLeft: "40px" }}
        />
      </div>

      {/* Blog List as Cards */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Bài viết</th>
              <th>Tác giả</th>
              <th>Ngày đăng</th>
              <th style={{ textAlign: "right" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((post) => (
              <tr key={post.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <img
                      src={post.image}
                      alt=""
                      style={{ width: "64px", height: "48px", objectFit: "cover", borderRadius: "10px", flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 700, color: "#0f172a", margin: 0, fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {post.title}
                      </p>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "4px",
                        fontSize: "11px", fontWeight: 700, marginTop: "4px",
                        color: "#92670a", background: "rgba(245,208,96,0.15)",
                        padding: "2px 8px", borderRadius: "20px",
                      }}>
                        <Tag size={10} /> {post.category}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: "13px", color: "#475569", flexShrink: 0,
                    }}>
                      {post.author.charAt(0)}
                    </div>
                    <span style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>{post.author}</span>
                  </div>
                </td>
                <td style={{ fontSize: "13px", color: "#64748b" }}>{formatDate(post.date)}</td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px" }}>
                    <Link
                      href={`/admin/blogs/${post.id}/edit`}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: "34px", height: "34px", borderRadius: "8px",
                        border: "1px solid #e2e8f0", color: "#64748b", textDecoration: "none",
                        transition: "all 0.15s",
                      }}
                      title="Sửa"
                    >
                      <Edit3 size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: "34px", height: "34px", borderRadius: "8px",
                        border: "1px solid #fee2e2", color: "#ef4444", background: "none",
                        cursor: "pointer", transition: "all 0.15s",
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
          <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8" }}>Đang tải...</div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#cbd5e1" }}>
            <Search size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
            <p style={{ fontWeight: 600 }}>Không có bài viết nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
