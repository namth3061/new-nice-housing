import type { Hotel, HotelSpecs } from "@/types/hotel";

export type PropertyFromApi = {
  id: number;
  slug: string;
  name: string;
  location: string;
  description?: string;
  image: string;
  images: string[];
  rawPrice: number;
  price: string;
  stars: number;
  rating: number;
  reviews: string;
  views: string;
  badge: string;
  amenities: string[];
  specs: Record<string, string>;
  detailedAmenities: Array<{ icon: string; text: string }>;
};

function ratingLabel(rating: number): string {
  if (rating >= 9.5) return "Xuất sắc";
  if (rating >= 9) return "Tuyệt vời";
  if (rating >= 8.5) return "Rất tốt";
  return "Tốt";
}

function toHotelSpecs(specs: Record<string, string>): HotelSpecs {
  return {
    bedrooms: specs?.bedrooms ?? 0,
    bathrooms: specs?.bathrooms ?? 0,
    area: specs?.area ?? 0,
    beds: specs?.beds ?? "—",
    guests: specs?.guests ?? "—",
    size: specs?.size ?? "—",
  };
}

export function propertyToHotel(p: PropertyFromApi): Hotel {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    rawPrice: p.rawPrice,
    stars: p.stars,
    rating: p.rating,
    reviews: p.reviews ?? "0",
    views: p.views ?? "0",
    location: p.location ?? "",
    ratingLabel: ratingLabel(p.rating ?? 0),
    badge: p.badge ?? "",
    image: p.image ?? "",
    images: Array.isArray(p.images) ? p.images : [],
    amenities: Array.isArray(p.amenities) ? p.amenities : [],
    specs: toHotelSpecs(p.specs ?? {}),
    description: p.description ?? "",
    detailedAmenities: Array.isArray(p.detailedAmenities) ? p.detailedAmenities : [],
  };
}
