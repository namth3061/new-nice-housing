import { Hotel } from '../types/hotel';

export const HOTELS: Hotel[] = [
    {
        id: 1, slug: 'vinpearl-luxury-nha-trang', name: 'Vinpearl Luxury Nha Trang', price: '4.250.000₫', rawPrice: 4250000, stars: 5, rating: 9.4, reviews: '1.280', views: '24.5K',
        location: 'Nha Trang, Khánh Hòa', ratingLabel: 'Xuất sắc', badge: 'HOT DEAL',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
        images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80'],
        amenities: ['Hồ bơi', 'Spa', 'Bãi biển riêng'],
        specs: { beds: '1 Giường King lớn', guests: '2 Người lớn, 1 Trẻ em', size: '60 m²' },
        description: `Tọa lạc tại vị trí đắc địa trên đảo Hòn Tre, Vinpearl Luxury mang đến không gian nghỉ dưỡng biệt lập đẳng cấp.`,
        detailedAmenities: [{ icon: 'fa-solid fa-water-ladder', text: 'Hồ bơi vô cực riêng' }, { icon: 'fa-solid fa-spa', text: 'Akoya Spa trên mặt nước' }, { icon: 'fa-solid fa-utensils', text: 'Bữa sáng Buffet quốc tế' }]
    },
    {
        id: 2, slug: 'intercontinental-da-nang', name: 'InterContinental Đà Nẵng', price: '6.800.000₫', rawPrice: 6800000, stars: 5, rating: 9.7, reviews: '987', views: '18.2K',
        location: 'Sơn Trà, Đà Nẵng', ratingLabel: 'Tuyệt vời', badge: 'SANG TRỌNG',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80'],
        amenities: ['View biển', 'Bar', 'Spa'],
        specs: { beds: '2 Giường Queen', guests: '4 Khách', size: '85 m²' },
        description: `Khu nghỉ dưỡng huyền thoại InterContinental Danang Sun Peninsula Resort được thiết kế bởi Bill Bensley.`,
        detailedAmenities: [{ icon: 'fa-solid fa-umbrella-beach', text: 'Bãi biển riêng tư' }, { icon: 'fa-solid fa-wine-glass', text: 'Nhà hàng La Maison 1888' }, { icon: 'fa-solid fa-hot-tub-person', text: 'HARNN Heritage Spa' }]
    },
    {
        id: 3, slug: 'sofitel-legend-metropole', name: 'Sofitel Legend Metropole', price: '5.500.000₫', rawPrice: 5500000, stars: 5, rating: 9.5, reviews: '2.041', views: '32.1K',
        location: 'Hoàn Kiếm, Hà Nội', ratingLabel: 'Xuất sắc', badge: 'LỊCH SỬ',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80'],
        amenities: ['Di sản 1901', 'Hồ bơi', 'Fine Dining'],
        specs: { beds: '1 Giường đôi', guests: '2 Khách', size: '45 m²' },
        description: `Biểu tượng của sự thanh lịch Pháp giữa lòng thủ đô ngàn năm văn hiến. Kể từ năm 1901...`,
        detailedAmenities: [{ icon: 'fa-solid fa-building-columns', text: 'Kiến trúc Pháp cổ điển' }, { icon: 'fa-solid fa-mug-saucer', text: 'Bữa sáng kiểu Âu' }, { icon: 'fa-solid fa-water-ladder', text: 'Hồ bơi nước ấm trong nhà' }]
    },
    {
        id: 4, slug: 'muong-thanh-luxury-da-nang', name: 'Mường Thanh Luxury Đà Nẵng', price: '1.500.000₫', rawPrice: 1500000, stars: 4, rating: 8.8, reviews: '3.120', views: '15.5K',
        location: 'Ngũ Hành Sơn, Đà Nẵng', ratingLabel: 'Rất tốt', badge: 'GIÁ TỐT',
        image: 'https://images.unsplash.com/photo-1542314831-c6a4d27ce66f?w=600&q=80',
        images: ['https://images.unsplash.com/photo-1542314831-c6a4d27ce66f?w=1200&q=80', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80'],
        amenities: ['Hồ bơi', 'Ăn sáng', 'View biển'],
        specs: { beds: '2 Giường đơn', guests: '2 Khách', size: '35 m²' },
        description: `Nằm ngay sát bãi biển Mỹ Khê tuyệt đẹp, khách sạn 4 sao mang đến trải nghiệm nghỉ dưỡng thoải mái với mức giá hợp lý.`,
        detailedAmenities: [{ icon: 'fa-solid fa-water-ladder', text: 'Hồ bơi ngoài trời' }, { icon: 'fa-solid fa-utensils', text: 'Buffet sáng đa dạng' }, { icon: 'fa-solid fa-dumbbell', text: 'Phòng Gym' }]
    },
    {
        id: 5, slug: 'the-myst-dong-khoi', name: 'The Myst Dong Khoi', price: '3.200.000₫', rawPrice: 3200000, stars: 5, rating: 9.3, reviews: '1.540', views: '20.1K',
        location: 'Quận 1, TP.HCM', ratingLabel: 'Tuyệt vời', badge: 'BOUTIQUE',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80',
        images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80'],
        amenities: ['Hồ bơi', 'Trung tâm TP', 'Trà chiều'],
        specs: { beds: '1 Giường King', guests: '2 Khách', size: '40 m²' },
        description: `Mang đậm dấu ấn Sài Gòn xưa pha trộn với thiết kế đương đại, The Myst mang đến một ốc đảo bình yên.`,
        detailedAmenities: [{ icon: 'fa-solid fa-water-ladder', text: 'Hồ bơi tầng thượng' }, { icon: 'fa-solid fa-mug-hot', text: 'Trà chiều miễn phí' }, { icon: 'fa-solid fa-bath', text: 'Bồn tắm ngoài ban công' }]
    },
    {
        id: 6, slug: 'ladas-eco-house-hoi-an', name: 'Lada\'s Eco House Hội An', price: '850.000₫', rawPrice: 850000, stars: 3, rating: 9.0, reviews: '420', views: '5.2K',
        location: 'Cẩm Châu, Hội An', ratingLabel: 'Xuất sắc', badge: '',
        image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&q=80',
        images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1200&q=80'],
        amenities: ['Vườn sinh thái', 'Xe đạp', 'Bếp chung'],
        specs: { beds: '1 Giường đôi lớn', guests: '2 Khách', size: '28 m²' },
        description: `Homestay mộc mạc ẩn mình giữa cánh đồng lúa xanh mướt của Hội An. Trải nghiệm cuộc sống yên bình.`,
        detailedAmenities: [{ icon: 'fa-solid fa-bicycle', text: 'Mượn xe đạp miễn phí' }, { icon: 'fa-solid fa-leaf', text: 'Sân vườn rộng rãi' }, { icon: 'fa-solid fa-kitchen-set', text: 'Bếp nấu ăn chung' }]
    }
];
