export interface AmenityDetail {
    icon: string;
    text: string;
}

export interface HotelSpecs {
    bedrooms?: string | number;
    bathrooms?: string | number;
    area?: string | number;
    beds?: string | number;
    guests?: string | number;
    size?: string | number;
}

export interface Hotel {
    id: number;
    slug: string;
    name: string;
    price: string;
    priceType?: string;
    rawPrice: number;
    stars: number;
    rating: number;
    reviews: string;
    views: string;
    location: string;
    ratingLabel: string;
    badge: string;
    image: string;
    images: string[];
    amenities: string[];
    specs: HotelSpecs;
    description: string;
    detailedAmenities: AmenityDetail[];
}
