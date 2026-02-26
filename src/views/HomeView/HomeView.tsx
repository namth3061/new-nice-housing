"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Hotel } from '../../types/hotel';
import { HotelCard } from '../../components/HotelCard/HotelCard';

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
  { name: 'Nha Trang', count: '320+ chỗ nghỉ', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80' },
  { name: 'Đà Nẵng', count: '280+ chỗ nghỉ', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80' },
  { name: 'Hội An', count: '190+ chỗ nghỉ', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80' },
  { name: 'Phú Quốc', count: '250+ chỗ nghỉ', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80' },
];

interface HomeViewProps {
    hotels: Hotel[];
    loading?: boolean;
    onNavigateToList: () => void;
    onNavigateToDetails: (hotel: Hotel) => void;
    showToast: (msg: React.ReactNode) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ hotels, loading, onNavigateToList, onNavigateToDetails, showToast }) => {
    const router = useRouter();
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    useEffect(() => { window.scrollTo(0, 0); }, []);
    useEffect(() => {
        fetch('/api/blogs')
            .then((r) => r.json())
            .then((data) => setBlogPosts(Array.isArray(data) ? data.slice(0, 6) : []))
            .catch(() => setBlogPosts([]));
    }, []);

    const goToSearchResult = () => {
        showToast(<span><i className="fa-solid fa-magnifying-glass"></i> Đang tìm kiếm...</span>);
        setTimeout(() => router.push('/hotel'), 500);
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="page-transition">
            <section className="hero">
                <div className="hero-bg"></div><div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="hero-badge"><i className="fa-solid fa-crown"></i> Nền tảng đặt phòng hàng đầu Việt Nam</div>
                    <h1>Nơi nghỉ dưỡng<br /><span className="accent">hoàn hảo</span> cho bạn</h1>
                    <p>Khám phá hàng ngàn khách sạn, resort, căn hộ cao cấp trên khắp Việt Nam với giá tốt nhất</p>
                    <div className="search-box">
                        <div className="search-field">
                            <label><i className="fa-solid fa-location-dot"></i> Điểm đến</label>
                            <input type="text" placeholder="Hà Nội, Đà Nẵng..." />
                        </div>
                        <div className="search-field">
                            <label><i className="fa-regular fa-calendar"></i> Nhận phòng</label>
                            <input type="date" />
                        </div>
                        <div className="search-field">
                            <label><i className="fa-regular fa-calendar"></i> Trả phòng</label>
                            <input type="date" />
                        </div>
                        <button type="button" className="btn-search" onClick={goToSearchResult}>
                            <i className="fa-solid fa-magnifying-glass"></i> Tìm kiếm
                        </button>
                    </div>
                </div>
            </section>

            <div className="home-banner-strip">
                <p><i className="fa-solid fa-bolt" style={{ marginRight: '8px' }}></i> Ưu đãi độc quyền: Giảm đến 30% khi đặt phòng lần đầu</p>
                <button type="button" className="banner-cta" onClick={goToSearchResult}>Khám phá ngay</button>
            </div>

            <div className="home-stats">
                <div className="home-stat-item">
                    <div className="home-stat-num">2.500+</div>
                    <div className="home-stat-label">Khách sạn</div>
                </div>
                <div className="home-stat-item">
                    <div className="home-stat-num">63</div>
                    <div className="home-stat-label">Tỉnh thành</div>
                </div>
                <div className="home-stat-item">
                    <div className="home-stat-num">500K+</div>
                    <div className="home-stat-label">Khách hàng</div>
                </div>
                <div className="home-stat-item">
                    <div className="home-stat-num">4.9</div>
                    <div className="home-stat-label">Đánh giá trung bình</div>
                </div>
            </div>

            <section>
                <div className="section-header">
                    <div>
                        <div className="section-eyebrow"><i className="fa-solid fa-map-location-dot"></i> Khám phá</div>
                        <div className="section-title">Điểm đến phổ biến</div>
                    </div>
                    <span className="see-all" onClick={goToSearchResult}>Xem tất cả <i className="fa-solid fa-arrow-right"></i></span>
                </div>
                <div className="home-destinations">
                    {DESTINATIONS.map((dest) => (
                        <div key={dest.name} className="home-dest-card card-anim" onClick={goToSearchResult}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={dest.image} alt={dest.name} />
                            <div className="overlay">
                                <strong>{dest.name}</strong>
                                <span>{dest.count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="section-header">
                    <div>
                        <div className="section-eyebrow"><i className="fa-solid fa-award"></i> Được yêu thích nhất</div>
                        <div className="section-title">Khách sạn nổi bật</div>
                    </div>
                    <span className="see-all" onClick={goToSearchResult}>Xem tất cả <i className="fa-solid fa-arrow-right"></i></span>
                </div>
                <div className="hotels-grid">
                    {(loading ? [] : hotels.slice(0, 6)).map((hotel) => (
                        <HotelCard
                            key={hotel.id}
                            hotel={hotel}
                            onClick={(h) => router.push(`/hotel/${h.slug}`)}
                            showToast={showToast}
                        />
                    ))}
                </div>
            </section>

            <div className="home-why-us">
                <div className="home-why-item">
                    <div className="icon-wrap"><i className="fa-solid fa-bolt"></i></div>
                    <h4>Đặt phòng nhanh</h4>
                    <p>Xác nhận tức thì, không phí ẩn. Thanh toán an toàn với nhiều lựa chọn.</p>
                </div>
                <div className="home-why-item">
                    <div className="icon-wrap"><i className="fa-solid fa-tag"></i></div>
                    <h4>Giá tốt nhất</h4>
                    <p>So sánh giá từ hàng ngàn chỗ nghỉ. Mã giảm giá và ưu đãi độc quyền.</p>
                </div>
                <div className="home-why-item">
                    <div className="icon-wrap"><i className="fa-solid fa-headset"></i></div>
                    <h4>Hỗ trợ 24/7</h4>
                    <p>Đội ngũ tư vấn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.</p>
                </div>
                <div className="home-why-item">
                    <div className="icon-wrap"><i className="fa-solid fa-shield-halved"></i></div>
                    <h4>Bảo mật & Tin cậy</h4>
                    <p>Thông tin được bảo vệ. Hoàn tiền minh bạch theo chính sách.</p>
                </div>
            </div>

            <section>
                <div className="section-header">
                    <div>
                        <div className="section-eyebrow"><i className="fa-solid fa-newspaper"></i> Tin tức & Mẹo hay</div>
                        <div className="section-title">Blogs</div>
                    </div>
                    <Link href="/blogs" className="see-all">Xem tất cả <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
                <div className="hotels-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                    {blogPosts.map((post) => (
                        <Link key={post.id} href={`/blogs/${post.slug}`} className="hotel-card" style={{ textDecoration: 'none', color: 'inherit' }}>
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
            </section>
        </div>
    );
};
