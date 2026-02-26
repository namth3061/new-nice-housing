"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Hotel } from '../../types/hotel';
import { HotelCard } from '../../components/HotelCard/HotelCard';

interface ListViewProps {
    hotels: Hotel[];
    loading?: boolean;
    onNavigateToDetails: (hotel: Hotel) => void;
    onBack: () => void;
    showToast: (msg: React.ReactNode) => void;
}

export const ListView: React.FC<ListViewProps> = ({ hotels, loading, onNavigateToDetails, onBack, showToast }) => {
    const [filters, setFilters] = useState<{ price: string[]; stars: number[]; amenities: string[] }>({ price: [], stars: [], amenities: [] });
    const [sortOrder, setSortOrder] = useState('popular');
    useEffect(() => { window.scrollTo(0, 0); }, []);

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
        let res = source.filter(h => {
            let passPrice = filters.price.length === 0 || filters.price.some(r => r === 'under2' ? h.rawPrice < 2000000 : r === '2to5' ? h.rawPrice >= 2000000 && h.rawPrice <= 5000000 : h.rawPrice > 5000000);
            let passStars = filters.stars.length === 0 || filters.stars.includes(h.stars);
            let passAmenities = filters.amenities.length === 0 || filters.amenities.every(am => h.amenities.includes(am));
            return passPrice && passStars && passAmenities;
        });
        if (sortOrder === 'priceAsc') res.sort((a, b) => a.rawPrice - b.rawPrice);
        if (sortOrder === 'priceDesc') res.sort((a, b) => b.rawPrice - a.rawPrice);
        if (sortOrder === 'popular') res.sort((a, b) => b.rating - a.rating);
        return res;
    }, [hotels, loading, filters, sortOrder]);

    return (
        <div className="list-page page-transition">
            <div className="breadcrumb"><span onClick={onBack}>Trang chủ</span> <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px' }}></i> <strong style={{ color: 'var(--black)' }}>Khách sạn & Nơi lưu trú</strong></div>
            <div className="list-layout">
                <div className="filter-sidebar">
                    <div className="filter-header">
                        <h3>Bộ lọc tìm kiếm</h3>
                        <button className="clear-filter" onClick={() => setFilters({ price: [], stars: [], amenities: [] })}>Xóa tất cả</button>
                    </div>
                    <div className="filter-section">
                        <div className="filter-title">Mức giá</div>
                        <label className="filter-option"><input type="checkbox" checked={filters.price.includes('under2')} onChange={() => handleFilter('price', 'under2')} /> Dưới 2.000.000₫</label>
                        <label className="filter-option"><input type="checkbox" checked={filters.price.includes('2to5')} onChange={() => handleFilter('price', '2to5')} /> 2 - 5.000.000₫</label>
                        <label className="filter-option"><input type="checkbox" checked={filters.price.includes('above5')} onChange={() => handleFilter('price', 'above5')} /> Trên 5.000.000₫</label>
                    </div>
                    <div className="filter-section">
                        <div className="filter-title">Hạng sao</div>
                        {[5, 4, 3].map(s => <label key={s} className="filter-option"><input type="checkbox" checked={filters.stars.includes(s)} onChange={() => handleFilter('stars', s)} /> {s} Sao</label>)}
                    </div>
                    <div className="filter-section" style={{ borderBottom: 'none' }}>
                        <div className="filter-title">Tiện nghi</div>
                        {['Hồ bơi', 'Spa', 'Bãi biển riêng'].map(am => <label key={am} className="filter-option"><input type="checkbox" checked={filters.amenities.includes(am)} onChange={() => handleFilter('amenities', am)} /> {am}</label>)}
                    </div>
                </div>

                <div className="list-main">
                    <div className="list-main-header">
                        <div className="list-main-title">Tìm thấy {filteredHotels.length} chỗ nghỉ</div>
                        <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="popular">Đề xuất hàng đầu</option>
                            <option value="priceAsc">Giá thấp nhất</option>
                            <option value="priceDesc">Giá cao nhất</option>
                        </select>
                    </div>
                    {loading ? (
                        <div className="empty-state"><h3>Đang tải danh sách...</h3></div>
                    ) : filteredHotels.length > 0 ? (
                        <div className="hotels-grid">{filteredHotels.map(h => <HotelCard key={h.id} hotel={h} onClick={onNavigateToDetails} showToast={showToast} />)}</div>
                    ) : (
                        <div className="empty-state"><h3>Không tìm thấy kết quả phù hợp</h3><button className="btn-outline" style={{ width: 'auto', borderColor: 'var(--gold)', color: 'var(--gold-dark)' }} onClick={() => setFilters({ price: [], stars: [], amenities: [] })}>Xóa bộ lọc</button></div>
                    )}
                </div>
            </div>
        </div>
    );
};
