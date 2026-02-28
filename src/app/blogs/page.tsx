"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "../../components/Layout/Navbar";
import { Footer } from "../../components/Layout/Footer";
import { useLanguage } from "@/context/LanguageContext";

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

function BlogsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
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
    document.title = "Blog | Nine Housing";
  }, []);

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
    return d.toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <>
      {toastMsg && <div className="toast-overlay">{toastMsg}</div>}
      <Navbar showToast={showToast} />
      <main className="list-page page-transition" style={{ minHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: "1 0 auto" }}>
          <div className="section-header" style={{ marginBottom: "32px" }}>
            <div>
              <div className="section-eyebrow"><i className="fa-solid fa-newspaper"></i> {t("blogs.eyebrow")}</div>
              <h1 className="section-title">{t("blogs.title")}</h1>
            </div>
          </div>
          {loading && <p style={{ textAlign: "center", color: "var(--mid)" }}>{t("blogs.loading")}</p>}
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
            <p style={{ textAlign: "center", color: "var(--mid)", marginTop: "24px" }}>{t("blogs.no_posts")}</p>
          )}
        </div>
        {!loading && totalPages > 1 && (
          <nav className="pagination pagination-bottom" style={{ flex: "0 0 auto", marginTop: "32px", marginBottom: "48px", paddingTop: "24px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>

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

          </nav>
        )}
      </main>
      <Footer goList={() => router.push("/apartment")} showToast={showToast} />
    </>
  );
}

export default function BlogsPage() {
  return (
    <React.Suspense fallback={<div style={{ textAlign: "center", padding: "40px", color: "var(--mid)" }}>Đang tải...</div>}>
      <BlogsContent />
    </React.Suspense>
  );
}
