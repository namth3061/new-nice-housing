"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "../../../components/Layout/Navbar";
import { Footer } from "../../../components/Layout/Footer";
import { useLanguage } from "@/context/LanguageContext";

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

function formatContent(text: string) {
  return text.split(/\n\n/).map((para, i) => {
    const parts = para.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={i} style={{ marginBottom: "1rem", lineHeight: 1.8 }}>
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j}>{part.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
      </p>
    );
  });
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const slug = useMemo(() => (params?.slug ? String(params.slug) : null), [params?.slug]);
  const [toastMsg, setToastMsg] = useState<React.ReactNode | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(!!slug);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/blogs/by-slug/${encodeURIComponent(slug)}`).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/blogs").then((r) => r.json()).then((d) => (Array.isArray(d) ? d : [])),
    ])
      .then(([p, list]) => {
        setPost(p ?? null);
        setAllPosts(list);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    const others = allPosts.filter((p) => p.id !== post.id);
    const sameCategory = others.filter((p) => p.category === post.category);
    const rest = others.filter((p) => p.category !== post.category);
    return [...sameCategory, ...rest].slice(0, 4);
  }, [post, allPosts]);

  useEffect(() => {
    if (post) document.title = `${post.title} | Nine Housing`;
    return () => { document.title = "Nine Housing"; };
  }, [post]);

  const showToast = (msg: React.ReactNode) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", { day: "numeric", month: "long", year: "numeric" });
  };

  if (slug == null) return null;
  if (loading) {
    return (
      <>
        <Navbar showToast={showToast} />
        <main className="list-page" style={{ minHeight: "80vh", paddingTop: "100px", textAlign: "center" }}>
          <p style={{ color: "var(--mid)" }}>{t("blogs.loading")}</p>
        </main>
        <Footer goList={() => router.push("/hotel")} showToast={showToast} />
      </>
    );
  }
  if (!post) {
    return (
      <>
        <Navbar showToast={showToast} />
        <main className="list-page" style={{ minHeight: "80vh", paddingTop: "100px", textAlign: "center" }}>
          <p>{t("blogs.post_not_found")}</p>
          <Link href="/blogs" className="btn-gold" style={{ display: "inline-block", width: "auto", marginTop: 16 }}>
            {t("blogs.back_to_blogs")}
          </Link>
        </main>
        <Footer goList={() => router.push("/hotel")} showToast={showToast} />
      </>
    );
  }

  return (
    <>
      {toastMsg && <div className="toast-overlay">{toastMsg}</div>}
      <Navbar showToast={showToast} />
      <main className="list-page page-transition" style={{ minHeight: "80vh" }}>
        <div className="breadcrumb">
          <Link href="/">{t("common.home")}</Link>
          <i className="fa-solid fa-chevron-right" style={{ fontSize: "10px" }} aria-hidden />
          <Link href="/blogs">{t("common.blogs")}</Link>
          <i className="fa-solid fa-chevron-right" style={{ fontSize: "10px" }} aria-hidden />
          <strong style={{ color: "var(--black)" }}>{post.title}</strong>
        </div>

        <div className="list-layout list-layout--blog" style={{ marginTop: "24px", alignItems: "start" }}>
          <article style={{ maxWidth: "800px", minWidth: 0 }}>
            <span className="card-badge" style={{ marginBottom: "12px", display: "inline-block" }}>{post.category}</span>
            <h1 className="section-title" style={{ marginBottom: "12px" }}>{post.title}</h1>
            <div style={{ fontSize: "14px", color: "var(--mid)", marginBottom: "24px" }}>
              {formatDate(post.date)} · {post.author}
            </div>
            <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "32px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={post.title} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <div style={{ color: "var(--charcoal)", fontSize: "15px" }}>{formatContent(post.content)}</div>
          </article>

          <aside className="filter-sidebar" style={{ position: "sticky", top: "100px" }}>
            <div className="filter-header" style={{ borderBottom: "none", paddingBottom: 0, marginBottom: "16px" }}>
              <h3 style={{ fontFamily: "Playfair Display", fontSize: "18px", color: "var(--black)" }}>{t("blogs.related_posts")}</h3>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {relatedPosts.map((related) => (
                <li key={related.id} style={{ marginBottom: "20px" }}>
                  <Link href={`/blogs/${related.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <div style={{ width: "72px", height: "72px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, background: "var(--gold-pale)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={related.image} alt={related.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: "11px", color: "var(--gold)", fontWeight: 600 }}>{related.category}</span>
                        <div style={{ fontFamily: "Playfair Display", fontSize: "14px", fontWeight: 600, color: "var(--black)", lineHeight: 1.35, marginTop: "4px" }}>
                          {related.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--mid)", marginTop: "4px" }}>{formatDate(related.date)}</div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
      <Footer goList={() => router.push("/apartment")} showToast={showToast} />
    </>
  );
}
