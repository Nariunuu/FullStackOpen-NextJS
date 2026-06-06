import Link from "next/link";
import NewBlogForm from "./NewBlogForm";

export default function NewBlogPage() {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-6 py-12">
      <header className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            New blog
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Title, author, and URL each need at least 5 characters.
          </p>
        </div>
        <Link
          href="/blogs"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Cancel
        </Link>
      </header>
      <NewBlogForm />
    </section>
  );
}
