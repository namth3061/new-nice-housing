"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import { Navbar } from "../../../../components/Layout/Navbar";
import { Footer } from "../../../../components/Layout/Footer";
import { CheckoutView } from "../../../../views/CheckoutView/CheckoutView";
import { Hotel } from "../../../../types/hotel";
import { propertyToHotel } from "../../../../lib/propertyToHotel";
import { useLanguage } from "@/context/LanguageContext";
import { getBookingDraft } from "@/lib/bookingDraftStorage";

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
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [draft, setDraft] = useState<{ checkIn: string; checkOut?: string; guests: number } | null>(null);

  useEffect(() => {
    const d = getBookingDraft();
    if (d && slug && d.slug === slug) {
      setDraft({ checkIn: d.checkIn, checkOut: d.checkOut, guests: d.guests });
    } else {
      setDraft(null);
    }
  }, [slug]);

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
    if (hotel) document.title = `${t("checkout.confirm_booking")} - ${hotel.name} | NiceHousing`;
    return () => { document.title = "NiceHousing"; };
  }, [hotel, t]);

  const goHome = useCallback(() => router.push("/"), [router]);
  const goList = useCallback(() => router.push("/apartment"), [router]);
  const onBack = useCallback(() => router.push(`/apartment/${slug}`), [router, slug]);

  const onConfirm = useCallback(async (data: BookingFormData) => {
    if (!hotel) return;

    const nights = (() => {
      if (!data.checkIn) return 1;
      if (!data.checkOut) return 1;
      const diff = new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime();
      return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
    })();

    const checkOutValue = data.checkOut || (() => {
      const d = new Date(data.checkIn);
      d.setDate(d.getDate() + 1);
      return d.toISOString().split("T")[0];
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
        checkOut: checkOutValue,
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
    await Swal.fire({
      icon: "success",
      title: t("checkout.success_title"),
      html: `<p style="margin: 0 0 8px;">${t("checkout.booking_code")}: <strong>${booking.code}</strong></p><p style="margin: 0 0 8px;">${t("checkout.success_thanks")}</p><p style="margin: 0;">${t("checkout.success_will_contact")}</p>`,
      confirmButtonText: "OK",
      confirmButtonColor: "#A07810",
      background: "#FDF6E3",
      color: "#6B5A2E",
      iconColor: "#D4A017",
      customClass: {
        popup: "swal-success-gold",
        title: "swal-success-gold-title",
        htmlContainer: "swal-success-gold-html",
        confirmButton: "swal-success-gold-btn",
      },
    });
    router.push("/apartment");
  }, [hotel, router, t]);

  if (loading) {
    return (
      <>
        <Navbar goHome={goHome} goList={goList} />
        <main style={{ minHeight: "80vh", paddingTop: "100px", textAlign: "center" }}>
          <p>{t("checkout.loading")}</p>
        </main>
        <Footer goList={goList} />
      </>
    );
  }

  if (slug == null || notFound || !hotel) {
    return (
      <>
        <Navbar goHome={goHome} goList={goList} />
        <main style={{ minHeight: "80vh", paddingTop: "100px", textAlign: "center" }}>
          <p>{t("checkout.not_found")}</p>
          <button className="btn-gold" style={{ width: "auto", marginTop: 16 }} onClick={goList}>
            {t("common.back_to_list")}
          </button>
        </main>
        <Footer goList={goList} />
      </>
    );
  }

  return (
    <>
      <Navbar goHome={goHome} goList={goList} />
      <main style={{ minHeight: "80vh" }}>
        <CheckoutView hotel={hotel} onBack={onBack} onConfirm={onConfirm} initialData={draft ?? undefined} />
      </main>
      <Footer goList={goList} />
    </>
  );
}
