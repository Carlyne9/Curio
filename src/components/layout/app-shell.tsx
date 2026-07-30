import Link from "next/link";

type AppShellProps = {
  children: React.ReactNode;
  title: string;
};

const navigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workspace", label: "Workspace" },
  { href: "/library", label: "Library" }
];

export function AppShell({ children, title }: AppShellProps) {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-8">
      <header className="mb-8 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Curio
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        </div>
        <nav className="flex gap-3 text-sm font-medium text-muted-foreground">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="space-y-6">{children}</div>
    </main>
  );
}
