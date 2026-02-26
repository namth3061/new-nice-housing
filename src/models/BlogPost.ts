import { query } from "@/lib/db";

export interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  author: string;
  category: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface BlogPostCreate {
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  image?: string;
  author?: string;
  category?: string;
  content?: string;
}

export interface BlogPostUpdate extends Partial<BlogPostCreate> {}

function toCamel(r: BlogPostRow) {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    date: r.date,
    image: r.image,
    author: r.author,
    category: r.category,
    content: r.content,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function findAllBlogPosts(filters?: { search?: string }) {
  let sql = `SELECT * FROM blog_posts WHERE 1=1`;
  const params: unknown[] = [];
  if (filters?.search) {
    sql += ` AND (title ILIKE $1 OR category ILIKE $1 OR author ILIKE $1)`;
    params.push(`%${filters.search}%`);
  }
  sql += ` ORDER BY date DESC, id DESC`;
  const { rows } = await query<BlogPostRow>(sql, params);
  return rows.map(toCamel);
}

export async function findBlogPostsPaginated(options: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(50, Math.max(1, options.limit ?? 9));
  const offset = (page - 1) * limit;
  let where = `WHERE 1=1`;
  const params: unknown[] = [];
  if (options.search) {
    where += ` AND (title ILIKE $1 OR category ILIKE $1 OR author ILIKE $1)`;
    params.push(`%${options.search}%`);
  }
  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count FROM blog_posts ${where}`,
    params
  );
  const total = Number(countResult.rows[0]?.count ?? 0);
  const listParams = [...params, limit, offset];
  const listSql = `SELECT * FROM blog_posts ${where} ORDER BY date DESC, id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  const { rows } = await query<BlogPostRow>(listSql, listParams);
  return { list: rows.map(toCamel), total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function findBlogPostById(id: number) {
  const { rows } = await query<BlogPostRow>("SELECT * FROM blog_posts WHERE id = $1", [id]);
  return rows[0] ? toCamel(rows[0]) : null;
}

export async function findBlogPostBySlug(slug: string) {
  const { rows } = await query<BlogPostRow>("SELECT * FROM blog_posts WHERE slug = $1", [slug]);
  return rows[0] ? toCamel(rows[0]) : null;
}

export async function createBlogPost(data: BlogPostCreate) {
  const { rows } = await query<BlogPostRow>(
    `INSERT INTO blog_posts (slug, title, excerpt, date, image, author, category, content)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      data.slug,
      data.title,
      data.excerpt ?? "",
      data.date ?? new Date().toISOString().slice(0, 10),
      data.image ?? "",
      data.author ?? "",
      data.category ?? "",
      data.content ?? "",
    ]
  );
  return rows[0] ? toCamel(rows[0]) : null;
}

export async function updateBlogPost(id: number, data: BlogPostUpdate) {
  const existing = await findBlogPostById(id);
  if (!existing) return null;
  const payload = {
    slug: data.slug ?? existing.slug,
    title: data.title ?? existing.title,
    excerpt: data.excerpt ?? existing.excerpt,
    date: data.date ?? existing.date,
    image: data.image ?? existing.image,
    author: data.author ?? existing.author,
    category: data.category ?? existing.category,
    content: data.content ?? existing.content,
  };
  const { rows } = await query<BlogPostRow>(
    `UPDATE blog_posts SET slug=$2, title=$3, excerpt=$4, date=$5, image=$6, author=$7, category=$8, content=$9, updated_at=NOW()
     WHERE id = $1 RETURNING *`,
    [id, payload.slug, payload.title, payload.excerpt, payload.date, payload.image, payload.author, payload.category, payload.content]
  );
  return rows[0] ? toCamel(rows[0]) : null;
}

export async function deleteBlogPost(id: number) {
  const { rowCount } = await query("DELETE FROM blog_posts WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
}
