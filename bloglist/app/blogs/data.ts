import { and, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { blogs as blogsTable, readingList } from "../db/schema";

export type Blog = {
  id: number;
  title: string;
  author: string;
  url: string;
  likes: number;
  userId: number | null;
};

export type NewBlogInput = {
  title: string;
  author: string;
  url: string;
  userId: number;
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
  return db.transaction(async (tx) => {
    const [created] = await tx
      .insert(blogsTable)
      .values({
        title: input.title,
        author: input.author,
        url: input.url,
        userId: input.userId,
      })
      .returning();

    await tx
      .insert(readingList)
      .values({ userId: input.userId, blogId: created.id })
      .onConflictDoNothing();

    return created;
  });
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

export async function addBlogToReadingList(
  userId: number,
  blogId: number,
): Promise<void> {
  await db
    .insert(readingList)
    .values({ userId, blogId })
    .onConflictDoNothing();
}

export async function isInReadingList(
  userId: number,
  blogId: number,
): Promise<boolean> {
  const row = await db
    .select({ id: readingList.id })
    .from(readingList)
    .where(
      and(eq(readingList.userId, userId), eq(readingList.blogId, blogId)),
    )
    .limit(1);
  return row.length > 0;
}
