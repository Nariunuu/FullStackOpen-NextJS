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

  const allBlogs = await getBlogs();
  const blogs = allBlogs
    .filter((blog) =>
      normalized ? blog.title.toLowerCase().includes(normalized) : true,
    )
    .toSorted((a, b) => b.likes - a.likes);

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Blogs
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Sorted by likes, highest first.
          </p>
        </div>
        <Link
          href="/blogs/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          + New blog
        </Link>
      </header>

      <form action="/blogs" method="get" className="flex gap-2">
        <input
          type="text"
          name="filter"
          defaultValue={filterValue}
          placeholder="Filter by title…"
          data-testid="filter-input"
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
        />
        <button
          type="submit"
          data-testid="search-button"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
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

      {blogs.length === 0 && !normalized ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          No blogs yet. Be the first to{" "}
          <Link
            href="/blogs/new"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            add one
          </Link>
          .
        </div>
      ) : (
        <ul data-testid="blogs-list" className="flex flex-col gap-3">
          {blogs.map((blog) => (
            <li key={blog.id}>
              <Link
                href={`/blogs/${blog.id}`}
                className="group flex items-start justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-medium text-zinc-900 group-hover:underline dark:text-zinc-50">
                    {blog.title}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    by {blog.author}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                  {blog.likes} {blog.likes === 1 ? "like" : "likes"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
