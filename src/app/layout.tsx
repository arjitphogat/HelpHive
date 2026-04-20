import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Helphive | Community Help & Services Platform",
  description: "A community-driven platform connecting people who need help with local service providers, helpers, and community resources.",
  keywords: "help, community, services, local, helper, support, assistance, India",
  openGraph: {
    title: "Helphive | Community Help & Services Platform",
    description: "Connect with local helpers and service providers in your community.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full flex flex-col bg-[var(--color-background)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
