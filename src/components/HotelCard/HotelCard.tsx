"use client";

import React, { useState } from 'react';
import { Hotel } from '../../types/hotel';
import { renderStars } from '../../utils/format';

interface HotelCardProps {
    hotel: Hotel;
    onClick: (hotel: Hotel) => void;
    showToast: (msg: React.ReactNode) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick, showToast }) => {
    const [isFav, setIsFav] = useState(false);

    return (
        <div className="hotel-card card-anim" onClick={() => onClick(hotel)}>
            <div className="card-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hotel.image} alt={hotel.name} loading="lazy" />
                {hotel.badge && <div className="card-badge"><i className="fa-solid fa-bolt"></i> {hotel.badge}</div>}
                <div className={`card-fav ${isFav ? 'active' : ''}`} onClick={(e) => {
                    e.stopPropagation();
                    setIsFav(!isFav);
                    showToast(
                        <span>
                            <i className={`fa-${!isFav ? 'solid' : 'regular'} fa-heart`}></i>
                            {!isFav ? `Đã lưu ${hotel.name}` : `Đã bỏ lưu ${hotel.name}`}
                        </span>
                    );
                }}>
                    <i className={`${isFav ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                </div>
            </div>
            <div className="card-body">
                <div className="card-stars">{renderStars(hotel.stars)}</div>
                <div className="card-name">{hotel.name}</div>
                <div className="card-loc"><i className="fa-solid fa-location-dot"></i> {hotel.location}</div>
                <div className="card-amenities">
                    {hotel.amenities.map((amenity, idx) => <span key={idx} className="amenity">{amenity}</span>)}
                </div>
                <div className="card-footer">
                    <div className="card-rating">
                        <div className="rating-score">{hotel.rating}</div>
                        <div className="rating-label">{hotel.ratingLabel}<br />{hotel.reviews} đánh giá</div>
                    </div>
                    <div className="card-price">
                        <div className="price-from">Chỉ từ</div>
                        <div className="price-num">{hotel.price}</div>
                        <div className="price-unit">/đêm</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
