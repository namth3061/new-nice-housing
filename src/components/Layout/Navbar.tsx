"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

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
    const isApartmentList = pathname === '/apartment';
    const isApartmentDetail = pathname?.startsWith('/apartment/');
    const isBlogs = pathname === '/blogs';
    const isPolicy = pathname === '/policy';
    const isTerms = pathname === '/terms';

    const { t, language, setLanguage } = useLanguage();

    useEffect(() => { document.body.style.overflow = isMenuOpen ? 'hidden' : ''; }, [isMenuOpen]);

    return (
        <>
            <nav>
                <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/logo.png" alt="Nine Housing" style={{ height: '40px', width: 'auto' }} />
                </Link>
                <ul className="nav-links">
                    <li><Link href="/" className={isHome ? 'active' : ''}>{t('common.home')}</Link></li>
                    <li><Link href="/apartment" className={isApartmentList || isApartmentDetail ? 'active' : ''}>{t('common.apartments')}</Link></li>
                    <li><Link href="/blogs" className={isBlogs ? 'active' : ''}>{t('common.blogs')}</Link></li>
                    <li><Link href="/policy" className={isPolicy ? 'active' : ''}>{t('common.policy')}</Link></li>
                    <li><Link href="/terms" className={isTerms ? 'active' : ''}>{t('common.terms')}</Link></li>
                </ul>
                <div className="nav-actions desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="lang-switcher" style={{ display: 'flex', gap: '5px', fontWeight: 'bold', fontSize: '14px', color: '#ffffff' }}>
                        <span style={{ cursor: 'pointer', opacity: language === 'vi' ? 1 : 0.5 }} onClick={() => setLanguage('vi')}>VI</span>
                        <span style={{ opacity: 0.5 }}>|</span>
                        <span style={{ cursor: 'pointer', opacity: language === 'en' ? 1 : 0.5 }} onClick={() => setLanguage('en')}>EN</span>
                    </div>
                    <Link href="/admin/login" className="btn-outline" style={{ width: 'auto', textDecoration: 'none' }}>{t('common.login')}</Link>
                </div>
                <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(true)}><i className="fa-solid fa-bars"></i></button>
            </nav>

            <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <Link href="/" className="logo" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/logo.png" alt="Nine Housing" style={{ height: '32px', width: 'auto' }} />
                    </Link>
                    <button className="mobile-menu-close" onClick={() => setIsMenuOpen(false)}><i className="fa-solid fa-xmark"></i></button>
                </div>
                <ul className="mobile-nav-links">
                    <li><Link href="/" onClick={() => setIsMenuOpen(false)}>{t('common.home')}</Link></li>
                    <li><Link href="/apartment" onClick={() => setIsMenuOpen(false)}>{t('common.apartments')}</Link></li>
                    <li><Link href="/blogs" onClick={() => setIsMenuOpen(false)}>{t('common.blogs')}</Link></li>
                    <li><Link href="/policy" onClick={() => setIsMenuOpen(false)}>{t('common.policy')}</Link></li>
                    <li><Link href="/terms" onClick={() => setIsMenuOpen(false)}>{t('common.terms')}</Link></li>
                </ul>
                <div className="mobile-nav-actions" style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                    <div className="lang-switcher" style={{ display: 'flex', gap: '10px', fontWeight: 'bold', fontSize: '16px', color: '#111827' }}>
                        <span style={{ cursor: 'pointer', opacity: language === 'vi' ? 1 : 0.4 }} onClick={() => setLanguage('vi')}>VI</span>
                        <span style={{ opacity: 0.4 }}>|</span>
                        <span style={{ cursor: 'pointer', opacity: language === 'en' ? 1 : 0.4 }} onClick={() => setLanguage('en')}>EN</span>
                    </div>
                    <Link href="/admin/login" className="btn-outline" onClick={() => setIsMenuOpen(false)} style={{ textAlign: 'center', textDecoration: 'none', width: '100%' }}>{t('common.login')}</Link>
                </div>
            </div>
        </>
    );
};
