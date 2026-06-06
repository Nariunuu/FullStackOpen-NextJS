import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
        <span className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Bloglist
        </span>
        <div className="flex gap-4 text-sm">
          <Link
            href="/"
            className="text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/blogs"
            className="text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
          >
            Blogs
          </Link>
        </div>
      </div>
    </nav>
  );
}
