"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "../../../components/Layout/Navbar";
import { Footer } from "../../../components/Layout/Footer";
import { DetailsView } from "../../../views/DetailsView/DetailsView";
import { Hotel } from "../../../types/hotel";
import { propertyToHotel } from "../../../lib/propertyToHotel";
import { HotelCard } from "../../../components/HotelCard/HotelCard";
import { useLanguage } from "@/context/LanguageContext";

export default function ApartmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = useMemo(() => (params?.slug ? String(params.slug) : null), [params?.slug]);
  const [toastMsg, setToastMsg] = useState<React.ReactNode | null>(null);
  const { t } = useLanguage();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [relatedHotels, setRelatedHotels] = useState<Hotel[]>([]);
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

    fetch("/api/properties?limit=10")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map(propertyToHotel);
          setRelatedHotels(mapped.filter((h) => h.slug !== slug).slice(0, 6));
        } else if (data && Array.isArray(data.data)) {
          const mapped = data.data.map(propertyToHotel);
          setRelatedHotels(mapped.filter((h: Hotel) => h.slug !== slug).slice(0, 6));
        }
      })
      .catch(console.error);
  }, [slug]);

  useEffect(() => {
    if (hotel) {
      document.title = `${hotel.name} | NineHousing`;
    }
    return () => {
      document.title = "NineHousing";
    };
  }, [hotel]);

  const showToast = (msg: React.ReactNode) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const goHome = () => router.push("/");
  const goList = () => router.push("/apartment");
  const onBack = () => router.push("/apartment");
  const onBook = (h: Hotel) => router.push(`/apartment/${h.slug}/checkout`);
  const onNavigateToDetails = (h: Hotel) => router.push(`/apartment/${h.slug}`);

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

        {relatedHotels.length > 0 && (
          <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--black)' }}>
              {t('details.related')}
            </h2>
            <div className="hotels-grid">
              {relatedHotels.map((h) => (
                <HotelCard key={h.id} hotel={h} onClick={onNavigateToDetails} showToast={showToast} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer goList={goList} showToast={showToast} />
    </>
  );
}
