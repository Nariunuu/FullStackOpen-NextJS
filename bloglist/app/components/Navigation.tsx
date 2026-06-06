import Link from "next/link";
import { auth, signOut } from "../auth";

async function logout() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export default async function Navigation() {
  const session = await auth();

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

        <div className="ml-auto flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <span className="text-zinc-600 dark:text-zinc-400">
                Signed in as{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {session.user.name ?? session.user.email}
                </span>
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-md border border-zinc-300 px-3 py-1 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-zinc-900 px-3 py-1 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
