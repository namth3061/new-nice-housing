"use client";

import React, { useState } from 'react';
import { Hotel } from '../../types/hotel';
import { renderStars } from '../../utils/format';
import { useLanguage } from '@/context/LanguageContext';

interface HotelCardProps {
    hotel: Hotel;
    onClick: (hotel: Hotel) => void;
    showToast: (msg: React.ReactNode) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick, showToast }) => {
    const { t } = useLanguage();
    const [isFav, setIsFav] = useState(false);

    return (
        <div className="hotel-card card-anim" onClick={() => onClick(hotel)}>
            <div className="card-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hotel.image || undefined} alt={hotel.name} loading="lazy" />
                {hotel.badge && <div className="card-badge"><i className="fa-solid fa-bolt"></i> {hotel.badge}</div>}
                <div className={`card-fav ${isFav ? 'active' : ''}`} onClick={(e) => {
                    e.stopPropagation();
                    setIsFav(!isFav);
                    showToast(
                        <span>
                            <i className={`fa-${!isFav ? 'solid' : 'regular'} fa-heart`}></i>
                            {!isFav ? `${t('common.saved')} ${hotel.name}` : `${t('common.unsaved')} ${hotel.name}`}
                        </span>
                    );
                }}>
                    <i className={`${isFav ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                </div>
            </div>
            <div className="card-body">
                <div className="card-name">{hotel.name}</div>
                <div className="card-loc"><i className="fa-solid fa-location-dot"></i> {hotel.location}</div>
                {(hotel.specs?.bedrooms || hotel.specs?.bathrooms || hotel.specs?.area) && (
                    <div className="card-specs" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 8px', fontWeight: 500, display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {hotel.specs?.bedrooms && <span><i className="fa-solid fa-bed"></i> {hotel.specs.bedrooms} {t('details.bedrooms')}</span>}
                        {hotel.specs?.bathrooms && <span><i className="fa-solid fa-bath"></i> {hotel.specs.bathrooms} {t('details.bathrooms')}</span>}
                        {hotel.specs?.area && <span><i className="fa-solid fa-ruler-combined"></i> {hotel.specs.area} {t('details.area')}</span>}
                    </div>
                )}
                <div className="card-amenities">
                    {hotel.amenities.map((amenity, idx) => <span key={idx} className="amenity">{amenity}</span>)}
                </div>
                <div className="card-footer">
                    <div className="card-rating">
                        {/* <div className="rating-score">{hotel.rating}</div>
                        <div className="rating-label">{hotel.ratingLabel}<br />{hotel.reviews} {t('common.reviews_count')}</div> */}
                    </div>
                    <div className="card-price">
                        <div className="price-num">{hotel.price}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
