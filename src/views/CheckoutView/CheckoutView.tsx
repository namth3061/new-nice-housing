"use client";

import React, { useEffect } from 'react';
import { Hotel } from '../../types/hotel';

interface CheckoutViewProps {
    hotel: Hotel;
    onBack: () => void;
    onConfirm: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ hotel, onBack, onConfirm }) => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="checkout-page page-transition">
            <div className="breadcrumb"><span onClick={onBack}>Quay lại chi tiết phòng</span> <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px' }}></i> <strong style={{ color: 'var(--black)' }}>Xác nhận đặt phòng</strong></div>
            <h1 style={{ fontFamily: 'Playfair Display', fontSize: '36px', marginBottom: '32px' }}>Thông tin đặt phòng</h1>

            <form className="checkout-grid" onSubmit={(e) => { e.preventDefault(); onConfirm(); }}>
                <div className="checkout-left">
                    <div className="checkout-form-section">
                        <h3>1. Thông tin liên hệ</h3>
                        <div className="form-group"><label>Họ và tên *</label><input type="text" placeholder="Nguyễn Văn A" required /></div>
                        <div className="form-row">
                            <div className="form-group"><label>Số điện thoại *</label><input type="tel" placeholder="0912..." required /></div>
                            <div className="form-group"><label>Email *</label><input type="email" placeholder="email@..." required /></div>
                        </div>
                    </div>
                    <div className="checkout-form-section">
                        <h3>2. Yêu cầu đặc biệt</h3>
                        <div className="form-group"><label>Ghi chú cho khách sạn</label><textarea rows={4} placeholder="Ví dụ: Cần phòng tầng cao, giường phụ..."></textarea></div>
                    </div>
                </div>

                <div className="checkout-right">
                    <div className="checkout-summary">
                        <h3>Tóm tắt đơn hàng</h3>
                        <div className="summary-hotel">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={hotel.image} alt={hotel.name} />
                            <div>
                                <h4>{hotel.name}</h4>
                                <p><i className="fa-solid fa-location-dot"></i> {hotel.location}</p>
                                <p style={{ color: 'var(--gold)', marginTop: '4px' }}><i className="fa-solid fa-star"></i> {hotel.rating} Tuyệt vời</p>
                            </div>
                        </div>
                        <div className="summary-row"><span>Sức chứa:</span> <strong>{hotel.specs.guests}</strong></div>
                        <div className="summary-row"><span>Giá mỗi đêm:</span> <strong>{hotel.price}</strong></div>
                        <div className="form-group" style={{ marginTop: '24px' }}>
                            <label>Mã khuyến mãi</label>
                            <div style={{ display: 'flex', gap: '8px' }}><input type="text" placeholder="Nhập mã..." defaultValue="NICE30" style={{ flex: 1 }} /><button type="button" className="btn-outline" style={{ width: 'auto' }}>Áp dụng</button></div>
                        </div>
                        <div className="summary-total"><span>Tổng cộng:</span><span>{hotel.price}</span></div>
                        <button type="submit" className="btn-book" style={{ marginTop: '24px' }}>Hoàn tất đặt phòng</button>
                        <p style={{ fontSize: '12px', color: 'var(--charcoal)', textAlign: 'center', marginTop: '16px' }}>Bằng việc bấm Hoàn tất, bạn đồng ý với Điều khoản dịch vụ.</p>
                    </div>
                </div>
            </form>
        </div>
    );
};
