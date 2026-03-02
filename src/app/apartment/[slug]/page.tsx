"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "../../../components/Layout/Navbar";
import { Footer } from "../../../components/Layout/Footer";
import { DetailsView } from "../../../views/DetailsView/DetailsView";
import { Hotel } from "../../../types/hotel";
import { propertyToHotel } from "../../../lib/propertyToHotel";
import { HotelCard } from "../../../components/HotelCard/HotelCard";
import { useLanguage } from "@/context/LanguageContext";

const RELATED_VISIBLE_DESKTOP = 3;
const RELATED_SLIDE_MS = 4000;

export default function ApartmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = useMemo(() => (params?.slug ? String(params.slug) : null), [params?.slug]);
  const { t } = useLanguage();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [relatedHotels, setRelatedHotels] = useState<Hotel[]>([]);
  const [relatedSlide, setRelatedSlide] = useState(0);
  const relatedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [relatedVisible, setRelatedVisible] = useState(RELATED_VISIBLE_DESKTOP);
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
        if (data) {
          setHotel(propertyToHotel(data));
          const category = (data.category ?? "").trim();
          const relatedUrl = category
            ? `/api/properties?category=${encodeURIComponent(category)}&limit=10`
            : "/api/properties?limit=10";
          fetch(relatedUrl)
            .then((r) => r.json())
            .then((res) => {
              const list = res?.list ?? (Array.isArray(res) ? res : []);
              const mapped = list.map((p: unknown) => propertyToHotel(p as Parameters<typeof propertyToHotel>[0]));
              setRelatedHotels(mapped.filter((h: Hotel) => h.slug !== slug).slice(0, 6));
              setRelatedSlide(0);
            })
            .catch(console.error);
        } else setHotel(null);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (hotel) {
      document.title = `${hotel.name} | NineHousing`;
    }
    return () => {
      document.title = "NineHousing";
    };
  }, [hotel]);

  const relatedCount = relatedHotels.length;
  const relatedSlides = Math.max(1, Math.ceil(relatedCount / relatedVisible));

  useEffect(() => {
    const check = () => setRelatedVisible(window.innerWidth <= 600 ? 1 : RELATED_VISIBLE_DESKTOP);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setRelatedSlide((prev) => (prev >= relatedSlides ? 0 : prev));
  }, [relatedSlides]);

  useEffect(() => {
    if (relatedCount <= relatedVisible) return;
    relatedIntervalRef.current = setInterval(() => {
      setRelatedSlide((prev) => (prev + 1) % relatedSlides);
    }, RELATED_SLIDE_MS);
    return () => {
      if (relatedIntervalRef.current) clearInterval(relatedIntervalRef.current);
    };
  }, [relatedCount, relatedSlides, relatedVisible]);

  const goHome = () => router.push("/");
  const goList = () => router.push("/apartment");
  const onBack = () => router.push("/apartment");
  const onBook = (h: Hotel) => router.push(`/apartment/${h.slug}/checkout`);
  const onNavigateToDetails = (h: Hotel) => router.push(`/apartment/${h.slug}`);

  if (loading) {
    return (
      <>
        <Navbar view="list" goHome={goHome} goList={goList} />
        <main style={{ minHeight: "80vh", paddingTop: "100px", textAlign: "center" }}>
          <p>Đang tải...</p>
        </main>
        <Footer goList={goList} />
      </>
    );
  }

  if (slug == null || notFound || !hotel) {
    return (
      <>
        <Navbar view="list" goHome={goHome} goList={goList} />
        <main style={{ minHeight: "80vh", paddingTop: "100px", textAlign: "center" }}>
          <p>Không tìm thấy khách sạn.</p>
          <button className="btn-gold" style={{ width: "auto", marginTop: 16 }} onClick={onBack}>
            Quay lại danh sách
          </button>
        </main>
        <Footer goList={goList} />
      </>
    );
  }

  return (
    <>
      <Navbar view="list" goHome={goHome} goList={goList} />
      <main style={{ minHeight: "80vh" }}>
        <DetailsView
          hotel={hotel}
          onBack={onBack}
          onBook={onBook}
          onNavigateToDetails={onNavigateToDetails}
        />

        {relatedHotels.length > 0 && (
          <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--black)' }}>
              {t('details.related')}
            </h2>
            <div
              className="blog-slider-wrap"
              onMouseEnter={() => { if (relatedIntervalRef.current) clearInterval(relatedIntervalRef.current); relatedIntervalRef.current = null; }}
              onMouseLeave={() => {
                if (relatedCount > relatedVisible) {
                  relatedIntervalRef.current = setInterval(() => setRelatedSlide((prev) => (prev + 1) % relatedSlides), RELATED_SLIDE_MS);
                }
              }}
            >
              <div className="blog-slider-viewport">
                <div
                  className="related-slider-track"
                  style={{
                    transform: `translateX(calc(-${relatedSlide} * (100% / ${relatedVisible}) - ${relatedSlide} * 16px))`,
                  }}
                >
                  {relatedHotels.map((h) => (
                    <div key={h.id} className="related-slide-card">
                      <HotelCard hotel={h} onClick={onNavigateToDetails} />
                    </div>
                  ))}
                </div>
              </div>
              {relatedSlides > 1 && (
                <div className="blog-slider-dots" style={{ marginTop: '24px' }}>
                  {Array.from({ length: relatedSlides }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`blog-dot${i === relatedSlide ? ' active' : ''}`}
                      onClick={() => setRelatedSlide(i)}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer goList={goList} />
    </>
  );
}
