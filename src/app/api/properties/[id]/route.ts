import { NextResponse } from "next/server";
import * as Property from "@/models/Property";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const row = await Property.findPropertyById(id);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (e) {
    console.error("GET /api/properties/[id]", e);
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const body = await request.json();
    const updated = await Property.updateProperty(id, {
      slug: body.slug,
      name: body.name,
      location: body.location,
      province: body.province,
      district: body.district,
      ward: body.ward,
      address: body.address,
      description: body.description,
      image: body.image,
      images: body.images,
      rawPrice: body.rawPrice ?? body.raw_price,
      stars: body.stars,
      rating: body.rating,
      reviews: body.reviews,
      views: body.views,
      badge: body.badge,
      amenities: body.amenities,
      specs: body.specs,
      detailedAmenities: body.detailedAmenities ?? body.detailed_amenities,
      maxGuests: body.maxGuests ?? body.max_guests,
    });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PUT /api/properties/[id]", e);
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const ok = await Property.deleteProperty(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/properties/[id]", e);
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
  }
}
