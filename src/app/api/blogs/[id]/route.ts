import { NextResponse } from "next/server";
import * as BlogPost from "@/models/BlogPost";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const row = await BlogPost.findBlogPostById(id);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (e) {
    console.error("GET /api/blogs/[id]", e);
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
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
    const updated = await BlogPost.updateBlogPost(id, {
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      date: body.date,
      image: body.image,
      author: body.author,
      category: body.category,
      content: body.content,
      status: body.status === "hidden" ? "hidden" : "visible",
    });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PUT /api/blogs/[id]", e);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const ok = await BlogPost.deleteBlogPost(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/blogs/[id]", e);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
