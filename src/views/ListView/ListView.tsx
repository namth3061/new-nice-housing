"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Hotel } from '../../types/hotel';
import { HotelCard } from '../../components/HotelCard/HotelCard';
import { useLanguage } from '@/context/LanguageContext';

interface ListViewProps {
    hotels: Hotel[];
    loading?: boolean;
    onNavigateToDetails: (hotel: Hotel) => void;
    onBack: () => void;
    showToast: (msg: React.ReactNode) => void;
    totalCount?: number;
    initialFilters?: { price: string[]; stars: number[]; amenities: string[]; province?: string };
    onSearch?: (filters: { price: string[]; stars: number[]; amenities: string[]; province?: string }) => void;
}

export const ListView: React.FC<ListViewProps> = ({ hotels, loading, onNavigateToDetails, onBack, showToast, totalCount, initialFilters, onSearch }) => {
    const { t } = useLanguage();
    const [filters, setFilters] = useState<{ price: string[]; stars: number[]; amenities: string[]; province: string }>({
        price: initialFilters?.price ?? [],
        stars: initialFilters?.stars ?? [],
        amenities: initialFilters?.amenities ?? [],
        province: initialFilters?.province ?? "",
    });
    const [provinces, setProvinces] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState('popular');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const amenityLabelMap: Record<string, string> = { 'Hồ bơi': t('list.amenity_pool'), 'Spa': t('list.amenity_spa'), 'Bãi biển riêng': t('list.amenity_private_beach') };

    useEffect(() => { window.scrollTo(0, 0); }, []);
    useEffect(() => {
        if (!initialFilters) return;
        setFilters({
            price: initialFilters.price ?? [],
            stars: initialFilters.stars ?? [],
            amenities: initialFilters.amenities ?? [],
            province: initialFilters.province ?? "",
        });
    }, [initialFilters?.price, initialFilters?.stars, initialFilters?.amenities, initialFilters?.province]);
    useEffect(() => {
        fetch("/api/properties/provinces")
            .then((r) => (r.ok ? r.json() : []))
            .then((list) => setProvinces(Array.isArray(list) ? list : []))
            .catch(() => setProvinces([]));
    }, []);

    const handleFilter = (cat: 'price' | 'stars' | 'amenities', val: any) => {
        setFilters(p => {
            const current = p[cat] as any[];
            return {
                ...p,
                [cat]: current.includes(val) ? current.filter(i => i !== val) : [...current, val]
            };
        });
    };

    const filteredHotels = useMemo(() => {
        const source = loading ? [] : hotels;
        let res = [...source];
        // Note: Filters are now handled by the backend API query in the parent component.
        // We only sort locally based on the returned items.
        if (sortOrder === 'priceAsc') res.sort((a, b) => a.rawPrice - b.rawPrice);
        if (sortOrder === 'priceDesc') res.sort((a, b) => b.rawPrice - a.rawPrice);
        if (sortOrder === 'popular') res.sort((a, b) => b.rating - a.rating);
        return res;
    }, [hotels, loading, sortOrder]);

    return (
        <div className="list-page page-transition">
            <div className="breadcrumb"><span onClick={onBack}>{t('common.home')}</span> <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px' }}></i> <strong style={{ color: 'var(--black)' }}>{t('common.apartments')}</strong></div>
            <div className="list-layout">
                <div className={`filter-sidebar ${filtersOpen ? 'is-open' : ''}`}>
                    <div className="filter-header" onClick={() => setFiltersOpen((o) => !o)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFiltersOpen((o) => !o); } }} aria-expanded={filtersOpen}>
                        <h3>{t('list.filter_title')}</h3>
                        <i className="fa-solid fa-chevron-down filter-toggle-icon" aria-hidden />
                    </div>
                    <div className="filter-body">
                        {provinces.length > 0 && (
                            <div className="filter-section">
                                <div className="filter-title">{t('list.province')}</div>
                                <select
                                    className="filter-select"
                                    value={filters.province}
                                    onChange={(e) => setFilters((p) => ({ ...p, province: e.target.value }))}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: '#fff', fontSize: '14px' }}
                                >
                                    <option value="">{t('list.province_all')}</option>
                                    {provinces.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="filter-section">
                            <div className="filter-title">{t('list.price_range')}</div>
                            <label className="filter-option"><input type="checkbox" checked={filters.price.includes('under2')} onChange={() => handleFilter('price', 'under2')} /> {t('list.price_under_2')}</label>
                            <label className="filter-option"><input type="checkbox" checked={filters.price.includes('2to5')} onChange={() => handleFilter('price', '2to5')} /> {t('list.price_2_to_5')}</label>
                            <label className="filter-option"><input type="checkbox" checked={filters.price.includes('above5')} onChange={() => handleFilter('price', 'above5')} /> {t('list.price_above_5')}</label>
                        </div>
                        <div className="filter-section" style={{ borderBottom: 'none' }}>
                            <div className="filter-title">{t('list.amenities')}</div>
                            {['Hồ bơi', 'Spa', 'Bãi biển riêng', 'Park', 'Playground', 'Tennis court', 'BBQ area', 'Parking', 'Gym'].map(am => <label key={am} className="filter-option"><input type="checkbox" checked={filters.amenities.includes(am)} onChange={() => handleFilter('amenities', am)} /> {amenityLabelMap[am] ?? t(`amenities.${am}`) ?? am}</label>)}
                        </div>
                        <button className="btn-book" style={{ marginTop: '16px' }} onClick={() => onSearch && onSearch(filters)}>{t('list.search_btn')}</button>
                        <button className="btn-outline" style={{ marginTop: '12px', width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '12px', background: 'transparent', color: 'var(--mid)', fontWeight: 600, cursor: 'pointer' }} onClick={() => { setFilters({ price: [], stars: [], amenities: [], province: '' }); onSearch && onSearch({ price: [], stars: [], amenities: [], province: '' }); }}>{t('list.clear_all')}</button>
                    </div>
                </div>

                <div className="list-main">
                    <div className="list-main-header">
                        <div className="list-main-title">{t('list.found', { count: totalCount !== undefined ? totalCount : filteredHotels.length })}</div>
                        <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="popular">{t('list.sort_popular')}</option>
                            <option value="priceAsc">{t('list.sort_price_asc')}</option>
                            <option value="priceDesc">{t('list.sort_price_desc')}</option>
                        </select>
                    </div>
                    {loading ? (
                        <div className="empty-state"><h3>{t('list.loading_list')}</h3></div>
                    ) : filteredHotels.length > 0 ? (
                        <div className="hotels-grid">{filteredHotels.map(h => <HotelCard key={h.id} hotel={h} onClick={onNavigateToDetails} showToast={showToast} />)}</div>
                    ) : (
                        <div className="empty-state"><h3>{t('list.no_results')}</h3><button className="btn-outline" style={{ width: 'auto', borderColor: 'var(--gold)', color: 'var(--gold-dark)' }} onClick={() => setFilters({ price: [], stars: [], amenities: [], province: '' })}>{t('common.clear_filters')}</button></div>
                    )}
                </div>
            </div>
        </div>
    );
};
