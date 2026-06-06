"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const base =
    "rounded-md px-2 py-1 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500";
  const stateClasses = isActive
    ? "bg-zinc-100 font-medium text-zinc-950 dark:bg-zinc-900 dark:text-white"
    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white";

  return (
    <Link href={href} className={`${base} ${stateClasses}`}>
      {children}
    </Link>
  );
}
