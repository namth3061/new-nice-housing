"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "../../../../components/Layout/Navbar";
import { Footer } from "../../../../components/Layout/Footer";
import { CheckoutView } from "../../../../views/CheckoutView/CheckoutView";
import { Hotel } from "../../../../types/hotel";
import { propertyToHotel } from "../../../../lib/propertyToHotel";
import { useLanguage } from "@/context/LanguageContext";

interface BookingFormData {
  guest: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  note: string;
  paymentMethod: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
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
        if (!r.ok) { setNotFound(true); return null; }
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
    if (hotel) document.title = `Đặt phòng - ${hotel.name} | NiceHousing`;
    return () => { document.title = "NiceHousing"; };
  }, [hotel]);

  const showToast = useCallback((msg: React.ReactNode) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  }, []);

  const goHome = useCallback(() => router.push("/"), [router]);
  const goList = useCallback(() => router.push("/apartment"), [router]);
  const onBack = useCallback(() => router.push(`/apartment/${slug}`), [router, slug]);

  const onConfirm = useCallback(async (data: BookingFormData) => {
    if (!hotel) return;

    const nights = (() => {
      if (!data.checkIn || !data.checkOut) return 1;
      const diff = new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime();
      return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
    })();

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: `BK-${Date.now()}`,
        propertyId: hotel.id,
        guest: data.guest,
        email: data.email,
        phone: data.phone,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        nights,
        guests: data.guests,
        total: hotel.rawPrice ? hotel.rawPrice * nights : 0,
        note: data.note,
        paymentMethod: data.paymentMethod,
        status: "Pending",
      }),
    });

    if (!res.ok) {
      throw new Error("Booking failed");
    }

    const booking = await res.json();

    showToast(
      <span>
        <i className="fa-solid fa-champagne-glasses"></i>{" "}
        {t("checkout.success_title")}
        <br /><br />
        Mã đặt phòng: <strong>{booking.code}</strong>
        <br />{t("checkout.success_thanks")}
      </span>
    );
    setTimeout(() => router.push("/"), 3500);
  }, [hotel, router, showToast, t]);

  if (loading) {
    return (
      <>
        <Navbar goHome={goHome} goList={goList} showToast={showToast} />
        <main style={{ minHeight: "80vh", paddingTop: "100px", textAlign: "center" }}>
          <p>{t("checkout.loading")}</p>
        </main>
        <Footer goList={goList} showToast={showToast} />
      </>
    );
  }

  if (slug == null || notFound || !hotel) {
    return (
      <>
        <Navbar goHome={goHome} goList={goList} showToast={showToast} />
        <main style={{ minHeight: "80vh", paddingTop: "100px", textAlign: "center" }}>
          <p>{t("checkout.not_found")}</p>
          <button className="btn-gold" style={{ width: "auto", marginTop: 16 }} onClick={goList}>
            {t("common.back_to_list")}
          </button>
        </main>
        <Footer goList={goList} showToast={showToast} />
      </>
    );
  }

  return (
    <>
      {toastMsg && <div className="toast-overlay">{toastMsg}</div>}
      <Navbar goHome={goHome} goList={goList} showToast={showToast} />
      <main style={{ minHeight: "80vh" }}>
        <CheckoutView hotel={hotel} onBack={onBack} onConfirm={onConfirm} />
      </main>
      <Footer goList={goList} showToast={showToast} />
    </>
  );
}
