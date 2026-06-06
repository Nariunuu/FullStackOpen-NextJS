import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { blogs as blogsTable } from "../db/schema";

export type Blog = {
  id: number;
  title: string;
  author: string;
  url: string;
  likes: number;
};

export type NewBlogInput = {
  title: string;
  author: string;
  url: string;
};

export async function getBlogs(): Promise<Blog[]> {
  return db.select().from(blogsTable);
}

export async function getBlogById(id: number): Promise<Blog | null> {
  if (!Number.isInteger(id)) {
    return null;
  }
  const rows = await db
    .select()
    .from(blogsTable)
    .where(eq(blogsTable.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function addBlog(input: NewBlogInput): Promise<Blog> {
  const [created] = await db
    .insert(blogsTable)
    .values({
      title: input.title,
      author: input.author,
      url: input.url,
    })
    .returning();
  return created;
}

export async function incrementLikes(id: number): Promise<Blog | null> {
  if (!Number.isInteger(id)) {
    return null;
  }
  const [updated] = await db
    .update(blogsTable)
    .set({ likes: sql`${blogsTable.likes} + 1` })
    .where(eq(blogsTable.id, id))
    .returning();
  return updated ?? null;
}
