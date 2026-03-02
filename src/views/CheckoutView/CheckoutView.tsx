"use client";

import React, { useState, useEffect } from 'react';
import { Hotel } from '../../types/hotel';
import { useLanguage } from '@/context/LanguageContext';

export interface BookingFormData {
    guest: string;
    phone: string;
    email: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    note: string;
    paymentMethod: string;
}

interface CheckoutViewProps {
    hotel: Hotel;
    onBack: () => void;
    onConfirm: (data: BookingFormData) => Promise<void>;
    initialData?: Partial<Pick<BookingFormData, 'checkIn' | 'checkOut' | 'guests'>>;
}

function toDateInputMin() {
    return new Date().toISOString().split('T')[0];
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ hotel, onBack, onConfirm, initialData }) => {
    const { t } = useLanguage();
    const today = toDateInputMin();

    const [form, setForm] = useState<BookingFormData>({
        guest: '',
        phone: '',
        email: '',
        checkIn: initialData?.checkIn ?? today,
        checkOut: initialData?.checkOut ?? '',
        guests: initialData?.guests ?? 1,
        note: '',
        paymentMethod: 'cash',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { window.scrollTo(0, 0); }, []);
    useEffect(() => {
        if (initialData) {
            setForm((f) => ({
                ...f,
                checkIn: initialData.checkIn ?? f.checkIn,
                checkOut: initialData.checkOut ?? f.checkOut,
                guests: initialData.guests ?? f.guests,
            }));
        }
    }, [initialData?.checkIn, initialData?.checkOut, initialData?.guests]);

    const update = (part: Partial<BookingFormData>) =>
        setForm((f) => ({ ...f, ...part }));

    const nights = (() => {
        if (!form.checkIn) return 0;
        if (!form.checkOut) return 1;
        const diff = new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime();
        return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
    })();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.checkIn) {
            setError(t('checkout.error_please_checkin'));
            return;
        }
        if (form.checkOut && nights <= 0) {
            setError(t('checkout.error_checkout_after_checkin'));
            return;
        }
        setSubmitting(true);
        try {
            await onConfirm(form);
            // Success: keep button disabled (no setSubmitting(false))
        } catch {
            setError(t('checkout.error_booking_failed'));
            setSubmitting(false);
        }
    };

    const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition';

    return (
        <div className="checkout-page page-transition">
            <div className="breadcrumb">
                <span onClick={onBack} style={{ cursor: 'pointer' }}>{t('checkout.back_to_room')}</span>
                <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', margin: '0 6px' }}></i>
                <strong style={{ color: 'var(--black)' }}>{t('checkout.confirm_booking')}</strong>
            </div>
            <h1 style={{ fontFamily: 'Playfair Display', fontSize: '36px', marginBottom: '32px' }}>
                {t('checkout.booking_info')}
            </h1>

            <form className="checkout-grid" onSubmit={handleSubmit}>
                {/* ── LEFT ── */}
                <div className="checkout-left">
                    {/* Contact info */}
                    <div className="checkout-form-section">
                        <h3>{t('checkout.section_contact')}</h3>
                        <div className="form-group">
                            <label>{t('checkout.full_name')}</label>
                            <input
                                type="text"
                                className={inputCls}
                                placeholder={t('checkout.full_name_placeholder')}
                                value={form.guest}
                                onChange={(e) => update({ guest: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>{t('checkout.phone')}</label>
                                <input
                                    type="tel"
                                    className={inputCls}
                                    placeholder={t('checkout.phone_placeholder')}
                                    value={form.phone}
                                    onChange={(e) => update({ phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('checkout.email')}</label>
                                <input
                                    type="email"
                                    className={inputCls}
                                    placeholder={t('checkout.email_placeholder')}
                                    value={form.email}
                                    onChange={(e) => update({ email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stay dates */}
                    <div className="checkout-form-section">
                        <h3>{t('checkout.section_stay')}</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>{t('checkout.checkin_date')}</label>
                                <input
                                    type="date"
                                    className={inputCls}
                                    min={today}
                                    value={form.checkIn}
                                    onChange={(e) => update({ checkIn: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('checkout.checkout_date')}</label>
                                <input
                                    type="date"
                                    className={inputCls}
                                    min={form.checkIn || today}
                                    value={form.checkOut}
                                    onChange={(e) => update({ checkOut: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>{t('checkout.guests_count')}</label>
                                <input
                                    type="number"
                                    className={inputCls}
                                    min={1}
                                    max={hotel.specs?.guests ?? 10}
                                    value={form.guests}
                                    onChange={(e) => update({ guests: Number(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('checkout.payment_method')}</label>
                                <select
                                    className={inputCls}
                                    value={form.paymentMethod}
                                    onChange={(e) => update({ paymentMethod: e.target.value })}
                                >
                                    <option value="cash">{t('checkout.payment_cash')}</option>
                                    <option value="bank_transfer">{t('checkout.payment_bank')}</option>
                                    <option value="card">{t('checkout.payment_card')}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Special requests */}
                    <div className="checkout-form-section">
                        <h3>{t('checkout.section_special')}</h3>
                        <div className="form-group">
                            <label>{t('checkout.note_label')}</label>
                            <textarea
                                rows={3}
                                className={inputCls}
                                placeholder={t('checkout.note_placeholder')}
                                value={form.note}
                                onChange={(e) => update({ note: e.target.value })}
                            />
                        </div>
                    </div>

                    {error && (
                        <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px' }}>{error}</p>
                    )}
                </div>

                {/* ── RIGHT (summary) ── */}
                <div className="checkout-right">
                    <div className="checkout-summary">
                        <h3>{t('checkout.order_summary')}</h3>
                        <div className="summary-hotel">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={hotel.image} alt={hotel.name} />
                            <div>
                                <h4>{hotel.name}</h4>
                                <p><i className="fa-solid fa-location-dot"></i> {hotel.location}</p>
                                <p style={{ color: 'var(--gold)', marginTop: '4px' }}>
                                    <i className="fa-solid fa-star"></i> {hotel.rating} {t('common.excellent')}
                                </p>
                            </div>
                        </div>

                        <div className="summary-row">
                            <span>{t('checkout.capacity')}:</span>
                            <strong>{form.guests} {t('checkout.guests_suffix')}</strong>
                        </div>
                        <div className="summary-row">
                            <span>{t('checkout.price_per_night')}:</span>
                            <strong>{hotel.price}</strong>
                        </div>
                        {nights > 0 && (
                            <div className="summary-row">
                                <span>{t('checkout.nights_count')}:</span>
                                <strong>{nights} {t('checkout.nights_suffix')}</strong>
                            </div>
                        )}

                        <div className="summary-total">
                            <span>{t('checkout.total')}:</span>
                            <span>{hotel.price}</span>
                        </div>

                        <button
                            type="submit"
                            className="btn-book"
                            style={{ marginTop: '24px', opacity: submitting ? 0.7 : 1 }}
                            disabled={submitting}
                        >
                            {submitting ? t('checkout.processing') : t('checkout.finish_booking')}
                        </button>
                        <p style={{ fontSize: '12px', color: 'var(--charcoal)', textAlign: 'center', marginTop: '16px' }}>
                            {t('checkout.agree_terms_note')}
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};
