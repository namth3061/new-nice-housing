import { query } from "@/lib/db";

export interface PropertyRow {
  id: number;
  slug: string;
  name: string;
  category: string;
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
  price_type: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface PropertyCreate {
  slug: string;
  name: string;
  category?: string;
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
  priceType?: string;
  status?: "available" | "unavailable";
}

export interface PropertyUpdate extends Partial<PropertyCreate> { }

function toCamel(r: PropertyRow) {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category ?? "",
    location: r.location,
    province: r.province,
    district: r.district,
    ward: r.ward,
    address: r.address,
    description: r.description,
    image: r.image,
    images: r.images ?? [],
    rawPrice: r.raw_price,
    priceType: r.price_type || 'month',
    price: formatPrice(r.raw_price, r.price_type),
    stars: r.stars,
    rating: r.rating,
    reviews: r.reviews,
    views: r.views,
    badge: r.badge,
    amenities: r.amenities ?? [],
    specs: (r.specs as Record<string, string>) ?? {},
    detailedAmenities: (r.detailed_amenities as Array<{ icon: string; text: string }>) ?? [],
    maxGuests: r.max_guests,
    status: (r.status === "unavailable" ? "unavailable" : "available") as "available" | "unavailable",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function formatPrice(n: number, type?: string) {
  const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  return `${formatted} /${type || 'month'}`;
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
  sql += ` ORDER BY id DESC`;
  const { rows } = await query<PropertyRow>(sql, params);
  return rows.map(toCamel);
}

export async function findPropertiesPaginated(options: {
  search?: string;
  stars?: string;
  price_min?: number;
  price_max?: number;
  amenities?: string;
  province?: string;
  status?: "available" | "unavailable";
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(50, Math.max(1, options.limit ?? 10));
  const offset = (page - 1) * limit;
  let where = `WHERE 1=1`;
  const params: unknown[] = [];
  let i = 1;
  if (options.status) {
    where += ` AND status = $${i}`;
    params.push(options.status);
    i++;
  }
  if (options.province && options.province.trim() !== "") {
    where += ` AND province = $${i}`;
    params.push(options.province.trim());
    i++;
  }
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
  if (options.price_min !== undefined) {
    where += ` AND raw_price >= $${i}`;
    params.push(options.price_min);
    i++;
  }
  if (options.price_max !== undefined) {
    where += ` AND raw_price <= $${i}`;
    params.push(options.price_max);
    i++;
  }
  if (options.amenities) {
    const amenityArray = options.amenities.split(',').filter(a => a.trim() !== '');
    if (amenityArray.length > 0) {
      where += ` AND amenities @> $${i}::text[]`;
      params.push(amenityArray);
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

export async function getDistinctProvinces(): Promise<string[]> {
  const { rows } = await query<{ province: string }>(
    `SELECT DISTINCT province FROM properties WHERE status = 'available' AND TRIM(province) <> '' ORDER BY province ASC`
  );
  return rows.map((r) => r.province);
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
    `INSERT INTO properties (slug, name, category, location, province, district, ward, address, description, image, images, raw_price, stars, rating, reviews, views, badge, amenities, specs, detailed_amenities, max_guests, price_type, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
     RETURNING *`,
    [
      data.slug,
      data.name,
      data.category ?? "",
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
      data.priceType ?? "month",
      data.status ?? "available",
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
    category: data.category ?? existing.category ?? "",
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
    priceType: data.priceType ?? existing.priceType,
    status: data.status ?? existing.status ?? "available",
  };
  const { rows } = await query<PropertyRow>(
    `UPDATE properties SET slug=$2, name=$3, category=$4, location=$5, province=$6, district=$7, ward=$8, address=$9, description=$10, image=$11, images=$12, raw_price=$13, stars=$14, rating=$15, reviews=$16, views=$17, badge=$18, amenities=$19, specs=$20, detailed_amenities=$21, max_guests=$22, price_type=$23, status=$24, updated_at=NOW()
     WHERE id = $1 RETURNING *`,
    [
      id,
      payload.slug,
      payload.name,
      payload.category,
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
      payload.priceType,
      payload.status,
    ]
  );
  return rows[0] ? toCamel(rows[0]) : null;
}

export async function deleteProperty(id: number) {
  const { rowCount } = await query("DELETE FROM properties WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
}
