"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "../../../components/Layout/Navbar";
import { Footer } from "../../../components/Layout/Footer";
import { DetailsView } from "../../../views/DetailsView/DetailsView";
import { Hotel } from "../../../types/hotel";
import { propertyToHotel } from "../../../lib/propertyToHotel";

export default function HotelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = useMemo(() => (params?.slug ? String(params.slug) : null), [params?.slug]);
  const [toastMsg, setToastMsg] = useState<React.ReactNode | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    setLoading(true);
    setNotFound(false);
    fetch(`/api/properties/by-slug/${encodeURIComponent(slug)}`)
      .then((r) => {
        if (!r.ok) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setHotel(propertyToHotel(data));
        else setHotel(null);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (hotel) {
      document.title = `${hotel.name} | NiceHousing`;
    }
    return () => {
      document.title = "NiceHousing";
    };
  }, [hotel]);

  const showToast = (msg: React.ReactNode) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const goHome = () => router.push("/");
  const goList = () => router.push("/hotel");
  const onBack = () => router.push("/hotel");
  const onBook = (h: Hotel) => router.push(`/hotel/${h.slug}/checkout`);
  const onNavigateToDetails = (h: Hotel) => router.push(`/hotel/${h.slug}`);

  if (loading) {
    return (
      <>
        <Navbar view="list" goHome={goHome} goList={goList} showToast={showToast} />
        <main style={{ minHeight: "80vh", paddingTop: "100px", textAlign: "center" }}>
          <p>Đang tải...</p>
        </main>
        <Footer goList={goList} showToast={showToast} />
      </>
    );
  }

  if (slug == null || notFound || !hotel) {
    return (
      <>
        <Navbar view="list" goHome={goHome} goList={goList} showToast={showToast} />
        <main style={{ minHeight: "80vh", paddingTop: "100px", textAlign: "center" }}>
          <p>Không tìm thấy khách sạn.</p>
          <button className="btn-gold" style={{ width: "auto", marginTop: 16 }} onClick={onBack}>
            Quay lại danh sách
          </button>
        </main>
        <Footer goList={goList} showToast={showToast} />
      </>
    );
  }

  return (
    <>
      {toastMsg && <div className="toast-overlay">{toastMsg}</div>}
      <Navbar view="list" goHome={goHome} goList={goList} showToast={showToast} />
      <main style={{ minHeight: "80vh" }}>
        <DetailsView
          hotel={hotel}
          onBack={onBack}
          onBook={onBook}
          onNavigateToDetails={onNavigateToDetails}
          showToast={showToast}
        />
      </main>
      <Footer goList={goList} showToast={showToast} />
    </>
  );
}
