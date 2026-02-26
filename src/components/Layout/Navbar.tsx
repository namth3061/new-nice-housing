"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
    view?: string;
    goHome?: () => void;
    goList?: () => void;
    showToast: (msg: React.ReactNode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ view, goHome, goList, showToast }) => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isHome = pathname === '/';
    const isHotelList = pathname === '/hotel';
    const isHotelDetail = pathname?.startsWith('/hotel/');
    const isBlogs = pathname === '/blogs';
    const isPolicy = pathname === '/policy';
    const isTerms = pathname === '/terms';

    useEffect(() => { document.body.style.overflow = isMenuOpen ? 'hidden' : ''; }, [isMenuOpen]);

    return (
        <>
            <nav>
                <Link href="/" className="logo">Nice<span>Housing</span></Link>
                <ul className="nav-links">
                    <li><Link href="/" className={isHome ? 'active' : ''}>Trang chủ</Link></li>
                    <li><Link href="/hotel" className={isHotelList || isHotelDetail ? 'active' : ''}>Khách sạn & Nơi lưu trú</Link></li>
                    <li><Link href="/blogs" className={isBlogs ? 'active' : ''}>Blogs</Link></li>
                    <li><Link href="/policy" className={isPolicy ? 'active' : ''}>Chính sách</Link></li>
                    <li><Link href="/terms" className={isTerms ? 'active' : ''}>Điều khoản</Link></li>
                </ul>
                <div className="nav-actions desktop-actions">
                    <Link href="/admin/login" className="btn-outline" style={{ width: 'auto', textDecoration: 'none' }}>Đăng nhập</Link>
                </div>
                <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(true)}><i className="fa-solid fa-bars"></i></button>
            </nav>

            <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <Link href="/" className="logo" onClick={() => setIsMenuOpen(false)}>Nice<span>Housing</span></Link>
                    <button className="mobile-menu-close" onClick={() => setIsMenuOpen(false)}><i className="fa-solid fa-xmark"></i></button>
                </div>
                <ul className="mobile-nav-links">
                    <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Trang chủ</Link></li>
                    <li><Link href="/hotel" onClick={() => setIsMenuOpen(false)}>Khách sạn & Nơi lưu trú</Link></li>
                    <li><Link href="/blogs" onClick={() => setIsMenuOpen(false)}>Blogs</Link></li>
                    <li><Link href="/policy" onClick={() => setIsMenuOpen(false)}>Chính sách</Link></li>
                    <li><Link href="/terms" onClick={() => setIsMenuOpen(false)}>Điều khoản</Link></li>
                </ul>
                <div className="mobile-nav-actions">
                    <Link href="/admin/login" className="btn-outline" onClick={() => setIsMenuOpen(false)} style={{ textAlign: 'center', textDecoration: 'none' }}>Đăng nhập</Link>
                </div>
            </div>
        </>
    );
};
