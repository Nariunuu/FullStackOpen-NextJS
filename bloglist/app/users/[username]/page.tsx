import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
    with: { blogs: true },
  });

  if (!user) {
    notFound();
  }

  const blogs = user.blogs.toSorted((a, b) => b.likes - a.likes);

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {user.name}
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        @{user.username}
      </p>

      <h2 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
        Added blogs
      </h2>

      {blogs.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {user.name} hasn&apos;t added any blogs yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {blogs.map((blog) => (
            <li
              key={blog.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <Link
                href={`/blogs/${blog.id}`}
                className="text-zinc-900 hover:underline dark:text-zinc-50"
              >
                {blog.title}
              </Link>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                by {blog.author} · {blog.likes} likes
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
