import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Curio",
  description: "A learning operating system for curious people."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
