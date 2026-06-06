import Link from "next/link";
import { notFound } from "next/navigation";
import { likeBlog } from "../actions";
import { getBlogById } from "../data";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number.parseInt(id, 10);
  const blog = Number.isInteger(numericId)
    ? await getBlogById(numericId)
    : null;

  if (!blog) {
    notFound();
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        <span aria-hidden>←</span> Back to blogs
      </Link>

      <header className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
          {blog.title}
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          by{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {blog.author}
          </span>
        </p>
      </header>

      <dl className="grid gap-6 text-sm sm:grid-cols-[120px_1fr]">
        <dt className="font-medium text-zinc-500 dark:text-zinc-400">URL</dt>
        <dd>
          <a
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-blue-600 hover:underline dark:text-blue-400"
          >
            {blog.url}
          </a>
        </dd>

        <dt className="font-medium text-zinc-500 dark:text-zinc-400">Likes</dt>
        <dd className="flex items-center gap-3">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
            {blog.likes}
          </span>
          <form action={likeBlog}>
            <input type="hidden" name="id" value={blog.id} />
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              <span aria-hidden>♥</span> Like
            </button>
          </form>
        </dd>
      </dl>
    </section>
  );
}
