import Link from "next/link";
import { auth, signOut } from "../auth";
import NavLink from "./NavLink";

async function logout() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export default async function Navigation() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
        >
          home
        </Link>

        <div className="flex items-center gap-1">
          <NavLink href="/blogs">blogs</NavLink>
          <NavLink href="/users">users</NavLink>
          {session?.user && <NavLink href="/blogs/new">create new</NavLink>}
          {session?.user && <NavLink href="/me">me</NavLink>}
        </div>

        <div className="ml-auto flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <span className="hidden text-zinc-600 dark:text-zinc-400 sm:inline">
                Signed in as{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {session.user.name ?? session.user.email}
                </span>
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-md bg-red-600 px-3 py-1.5 text-white transition-colors hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-zinc-700 transition-colors hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-white transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
