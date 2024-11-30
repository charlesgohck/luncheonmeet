import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { AuthNavBar } from "../components/AuthNavbar";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthNavBar />
        <div className="m-5 flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
