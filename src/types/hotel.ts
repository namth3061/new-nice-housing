export interface AmenityDetail {
    icon: string;
    text: string;
}

export interface HotelSpecs {
    beds: string;
    guests: string;
    size: string;
}

export interface Hotel {
    id: number;
    slug: string;
    name: string;
    price: string;
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
