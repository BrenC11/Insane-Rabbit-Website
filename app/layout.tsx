import "./globals.css";
import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Insane Rabbit",
  description: "Independent software studio building focused tools and apps.",
  openGraph: {
    title: "Insane Rabbit",
    description: "Independent software studio building focused tools and apps.",
    images: [
      {
        url: "/images/InsaneRabbit_LOGO_1.png",
        alt: "Insane Rabbit logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Insane Rabbit",
    description: "Independent software studio building focused tools and apps.",
    images: ["/images/InsaneRabbit_LOGO_1.png"]
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
