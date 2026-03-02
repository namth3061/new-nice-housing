import { NextResponse } from "next/server";
import * as Property from "@/models/Property";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? undefined;
    const stars = searchParams.get("stars") ?? undefined;
    const price_min_param = searchParams.get("price_min");
    const price_max_param = searchParams.get("price_max");
    const amenities = searchParams.get("amenities") ?? undefined;
    const province = searchParams.get("province") ?? undefined;
    const category = searchParams.get("category") ?? undefined;

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : undefined;
    const limit = limitParam ? Math.min(50, Math.max(1, parseInt(limitParam, 10) || 10)) : undefined;

    const price_min = price_min_param ? parseInt(price_min_param, 10) : undefined;
    const price_max = price_max_param ? parseInt(price_max_param, 10) : undefined;

    if (page !== undefined || limit !== undefined) {
      const result = await Property.findPropertiesPaginated({
        search,
        stars,
        price_min,
        price_max,
        amenities,
        province,
        category,
        status: "available",
        page: page ?? 1,
        limit: limit ?? 10,
      });
      return NextResponse.json(result);
    }

    const list = await Property.findAllProperties({ search, stars });
    return NextResponse.json(list);
  } catch (e) {
    console.error("GET /api/properties", e);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.slug ?? body.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ?? "";
    const created = await Property.createProperty({
      slug: slug || `property-${Date.now()}`,
      name: body.name,
      category: body.category ?? "",
      location: body.location,
      province: body.province,
      district: body.district,
      ward: body.ward,
      address: body.address,
      description: body.description,
      image: body.image,
      images: body.images,
      rawPrice: body.rawPrice ?? body.raw_price ?? 0,
      priceType: body.priceType ?? body.price_type ?? "month",
      stars: body.stars,
      rating: body.rating,
      reviews: body.reviews,
      views: body.views,
      badge: body.badge,
      amenities: body.amenities,
      specs: body.specs,
      detailedAmenities: body.detailedAmenities ?? body.detailed_amenities,
      maxGuests: body.maxGuests ?? body.max_guests,
      status: body.status === "unavailable" ? "unavailable" : "available",
    });
    if (!created) return NextResponse.json({ error: "Create failed" }, { status: 400 });
    return NextResponse.json(created);
  } catch (e) {
    console.error("POST /api/properties", e);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
