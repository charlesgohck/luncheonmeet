import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const geistSans = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Luncheon Meet",
  description: "Making Connections over Lunch and Other Activies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar />
        <div className="m-5">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
