import Link from "next/link";
import { getBlogs } from "./data";

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const { filter } = await searchParams;
  const filterValue = typeof filter === "string" ? filter : "";
  const normalized = filterValue.trim().toLowerCase();

  const blogs = getBlogs()
    .filter((blog) =>
      normalized ? blog.title.toLowerCase().includes(normalized) : true,
    )
    .toSorted((a, b) => b.likes - a.likes);

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Blogs
        </h1>
        <Link
          href="/blogs/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          New blog
        </Link>
      </div>

      <form action="/blogs" method="get" className="flex gap-2">
        <input
          type="text"
          name="filter"
          defaultValue={filterValue}
          placeholder="Filter by title"
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Search
        </button>
      </form>

      {normalized && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {blogs.length === 0
            ? `No blogs match "${filterValue}".`
            : `Showing ${blogs.length} blog${blogs.length === 1 ? "" : "s"} matching "${filterValue}".`}{" "}
          <Link
            href="/blogs"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Clear filter
          </Link>
        </p>
      )}

      <ul className="flex flex-col gap-4">
        {blogs.map((blog) => (
          <li
            key={blog.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="text-lg font-medium">
              <Link
                href={`/blogs/${blog.id}`}
                className="text-zinc-900 hover:underline dark:text-zinc-50"
              >
                {blog.title}
              </Link>
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              by {blog.author}
            </p>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
              {blog.likes} likes
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
