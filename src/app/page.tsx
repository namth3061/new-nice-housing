"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Layout/Navbar';
import { Footer } from '../components/Layout/Footer';
import { HomeView } from '../views/HomeView/HomeView';
import { ListView } from '../views/ListView/ListView';
import { DetailsView } from '../views/DetailsView/DetailsView';
import { CheckoutView, type BookingFormData } from '../views/CheckoutView/CheckoutView';
import { Hotel } from '../types/hotel';
import { propertyToHotel } from '../lib/propertyToHotel';
import { useLanguage } from '@/context/LanguageContext';

export default function App() {
  const { t } = useLanguage();
  const [view, setView] = useState('home');
  const [activeHotel, setActiveHotel] = useState<Hotel | null>(null);
  const [toastMsg, setToastMsg] = useState<React.ReactNode | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);

  useEffect(() => {
    const titles: Record<string, string> = {
      home: "Nine Housing - Đặt phòng & Thuê nhà dễ dàng",
      list: "Danh sách chỗ ở | Nine Housing",
      details: activeHotel ? `${activeHotel.name} | Nine Housing` : "Chi tiết chỗ ở | Nine Housing",
      checkout: "Đặt phòng | Nine Housing",
    };
    document.title = titles[view] || "Nine Housing";
  }, [view, activeHotel]);

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setHotels(list.map((p: unknown) => propertyToHotel(p as Parameters<typeof propertyToHotel>[0])));
      })
      .catch(console.error)
      .finally(() => setHotelsLoading(false));
  }, []);

  const showToast = (msg: React.ReactNode) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const goHome = () => { setView('home'); setActiveHotel(null); };
  const goList = () => { setView('list'); setActiveHotel(null); };
  const goDetails = (hotel: Hotel) => { setActiveHotel(hotel); setView('details'); };
  const goCheckout = (hotel: Hotel) => { setActiveHotel(hotel); setView('checkout'); };

  const handleConfirm = async (_data: BookingFormData) => {
    showToast(
      <span>
        <i className="fa-solid fa-champagne-glasses"></i> {t('checkout.success_title')}<br /><br />
        {t('checkout.success_sent')}<br />{t('checkout.success_thanks')}
      </span>
    );
    setTimeout(() => goHome(), 3000);
  };

  return (
    <>
      {toastMsg && <div className="toast-overlay">{toastMsg}</div>}

      <Navbar view={view} goHome={goHome} goList={goList} />

      <main style={{ minHeight: '80vh' }}>
        {view === 'home' && <HomeView hotels={hotels} loading={hotelsLoading} onNavigateToList={goList} onNavigateToDetails={goDetails} />}
        {view === 'list' && <ListView hotels={hotels} loading={hotelsLoading} onNavigateToDetails={goDetails} onBack={goHome} />}
        {view === 'details' && activeHotel && <DetailsView hotel={activeHotel} onBack={goList} onBook={goCheckout} onNavigateToDetails={goDetails} />}
        {view === 'checkout' && activeHotel && <CheckoutView hotel={activeHotel} onBack={() => goDetails(activeHotel)} onConfirm={handleConfirm} />}
      </main>

      <Footer goList={goList} />
    </>
  );
}
