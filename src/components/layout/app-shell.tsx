import Link from "next/link";

import { logout } from "@/app/(auth)/actions";
import { CurioLogo } from "@/components/brand/curio-logo";
import { Button } from "@/components/ui/button";

type AppShellProps = {
  children: React.ReactNode;
  title: string;
};

const navigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workspace", label: "Workspace" },
  { href: "/library", label: "Library" }
] as const;

export function AppShell({ children, title }: AppShellProps) {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-8 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="inline-block text-primary">
            <CurioLogo className="h-[30px] w-auto" />
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {title}
          </h1>
        </div>
        <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-end">
          <nav className="flex flex-wrap gap-x-3 gap-y-2 text-sm font-medium text-muted-foreground">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logout}>
            <Button type="submit" variant="ghost">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <div className="space-y-6">{children}</div>
    </main>
  );
}
