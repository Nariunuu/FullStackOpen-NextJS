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
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <Link
        href="/blogs"
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to blogs
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {blog.title}
      </h1>
      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex flex-col gap-1">
          <dt className="font-medium text-zinc-500 dark:text-zinc-400">
            Author
          </dt>
          <dd className="text-zinc-900 dark:text-zinc-100">{blog.author}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="font-medium text-zinc-500 dark:text-zinc-400">URL</dt>
          <dd>
            <a
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {blog.url}
            </a>
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="font-medium text-zinc-500 dark:text-zinc-400">
            Likes
          </dt>
          <dd className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
            <span>{blog.likes}</span>
            <form action={likeBlog}>
              <input type="hidden" name="id" value={blog.id} />
              <button
                type="submit"
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Like
              </button>
            </form>
          </dd>
        </div>
      </dl>
    </section>
  );
}
