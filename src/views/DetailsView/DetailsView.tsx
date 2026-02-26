"use client";

import React, { useState, useEffect } from 'react';
import { Hotel } from '../../types/hotel';
import { renderStars } from '../../utils/format';

interface DetailsViewProps {
    hotel: Hotel;
    onBack: () => void;
    onBook: (hotel: Hotel) => void;
    onNavigateToDetails: (hotel: Hotel) => void;
    showToast: (msg: React.ReactNode) => void;
}

export const DetailsView: React.FC<DetailsViewProps> = ({ hotel, onBack, onBook, onNavigateToDetails, showToast }) => {
    const [activeImg, setActiveImg] = useState(0);
    useEffect(() => { window.scrollTo(0, 0); }, [hotel]);

    return (
        <div className="details-page page-transition">
            <div className="breadcrumb"><span onClick={onBack} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onBack()}>Quay lại danh sách</span> <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px' }} aria-hidden></i> <strong style={{ color: 'var(--black)' }}>{hotel.name}</strong></div>
            <div className="details-header">
                <div className="details-title">
                    <h1>{hotel.name}</h1>
                    <div className="details-meta">
                        <div className="meta-item"><span className="meta-stars">{renderStars(hotel.stars)}</span></div>
                        <div className="meta-item"><i className="fa-solid fa-location-dot"></i> {hotel.location}</div>
                        <div className="meta-item"><i className="fa-solid fa-star" style={{ color: 'var(--gold)' }}></i> <strong>{hotel.rating}</strong> ({hotel.reviews} đánh giá)</div>
                        <div className="meta-item"><i className="fa-solid fa-eye" style={{ color: 'var(--mid)' }}></i> <strong>{hotel.views}</strong> lượt xem</div>
                    </div>
                </div>
            </div>

            <div className="slider-container">
                <div className="slider-main">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={hotel.images[activeImg] || hotel.image} alt="main" />
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
                        <h3>Thông tin phòng</h3>
                        <div className="specs-grid">
                            <div className="spec-item"><span className="spec-label">Giường</span><span className="spec-value"><i className="fa-solid fa-bed"></i> {hotel.specs.beds}</span></div>
                            <div className="spec-item"><span className="spec-label">Sức chứa</span><span className="spec-value"><i className="fa-solid fa-user-group"></i> {hotel.specs.guests}</span></div>
                            <div className="spec-item"><span className="spec-label">Diện tích</span><span className="spec-value"><i className="fa-solid fa-vector-square"></i> {hotel.specs.size}</span></div>
                        </div>
                        <h3>Mô tả chi tiết</h3>
                        <div className="details-desc">{hotel.description}</div>
                        <h3>Tiện nghi</h3>
                        <div className="amenities-list">
                            {hotel.detailedAmenities.map((am, idx) => (
                                <div key={idx} className="amenity-detail">
                                    <div className="amenity-icon"><i className={am.icon}></i></div>
                                    <span>{am.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="details-right">
                    <div className="booking-sidebar">
                        <div className="booking-price-big">{hotel.price}</div>
                        <div className="booking-meta"><span>Đã bao gồm thuế & phí</span><strong style={{ color: 'var(--black)' }}>Mỗi đêm</strong></div>
                        <div className="form-group" style={{ marginTop: '24px' }}>
                            <label>Nhận phòng - Trả phòng</label>
                            <div className="form-row"><input type="date" /><input type="date" /></div>
                        </div>
                        <div className="form-group">
                            <label>Khách & Phòng</label>
                            <select><option>1 Phòng, 2 Khách</option><option>2 Phòng, 4 Khách</option></select>
                        </div>
                        <button className="btn-book" onClick={() => onBook(hotel)}><i className="fa-solid fa-wand-magic-sparkles"></i> Đặt phòng ngay</button>
                        <p style={{ fontSize: '12px', color: 'var(--mid)', textAlign: 'center', marginTop: '16px' }}>Bạn sẽ không bị trừ tiền ngay lập tức</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
