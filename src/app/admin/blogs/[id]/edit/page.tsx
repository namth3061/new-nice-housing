"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Upload, X, ImageIcon, Sparkles, Eye, PenLine, Tag, User, Calendar, FileText, AlignLeft } from "lucide-react";

const GOLD = "#F5D060";

function slugFromTitle(title: string): string {
  return title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || `post-${Date.now()}`;
}

function FieldLabel({ icon: Icon, children }: { icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <label className="admin-form-label">
      {Icon && <Icon size={13} />}
      {children}
    </label>
  );
}

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  const [post, setPost] = useState<{ id: number; slug: string; title: string; excerpt: string; content: string; category: string; author: string; date?: string; image?: string; status?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"visible" | "hidden">("visible");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
          setTitle(data.title ?? "");
          setSlug(data.slug ?? slugFromTitle(data.title ?? ""));
          setExcerpt(data.excerpt ?? "");
          setContent(data.content ?? "");
          setCategory(data.category ?? "");
          setAuthor(data.author ?? "");
          setDate(data.date ? new Date(data.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
          setStatus(data.status === "hidden" ? "hidden" : "visible");
          setImage(data.image ?? "");
          setImagePreview(data.image ?? null);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const syncSlugFromTitle = useCallback((newTitle: string) => {
    setTitle(newTitle);
    setSlug(slugFromTitle(newTitle));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setUploadError(file.size > 5 * 1024 * 1024 ? "Ảnh tối đa 5MB." : "Vui lòng chọn file ảnh.");
      e.target.value = "";
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    fetch("/api/upload/image", { method: "POST", body: formData })
      .then((r) => r.json().catch(() => ({})))
      .then((data) => {
        if (data?.url) {
          setImage(data.url);
          setImagePreview(data.url);
        } else {
          setUploadError(data?.error || "Tải ảnh lên thất bại.");
        }
      })
      .finally(() => setUploading(false));
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadError("");
      if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
        setUploadError(file.size > 5 * 1024 * 1024 ? "Ảnh tối đa 5MB." : "Vui lòng chọn file ảnh.");
        return;
      }
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      fetch("/api/upload/image", { method: "POST", body: formData })
        .then((r) => r.json().catch(() => ({})))
        .then((data) => {
          if (data?.url) {
            setImage(data.url);
            setImagePreview(data.url);
          } else {
            setUploadError(data?.error || "Tải ảnh lên thất bại.");
          }
        })
        .finally(() => setUploading(false));
    }
  };

  const clearImage = () => {
    setImage("");
    setImagePreview(null);
    setUploadError("");
  };

  const handleSave = async () => {
    setError("");
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề bài viết.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim() || slugFromTitle(title),
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          category: category.trim(),
          author: author.trim(),
          date: date || undefined,
          image: image.trim() || undefined,
          status,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push("/admin/blogs");
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
          <Link href="/admin/blogs" className="admin-form-back" aria-label="Quay lại">
            <ChevronLeft size={18} />
          </Link>
          <p className="admin-form-subtitle">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="admin-form-root">
        <div className="admin-form-header">
          <Link href="/admin/blogs" className="admin-form-back" aria-label="Quay lại">
            <ChevronLeft size={18} />
          </Link>
          <p className="admin-form-subtitle text-red-600">Không tìm thấy bài viết.</p>
          <Link href="/admin/blogs" className="text-sm font-semibold mt-2 inline-block" style={{ color: GOLD }}>
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-form-root">
      <div className="admin-form-header">
        <Link href="/admin/blogs" className="admin-form-back" aria-label="Quay lại">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="admin-form-title">Chỉnh sửa bài viết</h1>
          <p className="admin-form-subtitle">{post.slug}</p>
        </div>
      </div>

      <div className="admin-form-tabs">
        <button className={`admin-form-tab${activeTab === "edit" ? " active" : ""}`} onClick={() => setActiveTab("edit")}>
          <PenLine size={13} /> Soạn thảo
        </button>
        <button className={`admin-form-tab${activeTab === "preview" ? " active" : ""}`} onClick={() => setActiveTab("preview")}>
          <Eye size={13} /> Xem trước
        </button>
      </div>

      {error && (
        <div className="admin-form-error">
          <X size={15} /> {error}
        </div>
      )}

      {activeTab === "edit" ? (
        <div className="admin-form-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="admin-form-card">
              <div className="admin-form-card-header">
                <PenLine size={14} style={{ color: GOLD }} />
                <span className="admin-form-card-header-title">Thông tin cơ bản</span>
                <div className="admin-form-card-header-dot" />
              </div>
              <div className="admin-form-card-body">
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div className="admin-form-field">
                    <FieldLabel icon={Sparkles}>Tiêu đề bài viết *</FieldLabel>
                    <input
                      type="text"
                      className="admin-form-title-input"
                      value={title}
                      onChange={(e) => syncSlugFromTitle(e.target.value)}
                      placeholder="Nhập tiêu đề hấp dẫn..."
                    />
                  </div>
                  <div className="admin-form-field">
                    <FieldLabel icon={Tag}>Đường dẫn (slug)</FieldLabel>
                    <div className="admin-form-slug-wrap">
                      <span className="admin-form-slug-prefix">/blog/</span>
                      <input
                        type="text"
                        className="admin-form-input slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="tu-dong-tu-tieu-de"
                      />
                    </div>
                  </div>
                  <div className="admin-form-row2">
                    <div className="admin-form-field">
                      <FieldLabel icon={User}>Tác giả</FieldLabel>
                      <input type="text" className="admin-form-input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Tên tác giả" />
                    </div>
                    <div className="admin-form-field">
                      <FieldLabel icon={Tag}>Danh mục</FieldLabel>
                      <input type="text" className="admin-form-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ví dụ: Tin tức" />
                    </div>
                  </div>
                  <div className="admin-form-field">
                    <FieldLabel icon={Calendar}>Ngày đăng</FieldLabel>
                    <input type="date" className="admin-form-input" style={{ maxWidth: "200px" }} value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="admin-form-field">
                    <FieldLabel icon={Eye}>Trạng thái</FieldLabel>
                    <select
                      className="admin-form-input"
                      style={{ maxWidth: "200px" }}
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "visible" | "hidden")}
                    >
                      <option value="visible">Hiện (hiển thị trên website)</option>
                      <option value="hidden">Ẩn (chỉ quản trị viên)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-form-card">
              <div className="admin-form-card-header">
                <ImageIcon size={14} style={{ color: GOLD }} />
                <span className="admin-form-card-header-title">Ảnh bài viết</span>
                <div className="admin-form-card-header-dot" />
              </div>
              <div className="admin-form-card-body">
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" style={{ display: "none" }} onChange={handleImageChange} disabled={uploading} />
                {imagePreview ? (
                  <div className="admin-form-img-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button type="button" onClick={clearImage} className="admin-form-img-remove" aria-label="Xóa ảnh">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`admin-form-upload-zone${dragOver ? " drag-over" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                  >
                    <div className="admin-form-upload-icon">
                      <Upload size={22} />
                    </div>
                    <div>
                      <div className="admin-form-upload-title">{uploading ? "Đang tải lên..." : "Kéo thả ảnh vào đây"}</div>
                      <div className="admin-form-upload-sub">JPEG, PNG, GIF, WebP — tối đa 5MB</div>
                    </div>
                    {!uploading && (
                      <button type="button" className="admin-form-upload-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                        <Upload size={12} /> Chọn ảnh
                      </button>
                    )}
                  </div>
                )}
                {uploadError && <p style={{ fontSize: "13px", color: "#b91c1c", marginTop: "8px", fontWeight: 600 }}>{uploadError}</p>}
              </div>
            </div>

            <div className="admin-form-card">
              <div className="admin-form-card-header">
                <FileText size={14} style={{ color: GOLD }} />
                <span className="admin-form-card-header-title">Nội dung bài viết</span>
                <div className="admin-form-card-header-dot" />
              </div>
              <div className="admin-form-card-body">
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div className="admin-form-field">
                    <FieldLabel icon={AlignLeft}>Mô tả ngắn</FieldLabel>
                    <textarea
                      className="admin-form-input"
                      style={{ height: "90px" }}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Tóm tắt ngắn hiển thị trên danh sách bài viết..."
                    />
                  </div>
                  <div className="admin-form-field">
                    <FieldLabel icon={PenLine}>Nội dung chính</FieldLabel>
                    <textarea
                      className="admin-form-input"
                      style={{ height: "260px", minHeight: "160px" }}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Viết nội dung bài viết đầy đủ tại đây..."
                    />
                    <div className="admin-form-wc">
                      <span>{content.trim().split(/\s+/).filter(Boolean).length}</span> từ
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-form-actions">
              <Link href="/admin/blogs" className="admin-form-cancel">Hủy bỏ</Link>
              <button onClick={() => void handleSave()} disabled={saving} className="admin-form-submit">
                {saving ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "admin-form-spin 1s linear infinite" }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  <><Sparkles size={15} /> Lưu thay đổi</>
                )}
              </button>
            </div>
          </div>

          <div>
            <div className="admin-form-preview-card">
              <div className="admin-form-preview-header">
                <Eye size={13} className="admin-form-preview-eye" />
                <span className="admin-form-preview-label">Xem trước thẻ bài viết</span>
              </div>
              <div className="admin-form-preview-body">
                <div className="admin-form-preview-img-slot">
                  {imagePreview ? (
                    <img src={imagePreview} alt="" />
                  ) : (
                    <div className="admin-form-preview-img-empty">
                      <ImageIcon size={28} style={{ color: "#c4cdd8" }} />
                      <span className="admin-form-preview-img-empty-label">Chưa có ảnh</span>
                    </div>
                  )}
                </div>
                {category && (
                  <div className="admin-form-preview-category">
                    <Tag size={10} /> {category}
                  </div>
                )}
                <div className={`admin-form-preview-title${!title ? " admin-form-preview-placeholder" : ""}`}>
                  {title || "Tiêu đề bài viết sẽ hiển thị ở đây"}
                </div>
                <div className="admin-form-preview-meta">
                  {author && <span>{author}</span>}
                  {author && date && <span className="admin-form-preview-meta-dot" />}
                  {date && <span>{new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" })}</span>}
                </div>
                <p className={`admin-form-preview-excerpt${!excerpt ? " admin-form-preview-placeholder" : ""}`}>
                  {excerpt || "Mô tả ngắn sẽ xuất hiện tại đây."}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: "720px" }}>
          <div className="admin-form-card">
            <div className="admin-form-card-body">
              {imagePreview ? (
                <img src={imagePreview} alt="" style={{ width: "100%", borderRadius: "14px", aspectRatio: "16/9", objectFit: "cover", marginBottom: "24px" }} />
              ) : (
                <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: "14px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", flexDirection: "column", gap: "8px", color: "#94a3b8" }}>
                  <ImageIcon size={36} />
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>Chưa có ảnh bìa</span>
                </div>
              )}
              {category && <div className="admin-form-preview-category" style={{ marginBottom: "12px" }}><Tag size={10} /> {category}</div>}
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "28px", fontWeight: 800, color: "#0f172a", lineHeight: 1.3, marginBottom: "12px" }}>
                {title || <span style={{ color: "#c4cdd8" }}>Chưa có tiêu đề</span>}
              </h1>
              <div className="admin-form-preview-meta" style={{ marginBottom: "20px" }}>
                {author && <span>{author}</span>}
                {author && date && <span className="admin-form-preview-meta-dot" />}
                {date && <span>{new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" })}</span>}
              </div>
              {excerpt && (
                <p style={{ fontSize: "16px", color: "#475569", lineHeight: 1.7, fontStyle: "italic", borderLeft: `3px solid ${GOLD}`, paddingLeft: "16px", marginBottom: "24px" }}>
                  {excerpt}
                </p>
              )}
              <div style={{ fontSize: "15px", color: "#334155", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {content || <span style={{ color: "#c4cdd8", fontStyle: "italic" }}>Chưa có nội dung...</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
