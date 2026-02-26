"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "../../components/Layout/Navbar";
import { Footer } from "../../components/Layout/Footer";

const PER_PAGE = 9;

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  author: string;
  category: string;
  content: string;
}

export default function BlogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageFromUrl = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const [toastMsg, setToastMsg] = useState<React.ReactNode | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const showToast = (msg: React.ReactNode) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  useEffect(() => {
    setPage(Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1));
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/blogs?page=${page}&limit=${PER_PAGE}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.list) {
          setPosts(Array.isArray(data.list) ? data.list : []);
          setTotalPages(data.totalPages ?? 1);
          setTotal(data.total ?? 0);
        } else {
          setPosts([]);
          setTotalPages(1);
          setTotal(0);
        }
      })
      .catch(() => {
        setPosts([]);
        setTotalPages(1);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const goToPage = (p: number) => {
    const next = Math.max(1, Math.min(p, totalPages));
    setPage(next);
    const url = next === 1 ? "/blogs" : `/blogs?page=${next}`;
    router.push(url);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <>
      {toastMsg && <div className="toast-overlay">{toastMsg}</div>}
      <Navbar showToast={showToast} />
      <main className="list-page page-transition" style={{ minHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: "1 0 auto" }}>
          <div className="section-header" style={{ marginBottom: "32px" }}>
            <div>
              <div className="section-eyebrow"><i className="fa-solid fa-newspaper"></i> Tin tức & Mẹo hay</div>
              <h1 className="section-title">Blogs</h1>
            </div>
          </div>
          {loading && <p style={{ textAlign: "center", color: "var(--mid)" }}>Đang tải...</p>}
          <div className="hotels-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
            {posts.map((post) => (
            <Link key={post.id} href={`/blogs/${post.slug}`} className="hotel-card" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="card-img" style={{ height: "200px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt={post.title} />
                <span className="card-badge">{post.category}</span>
              </div>
              <div className="card-body">
                <div style={{ fontSize: "12px", color: "var(--gold)", marginBottom: "8px" }}>
                  {formatDate(post.date)} · {post.author}
                </div>
                <div className="card-name" style={{ marginBottom: "8px" }}>{post.title}</div>
                <p style={{ fontSize: "14px", color: "var(--mid)", lineHeight: 1.6 }}>{post.excerpt}</p>
              </div>
            </Link>
            ))}
          </div>
          {!loading && posts.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--mid)", marginTop: "24px" }}>Chưa có bài viết nào.</p>
          )}
        </div>
        {!loading && totalPages > 1 && (
          <nav className="pagination pagination-bottom" style={{ flex: "0 0 auto", marginTop: "32px", marginBottom: "48px", paddingTop: "24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              style={{
                padding: "8px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                background: page <= 1 ? "#f1f5f9" : "#fff",
                cursor: page <= 1 ? "not-allowed" : "pointer",
                color: page <= 1 ? "#94a3b8" : "#475569",
                fontWeight: 600,
              }}
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                style={{
                  padding: "8px 12px",
                  minWidth: "40px",
                  border: p === page ? "2px solid var(--gold, #F5D060)" : "1px solid #e2e8f0",
                  borderRadius: "8px",
                  background: p === page ? "rgba(245,208,96,0.15)" : "#fff",
                  cursor: "pointer",
                  color: p === page ? "#92670a" : "#475569",
                  fontWeight: p === page ? 700 : 600,
                }}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              style={{
                padding: "8px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                background: page >= totalPages ? "#f1f5f9" : "#fff",
                cursor: page >= totalPages ? "not-allowed" : "pointer",
                color: page >= totalPages ? "#94a3b8" : "#475569",
                fontWeight: 600,
              }}
            >
              Sau
            </button>
            <span style={{ marginLeft: "12px", fontSize: "14px", color: "#64748b" }}>
              Trang {page}/{totalPages} ({total} bài)
            </span>
          </nav>
        )}
      </main>
      <Footer goList={() => router.push("/hotel")} showToast={showToast} />
    </>
  );
}
