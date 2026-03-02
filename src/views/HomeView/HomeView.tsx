"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Hotel } from '../../types/hotel';
import { HotelCard } from '../../components/HotelCard/HotelCard';
import { useLanguage } from '@/context/LanguageContext';

interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    image: string;
    author: string;
    category: string;
    content: string;
}

const DESTINATIONS = [
    { name: 'Nha Trang', countKey: 'home.dest_count_nt', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80' },
    { name: 'Đà Nẵng', countKey: 'home.dest_count_dn', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80' },
    { name: 'Hội An', countKey: 'home.dest_count_ha', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80' },
    { name: 'Phú Quốc', countKey: 'home.dest_count_pq', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80' },
];

interface HomeViewProps {
    hotels: Hotel[];
    loading?: boolean;
    onNavigateToList: () => void;
    onNavigateToDetails: (hotel: Hotel) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ hotels, loading, onNavigateToList, onNavigateToDetails }) => {
    const router = useRouter();
    const { t, language } = useLanguage();
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [blogSlide, setBlogSlide] = useState(0);
    const blogPostsLenRef = useRef(0);
    const blogIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const BLOG_VISIBLE = 4;

    const [isMobile, setIsMobile] = useState(false);
    const [destSlide, setDestSlide] = useState(0);
    const destIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [settings, setSettings] = useState<any>(null);
    const [galleryLightboxUrl, setGalleryLightboxUrl] = useState<string | null>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setGalleryLightboxUrl(null); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        document.body.style.overflow = galleryLightboxUrl ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [galleryLightboxUrl]);

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(data => {
                if (data && !data.error) setSettings(data);
            })
            .catch(() => { });
    }, []);

    const [statsSlide, setStatsSlide] = useState(0);
    const statsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [featuresSlide, setFeaturesSlide] = useState(0);
    const featuresIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopDestAuto = () => {
        if (destIntervalRef.current) clearInterval(destIntervalRef.current);
    };

    const stopStatsAuto = () => {
        if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    };

    const stopFeaturesAuto = () => {
        if (featuresIntervalRef.current) clearInterval(featuresIntervalRef.current);
    };

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 600);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const STATS_SLIDE_MS = 3500;
    const DEST_SLIDE_MS = 5500; // Popular Destinations runs slower than stats

    useEffect(() => {
        if (isMobile) {
            stopDestAuto();
            destIntervalRef.current = setInterval(() => {
                setDestSlide((prev) => (prev + 1) % DESTINATIONS.length);
            }, DEST_SLIDE_MS);

            stopStatsAuto();
            statsIntervalRef.current = setInterval(() => {
                setStatsSlide((prev) => (prev + 1) % 4);
            }, STATS_SLIDE_MS);

            stopFeaturesAuto();
            featuresIntervalRef.current = setInterval(() => {
                setFeaturesSlide((prev) => (prev + 1) % 4);
            }, 3500);
        } else {
            stopDestAuto();
            setDestSlide(0);
            stopStatsAuto();
            setStatsSlide(0);
            stopFeaturesAuto();
            setFeaturesSlide(0);
        }
        return () => {
            stopDestAuto();
            stopStatsAuto();
            stopFeaturesAuto();
        };
    }, [isMobile]);

    const stopBlogAuto = () => {
        if (blogIntervalRef.current) clearInterval(blogIntervalRef.current);
    };

    useEffect(() => {
        blogPostsLenRef.current = blogPosts.length;
        if (blogPosts.length > BLOG_VISIBLE) {
            stopBlogAuto();
            blogIntervalRef.current = setInterval(() => {
                const dotCount = Math.max(1, blogPostsLenRef.current - BLOG_VISIBLE + 1);
                setBlogSlide((prev) => (prev + 1) % dotCount);
            }, 3500);
        }
        return stopBlogAuto;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blogPosts.length]);

    const blogDotCount = Math.max(1, blogPosts.length - BLOG_VISIBLE + 1);
    const goBlogPrev = () => setBlogSlide((p) => (p - 1 + blogDotCount) % blogDotCount);
    const goBlogNext = () => setBlogSlide((p) => (p + 1) % blogDotCount);
    const [provinces, setProvinces] = useState<string[]>([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    useEffect(() => { window.scrollTo(0, 0); }, []);
    useEffect(() => {
        fetch('/api/blogs')
            .then((r) => r.json())
            .then((data) => setBlogPosts(Array.isArray(data) ? data.slice(0, 8) : []))
            .catch(() => setBlogPosts([]));
    }, []);
    useEffect(() => {
        fetch("/api/properties/provinces")
            .then((r) => (r.ok ? r.json() : []))
            .then((list) => setProvinces(Array.isArray(list) ? list : []))
            .catch(() => setProvinces([]));
    }, []);

    const goToSearchResult = () => {
        const query = selectedProvince.trim() ? `?province=${encodeURIComponent(selectedProvince.trim())}` : "";
        router.push(`/apartment${query}`);
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="page-transition">
            <section className="hero">
                <div
                    className="hero-bg"
                    style={
                        settings?.banner_active && settings?.banner_image
                            ? { backgroundImage: `radial-gradient(ellipse 60% 80% at 70% 50%, rgba(212, 160, 23, 0.12) 0%, transparent 70%), url('${settings.banner_image}')` }
                            : {}
                    }
                ></div><div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="hero-badge"><i className="fa-solid fa-crown"></i> {t('home.hero_badge')}</div>
                    <h1><span className="accent">{t('home.hero_title_1')}</span><br />{t('home.hero_title_2')}</h1>
                    <p>{t('home.hero_subtitle')}</p>
                    <div className="search-box">
                        <div className="search-field">
                            <label><i className="fa-solid fa-location-dot"></i> {t('home.destination')}</label>
                            <select
                                className="hero-province-select"
                                value={selectedProvince}
                                onChange={(e) => setSelectedProvince(e.target.value)}
                            >
                                <option value="">{t('list.province_all')}</option>
                                {provinces.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        {/* <div className="search-field">
                            <label><i className="fa-regular fa-calendar"></i> {t('details.checkin')}</label>
                            <input type="date" />
                        </div>
                        <div className="search-field">
                            <label><i className="fa-regular fa-calendar"></i> {t('details.checkout')}</label>
                            <input type="date" />
                        </div> */}
                        <button type="button" className="btn-search" onClick={goToSearchResult}>
                            <i className="fa-solid fa-magnifying-glass"></i> {t('common.search')}
                        </button>
                    </div>
                </div>
            </section>

            <div className="home-banner-strip">
                <p><i className="fa-solid fa-bolt" style={{ marginRight: '8px' }}></i> {t('home.hero_offer')}</p>
                <button type="button" className="banner-cta" onClick={goToSearchResult}>{t('home.discover')}</button>
            </div>

            <div
                className="stats-slider-wrap"
                onMouseEnter={stopStatsAuto}
                onMouseLeave={() => {
                    if (isMobile) {
                        stopStatsAuto();
                        statsIntervalRef.current = setInterval(() => {
                            setStatsSlide((prev) => (prev + 1) % 4);
                        }, 3500);
                    }
                }}
            >
                <div className="stats-slider-viewport">
                    <div
                        className="home-stats"
                        style={isMobile ? { transform: `translateX(calc(-${statsSlide} * 100%))` } : {}}
                    >
                        <div className="home-stat-item">
                            <div className="home-stat-num">2.500+</div>
                            <div className="home-stat-label">{t('home.stat_apartments')}</div>
                        </div>
                        <div className="home-stat-item">
                            <div className="home-stat-num">63</div>
                            <div className="home-stat-label">{t('home.stat_provinces')}</div>
                        </div>
                        <div className="home-stat-item">
                            <div className="home-stat-num">500K+</div>
                            <div className="home-stat-label">{t('home.stat_customers')}</div>
                        </div>
                        <div className="home-stat-item">
                            <div className="home-stat-num">4.9</div>
                            <div className="home-stat-label">{t('home.stat_rating')}</div>
                        </div>
                    </div>
                </div>
            </div>

            {isMobile && (
                <div className="blog-slider-dots">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <button
                            key={i}
                            className={`blog-dot${i === statsSlide ? ' active' : ''}`}
                            onClick={() => setStatsSlide(i)}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            <section>
                <div className="section-header">
                    <div>
                        <div className="section-eyebrow"><i className="fa-solid fa-map-location-dot"></i> {t('home.discover')}</div>
                        <div className="section-title">{t('home.popular_destinations')}</div>
                    </div>
                    <span className="see-all" onClick={goToSearchResult}>{t('common.all')} <i className="fa-solid fa-arrow-right"></i></span>
                </div>
                <div
                    className="dest-slider-wrap"
                    onMouseEnter={stopDestAuto}
                    onMouseLeave={() => {
                        if (isMobile) {
                            stopDestAuto();
                            destIntervalRef.current = setInterval(() => {
                                setDestSlide((prev) => (prev + 1) % DESTINATIONS.length);
                            }, DEST_SLIDE_MS);
                        }
                    }}
                >
                    <div className="dest-slider-viewport">
                        <div
                            className="home-destinations"
                            style={isMobile ? { transform: `translateX(calc(-${destSlide} * 100% - ${destSlide} * 20px))` } : {}}
                        >
                            {DESTINATIONS.map((dest) => (
                                <div key={dest.name} className="home-dest-card card-anim" onClick={goToSearchResult}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={dest.image} alt={dest.name} />
                                    <div className="overlay">
                                        <strong>{dest.name}</strong>
                                        <span>{t(dest.countKey)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {isMobile && (
                    <div className="blog-slider-dots">
                        {DESTINATIONS.map((_, i) => (
                            <button
                                key={i}
                                className={`blog-dot${i === destSlide ? ' active' : ''}`}
                                onClick={() => setDestSlide(i)}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section>
                <div className="section-header">
                    <div>
                        <div className="section-eyebrow"><i className="fa-solid fa-award"></i> {t('home.most_loved')}</div>
                        <div className="section-title">{t('home.featured_apartments')}</div>
                    </div>
                    <span className="see-all" onClick={goToSearchResult}>{t('common.all')} <i className="fa-solid fa-arrow-right"></i></span>
                </div>
                <div className="home-featured-row">
                    {(loading ? [] : hotels.slice(0, 5)).map((hotel) => (
                        <HotelCard
                            key={hotel.id}
                            hotel={hotel}
                            onClick={(h) => router.push(`/apartment/${h.slug}`)}
                        />
                    ))}
                </div>
            </section>

            <div
                className="features-slider-wrap"
                onMouseEnter={stopFeaturesAuto}
                onMouseLeave={() => {
                    if (isMobile) {
                        stopFeaturesAuto();
                        featuresIntervalRef.current = setInterval(() => {
                            setFeaturesSlide((prev) => (prev + 1) % 4);
                        }, 3500);
                    }
                }}
            >
                <div className="features-slider-viewport">
                    <div
                        className="home-why-us"
                        style={isMobile ? { transform: `translateX(calc(-${featuresSlide} * 100% - ${featuresSlide} * 28px))` } : {}}
                    >
                        <div className="home-why-item">
                            <div className="icon-wrap"><i className="fa-solid fa-bolt"></i></div>
                            <h4>{t('home.feature_1_title')}</h4>
                            <p>{t('home.feature_1_desc')}</p>
                        </div>
                        <div className="home-why-item">
                            <div className="icon-wrap"><i className="fa-solid fa-tag"></i></div>
                            <h4>{t('home.feature_2_title')}</h4>
                            <p>{t('home.feature_2_desc')}</p>
                        </div>
                        <div className="home-why-item">
                            <div className="icon-wrap"><i className="fa-solid fa-headset"></i></div>
                            <h4>{t('home.feature_3_title')}</h4>
                            <p>{t('home.feature_3_desc')}</p>
                        </div>
                        <div className="home-why-item">
                            <div className="icon-wrap"><i className="fa-solid fa-shield-halved"></i></div>
                            <h4>{t('home.feature_4_title')}</h4>
                            <p>{t('home.feature_4_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {isMobile && (
                <div className="blog-slider-dots">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <button
                            key={i}
                            className={`blog-dot${i === featuresSlide ? ' active' : ''}`}
                            onClick={() => setFeaturesSlide(i)}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            <section>
                <div className="section-header">
                    <div>
                        <div className="section-eyebrow"><i className="fa-solid fa-newspaper"></i> {t('home.news_tips')}</div>
                        <div className="section-title">{t('common.blogs')}</div>
                    </div>
                    <Link href="/blogs" className="see-all">{t('common.all')} <i className="fa-solid fa-arrow-right"></i></Link>
                </div>

                {/* Blog Slider */}
                <div
                    className="blog-slider-wrap"
                    onMouseEnter={stopBlogAuto}
                    onMouseLeave={() => {
                        if (blogPosts.length > BLOG_VISIBLE) {
                            stopBlogAuto();
                            blogIntervalRef.current = setInterval(() => {
                                const dotCount = Math.max(1, blogPostsLenRef.current - BLOG_VISIBLE + 1);
                                setBlogSlide((prev) => (prev + 1) % dotCount);
                            }, 3500);
                        }
                    }}
                >
                    {/* Prev */}
                    {blogPosts.length > BLOG_VISIBLE && (
                        <button className="blog-slider-btn blog-slider-btn--prev" onClick={goBlogPrev} aria-label="Previous">
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                    )}

                    {/* Track */}
                    <div className="blog-slider-viewport">
                        <div
                            className="blog-slider-track"
                            style={{ transform: `translateX(calc(-${blogSlide} * (100% / ${BLOG_VISIBLE}) - ${blogSlide} * var(--blog-gap)))` }}
                        >
                            {blogPosts.map((post) => (
                                <Link key={post.id} href={`/blogs/${post.slug}`} className="hotel-card blog-slide-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="card-img" style={{ height: '200px' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={post.image} alt={post.title} />
                                        <span className="card-badge">{post.category}</span>
                                    </div>
                                    <div className="card-body">
                                        <div style={{ fontSize: '12px', color: 'var(--gold)', marginBottom: '8px' }}>
                                            {formatDate(post.date)} · {post.author}
                                        </div>
                                        <div className="card-name" style={{ marginBottom: '8px' }}>{post.title}</div>
                                        <p style={{ fontSize: '14px', color: 'var(--mid)', lineHeight: 1.6 }}>{post.excerpt}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Next */}
                    {blogPosts.length > BLOG_VISIBLE && (
                        <button className="blog-slider-btn blog-slider-btn--next" onClick={goBlogNext} aria-label="Next">
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    )}
                </div>

                {/* Dots */}
                {blogPosts.length > BLOG_VISIBLE && (
                    <div className="blog-slider-dots">
                        {Array.from({ length: blogDotCount }).map((_, i) => (
                            <button
                                key={i}
                                className={`blog-dot${i === blogSlide ? ' active' : ''}`}
                                onClick={() => setBlogSlide(i)}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section>
                <div className="section-header">
                    <div>
                        <div className="section-eyebrow"><i className="fa-solid fa-images"></i> {t('home.gallery_eyebrow') || 'Photo Gallery'}</div>
                        <div className="section-title">{t('home.gallery_title') || 'Khoảnh khắc tại Nine Housing'}</div>
                    </div>
                </div>
                <div className="home-photo-gallery">
                    {hotels.length > 0 && (
                        <>
                            {/* Large featured image */}
                            <div className="gallery-featured" onClick={() => hotels[0]?.image && setGalleryLightboxUrl(hotels[0].image)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && hotels[0]?.image && setGalleryLightboxUrl(hotels[0].image)} aria-label="Xem ảnh phóng to">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={hotels[0]?.image} alt={hotels[0]?.name || 'Gallery'} />
                                <div className="gallery-overlay">
                                    <i className="fa-solid fa-expand"></i>
                                </div>
                            </div>
                            {/* 3×2 grid of thumbnails */}
                            <div className="gallery-grid">
                                {hotels.slice(1, 7).map((hotel, idx) => (
                                    <div key={idx} className="gallery-thumb" onClick={() => setGalleryLightboxUrl(hotel.image)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setGalleryLightboxUrl(hotel.image)} aria-label="Xem ảnh phóng to">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={hotel.image} alt={hotel.name} />
                                        <div className="gallery-overlay">
                                            <i className="fa-solid fa-expand"></i>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Gallery lightbox - render in body so it's always on top */}
                {typeof document !== 'undefined' && galleryLightboxUrl && createPortal(
                    <div className="gallery-lightbox" onClick={() => setGalleryLightboxUrl(null)} role="dialog" aria-modal="true" aria-label="Ảnh phóng to">
                        <button type="button" className="gallery-lightbox-close" onClick={(e) => { e.stopPropagation(); setGalleryLightboxUrl(null); }} aria-label="Đóng">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={galleryLightboxUrl} alt="" onClick={(e) => e.stopPropagation()} />
                    </div>,
                    document.body
                )}
            </section>
        </div>
    );
};
