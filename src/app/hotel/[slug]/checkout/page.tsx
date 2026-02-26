"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "../../../../components/Layout/Navbar";
import { Footer } from "../../../../components/Layout/Footer";
import { CheckoutView } from "../../../../views/CheckoutView/CheckoutView";
import { Hotel } from "../../../../types/hotel";
import { propertyToHotel } from "../../../../lib/propertyToHotel";

export default function CheckoutPage() {
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
      document.title = `Đặt phòng - ${hotel.name} | NiceHousing`;
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
  const onBack = () => router.push(`/hotel/${slug}`);
  const onConfirm = () => {
    showToast(
      <span>
        <i className="fa-solid fa-champagne-glasses"></i> CHÚC MỪNG BẠN ĐÃ ĐẶT PHÒNG THÀNH CÔNG!<br /><br />
        Mã xác nhận đã được gửi qua Email.<br />NiceHousing cảm ơn bạn!
      </span>
    );
    setTimeout(() => router.push("/"), 3000);
  };

  if (loading) {
    return (
      <>
        <Navbar goHome={goHome} goList={goList} showToast={showToast} />
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
        <Navbar goHome={goHome} goList={goList} showToast={showToast} />
        <main style={{ minHeight: "80vh", paddingTop: "100px", textAlign: "center" }}>
          <p>Không tìm thấy thông tin đặt phòng.</p>
          <button className="btn-gold" style={{ width: "auto", marginTop: 16 }} onClick={() => router.push("/hotel")}>
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
      <Navbar goHome={goHome} goList={goList} showToast={showToast} />
      <main style={{ minHeight: "80vh" }}>
        <CheckoutView hotel={hotel} onBack={onBack} onConfirm={onConfirm} />
      </main>
      <Footer goList={goList} showToast={showToast} />
    </>
  );
}
