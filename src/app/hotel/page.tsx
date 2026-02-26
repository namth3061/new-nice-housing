"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "../../components/Layout/Navbar";
import { Footer } from "../../components/Layout/Footer";
import { ListView } from "../../views/ListView/ListView";
import { Hotel } from "../../types/hotel";
import { propertyToHotel } from "../../lib/propertyToHotel";

const PER_PAGE = 10;

export default function HotelListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageFromUrl = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const [toastMsg, setToastMsg] = useState<React.ReactNode | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setPage(Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1));
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/properties?page=${page}&limit=${PER_PAGE}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.list) {
          const list = Array.isArray(data.list) ? data.list : [];
          setHotels(list.map((p: Parameters<typeof propertyToHotel>[0]) => propertyToHotel(p)));
          setTotalPages(data.totalPages ?? 1);
          setTotal(data.total ?? 0);
        } else {
          setHotels([]);
          setTotalPages(1);
          setTotal(0);
        }
      })
      .catch(() => {
        setHotels([]);
        setTotalPages(1);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const goToPage = (p: number) => {
    const next = Math.max(1, Math.min(p, totalPages));
    setPage(next);
    const url = next === 1 ? "/hotel" : `/hotel?page=${next}`;
    router.push(url);
  };

  const showToast = (msg: React.ReactNode) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const goHome = () => router.push("/");
  const goList = () => router.push("/hotel");
  const onBack = () => router.push("/");
  const onNavigateToDetails = (hotel: Hotel) => router.push(`/hotel/${hotel.slug}`);

  return (
    <>
      {toastMsg && <div className="toast-overlay">{toastMsg}</div>}
      <Navbar view="list" goHome={goHome} goList={goList} showToast={showToast} />
      <main style={{ minHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: "1 0 auto" }}>
          <ListView
            hotels={hotels}
            loading={loading}
            onNavigateToDetails={onNavigateToDetails}
            onBack={onBack}
            showToast={showToast}
          />
        </div>
        {!loading && totalPages > 1 && (
          <nav className="pagination pagination-bottom" style={{ flex: "0 0 auto", marginTop: "32px", marginBottom: "48px", paddingTop: "24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", flexWrap: "wrap", paddingLeft: "24px", paddingRight: "24px" }}>
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
              Trang {page}/{totalPages} ({total} chỗ nghỉ)
            </span>
          </nav>
        )}
      </main>
      <Footer goList={goList} showToast={showToast} />
    </>
  );
}
