import "./globals.css";
import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Insane Rabbit",
    template: "%s | Insane Rabbit"
  },
  description: "Independent software studio building focused tools and apps.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Insane Rabbit",
    title: "Insane Rabbit",
    description: "Independent software studio building focused tools and apps.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Insane Rabbit"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Insane Rabbit",
    description: "Independent software studio building focused tools and apps.",
    images: ["/opengraph-image"]
  },
  icons: {
    icon: "/images/InsaneRabbit_LOGO_1.png",
    apple: "/images/InsaneRabbit_LOGO_1.png"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink font-sans">
        <div className="flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
