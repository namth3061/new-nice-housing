import { NextResponse } from "next/server";
import * as BlogPost from "@/models/BlogPost";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? undefined;
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : undefined;
    const limit = limitParam ? Math.min(50, Math.max(1, parseInt(limitParam, 10) || 9)) : undefined;

    if (page !== undefined || limit !== undefined) {
      const result = await BlogPost.findBlogPostsPaginated({
        search,
        page: page ?? 1,
        limit: limit ?? 9,
      });
      return NextResponse.json(result);
    }

    const list = await BlogPost.findAllBlogPosts({ search });
    return NextResponse.json(list);
  } catch (e) {
    console.error("GET /api/blogs", e);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.slug ?? body.title?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ?? "";
    const created = await BlogPost.createBlogPost({
      slug: slug || `post-${Date.now()}`,
      title: body.title,
      excerpt: body.excerpt,
      date: body.date,
      image: body.image,
      author: body.author,
      category: body.category,
      content: body.content,
    });
    if (!created) return NextResponse.json({ error: "Create failed" }, { status: 400 });
    return NextResponse.json(created);
  } catch (e) {
    console.error("POST /api/blogs", e);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
