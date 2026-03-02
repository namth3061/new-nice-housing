"use client";

import React, { useState, useEffect } from 'react';
import { Hotel } from '../../types/hotel';
import { useLanguage } from '@/context/LanguageContext';
import { BOOKING_DRAFT_KEY } from '@/lib/bookingDraftStorage';

interface DetailsViewProps {
    hotel: Hotel;
    onBack: () => void;
    onBook: (hotel: Hotel) => void;
    onNavigateToDetails: (hotel: Hotel) => void;
}

function todayStr() {
    return new Date().toISOString().split('T')[0];
}

export const DetailsView: React.FC<DetailsViewProps> = ({ hotel, onBack, onBook, onNavigateToDetails }) => {
    const { t } = useLanguage();
    const [activeImg, setActiveImg] = useState(0);
    const [isFav, setIsFav] = useState(false);
    const [checkIn, setCheckIn] = useState(todayStr);
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const maxGuests: number = Math.max(1, Number(hotel.specs?.guests) || 10);

    useEffect(() => { window.scrollTo(0, 0); }, [hotel]);

    return (
        <div className="details-page page-transition">
            <div className="breadcrumb"><span onClick={onBack} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onBack()}>{t('details.back_to_list')}</span> <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px' }} aria-hidden></i> <strong style={{ color: 'var(--black)' }}>{hotel.name}</strong></div>
            <div className="details-header">
                <div className="details-title">
                    {hotel.badge && <div className="card-badge" style={{ marginBottom: '8px' }}><i className="fa-solid fa-bolt"></i> {hotel.badge}</div>}
                    <h1>{hotel.name}</h1>
                    <div className="details-meta">
                        <div className="meta-item"><i className="fa-solid fa-location-dot"></i> {hotel.location}</div>
                        {/* <div className="meta-item"><i className="fa-solid fa-star" style={{ color: 'var(--gold)' }}></i> <strong>{hotel.rating}</strong> ({hotel.reviews} {t('details.reviews')})</div>
                        <div className="meta-item"><i className="fa-solid fa-eye" style={{ color: 'var(--mid)' }}></i> <strong>{hotel.views}</strong> {t('details.views')}</div> */}
                    </div>
                </div>
            </div>

            <div className="slider-container">
                <div className="slider-main">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={hotel.images[activeImg] || hotel.image} alt="main" />
                    <button
                        type="button"
                        className={`details-heart ${isFav ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFav(!isFav);
                        }}
                        aria-label={isFav ? t('common.unsaved') : t('common.saved')}
                    >
                        <i className={`${isFav ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                    </button>
                </div>
                <div className="slider-thumbs">
                    {hotel.images.map((img, idx) => (
                        <div key={idx} className={`thumb ${idx === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(idx)}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="thumb" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="details-grid">
                <div className="details-left">
                    <div className="details-content">
                        <h3>{t('details.apartment_info')}</h3>
                        <div className="specs-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <div className="spec-item"><span className="spec-label">{t('details.bedrooms')}</span><span className="spec-value"><i className="fa-solid fa-bed"></i> {hotel.specs?.bedrooms ?? 0}</span></div>
                            <div className="spec-item"><span className="spec-label">{t('details.bathrooms')}</span><span className="spec-value"><i className="fa-solid fa-bath"></i> {hotel.specs?.bathrooms ?? 0}</span></div>
                            <div className="spec-item"><span className="spec-label">{t('details.area_label')}</span><span className="spec-value"><i className="fa-solid fa-ruler-combined"></i> {hotel.specs?.area ?? 0} {t('details.area')}</span></div>
                        </div>
                        <h3>{t('details.description')}</h3>
                        <div className="details-desc" style={{ whiteSpace: 'pre-line' }}>{hotel.description}</div>
                        <h3>{t('list.amenities')}</h3>
                        <div className="amenities-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {hotel.amenities?.map((am, idx) => (
                                <div key={idx} className="amenity-detail" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div className="amenity-icon" style={{ color: 'var(--gold)' }}><i className="fa-solid fa-check"></i></div>
                                    <span style={{ textTransform: 'capitalize' }}>{t(`amenities.${am}`)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="details-right">
                    <div className="booking-sidebar">
                        <div className="booking-price-big">{hotel.price}</div>
                        <div className="booking-meta"><span>{t('details.service_fee_included')}</span></div>
                        <div className="form-group" style={{ marginTop: '24px' }}>
                            <label>{t('details.checkin')} - {t('details.checkout')}</label>
                            <div className="form-row">
                                <input
                                    type="date"
                                    min={todayStr()}
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                />
                                <input
                                    type="date"
                                    min={checkIn || todayStr()}
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    placeholder={t('details.checkout')}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>{t('details.guests')}</label>
                            <select
                                value={guests}
                                onChange={(e) => setGuests(Number(e.target.value))}
                            >
                                {(() => {
                                    const opts: number[] = [];
                                    for (let i = 1; i <= maxGuests; i++) opts.push(i);
                                    return opts.map((n) => (
                                        <option key={n} value={n}>
                                            {n === 1 ? t('details.guests_1') : n === 2 ? t('details.guests_2') : `${n} ${t('details.guests')}`}
                                        </option>
                                    ));
                                })()}
                            </select>
                        </div>
                        <button
                            className="btn-book"
                            onClick={() => {
                                try {
                                    const draft = { slug: hotel.slug, checkIn, checkOut: checkOut || undefined, guests };
                                    localStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(draft));
                                } catch (_) {}
                                onBook(hotel);
                            }}
                        >
                            <i className="fa-solid fa-wand-magic-sparkles"></i> {t('common.book_now')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
