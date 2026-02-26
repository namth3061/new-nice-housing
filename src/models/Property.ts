import { query } from "@/lib/db";

export interface PropertyRow {
  id: number;
  slug: string;
  name: string;
  location: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  description: string;
  image: string;
  images: string[];
  raw_price: number;
  stars: number;
  rating: number;
  reviews: string;
  views: string;
  badge: string;
  amenities: string[];
  specs: Record<string, string>;
  detailed_amenities: Array<{ icon: string; text: string }>;
  max_guests: number;
  created_at: Date;
  updated_at: Date;
}

export interface PropertyCreate {
  slug: string;
  name: string;
  location?: string;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  description?: string;
  image?: string;
  images?: string[];
  rawPrice: number;
  stars?: number;
  rating?: number;
  reviews?: string;
  views?: string;
  badge?: string;
  amenities?: string[];
  specs?: Record<string, string>;
  detailedAmenities?: Array<{ icon: string; text: string }>;
  maxGuests?: number;
}

export interface PropertyUpdate extends Partial<PropertyCreate> {}

function toCamel(r: PropertyRow) {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    location: r.location,
    province: r.province,
    district: r.district,
    ward: r.ward,
    address: r.address,
    description: r.description,
    image: r.image,
    images: r.images ?? [],
    rawPrice: r.raw_price,
    price: formatPrice(r.raw_price),
    stars: r.stars,
    rating: r.rating,
    reviews: r.reviews,
    views: r.views,
    badge: r.badge,
    amenities: r.amenities ?? [],
    specs: (r.specs as Record<string, string>) ?? {},
    detailedAmenities: (r.detailed_amenities as Array<{ icon: string; text: string }>) ?? [],
    maxGuests: r.max_guests,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export async function findAllProperties(filters?: { search?: string; stars?: string }) {
  let sql = `SELECT * FROM properties WHERE 1=1`;
  const params: unknown[] = [];
  let i = 1;
  if (filters?.search) {
    sql += ` AND (name ILIKE $${i} OR location ILIKE $${i})`;
    params.push(`%${filters.search}%`);
    i++;
  }
  if (filters?.stars && filters.stars !== "all") {
    const star = filters.stars === "5star" ? 5 : filters.stars === "4star" ? 4 : null;
    if (star !== null) {
      sql += ` AND stars = $${i}`;
      params.push(star);
      i++;
    }
  }
  sql += ` ORDER BY name ASC`;
  const { rows } = await query<PropertyRow>(sql, params);
  return rows.map(toCamel);
}

export async function findPropertiesPaginated(options: {
  search?: string;
  stars?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(50, Math.max(1, options.limit ?? 10));
  const offset = (page - 1) * limit;
  let where = `WHERE 1=1`;
  const params: unknown[] = [];
  let i = 1;
  if (options.search) {
    where += ` AND (name ILIKE $${i} OR location ILIKE $${i})`;
    params.push(`%${options.search}%`);
    i++;
  }
  if (options.stars && options.stars !== "all") {
    const star = options.stars === "5star" ? 5 : options.stars === "4star" ? 4 : null;
    if (star !== null) {
      where += ` AND stars = $${i}`;
      params.push(star);
      i++;
    }
  }
  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count FROM properties ${where}`,
    params
  );
  const total = Number(countResult.rows[0]?.count ?? 0);
  const listParams = [...params, limit, offset];
  const listSql = `SELECT * FROM properties ${where} ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  const { rows } = await query<PropertyRow>(listSql, listParams);
  return { list: rows.map(toCamel), total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function findPropertyById(id: number) {
  const { rows } = await query<PropertyRow>("SELECT * FROM properties WHERE id = $1", [id]);
  return rows[0] ? toCamel(rows[0]) : null;
}

export async function findPropertyBySlug(slug: string) {
  const { rows } = await query<PropertyRow>("SELECT * FROM properties WHERE slug = $1", [slug]);
  return rows[0] ? toCamel(rows[0]) : null;
}

export async function createProperty(data: PropertyCreate) {
  const { rows } = await query<PropertyRow>(
    `INSERT INTO properties (slug, name, location, province, district, ward, address, description, image, images, raw_price, stars, rating, reviews, views, badge, amenities, specs, detailed_amenities, max_guests)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
     RETURNING *`,
    [
      data.slug,
      data.name,
      data.location ?? "",
      data.province ?? "",
      data.district ?? "",
      data.ward ?? "",
      data.address ?? "",
      data.description ?? "",
      data.image ?? "",
      data.images ?? [],
      data.rawPrice,
      data.stars ?? 3,
      data.rating ?? 0,
      data.reviews ?? "0",
      data.views ?? "0",
      data.badge ?? "",
      data.amenities ?? [],
      JSON.stringify(data.specs ?? {}),
      JSON.stringify(data.detailedAmenities ?? []),
      data.maxGuests ?? 2,
    ]
  );
  return rows[0] ? toCamel(rows[0]) : null;
}

export async function updateProperty(id: number, data: PropertyUpdate) {
  const existing = await findPropertyById(id);
  if (!existing) return null;
  const payload = {
    slug: data.slug ?? existing.slug,
    name: data.name ?? existing.name,
    location: data.location ?? existing.location,
    province: data.province ?? existing.province,
    district: data.district ?? existing.district,
    ward: data.ward ?? existing.ward,
    address: data.address ?? existing.address,
    description: data.description ?? existing.description,
    image: data.image ?? existing.image,
    images: data.images ?? existing.images,
    rawPrice: data.rawPrice ?? existing.rawPrice,
    stars: data.stars ?? existing.stars,
    rating: data.rating ?? existing.rating,
    reviews: data.reviews ?? existing.reviews,
    views: data.views ?? existing.views,
    badge: data.badge ?? existing.badge,
    amenities: data.amenities ?? existing.amenities,
    specs: data.specs ?? existing.specs,
    detailedAmenities: data.detailedAmenities ?? existing.detailedAmenities,
    maxGuests: data.maxGuests ?? existing.maxGuests,
  };
  const { rows } = await query<PropertyRow>(
    `UPDATE properties SET slug=$2, name=$3, location=$4, province=$5, district=$6, ward=$7, address=$8, description=$9, image=$10, images=$11, raw_price=$12, stars=$13, rating=$14, reviews=$15, views=$16, badge=$17, amenities=$18, specs=$19, detailed_amenities=$20, max_guests=$21, updated_at=NOW()
     WHERE id = $1 RETURNING *`,
    [
      id,
      payload.slug,
      payload.name,
      payload.location,
      payload.province,
      payload.district,
      payload.ward,
      payload.address,
      payload.description,
      payload.image,
      payload.images,
      payload.rawPrice,
      payload.stars,
      payload.rating,
      payload.reviews,
      payload.views,
      payload.badge,
      payload.amenities,
      JSON.stringify(payload.specs),
      JSON.stringify(payload.detailedAmenities),
      payload.maxGuests,
    ]
  );
  return rows[0] ? toCamel(rows[0]) : null;
}

export async function deleteProperty(id: number) {
  const { rowCount } = await query("DELETE FROM properties WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
}
