import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Danny & Filoza | Wedding Celebration",
  description:
    "Join Danny and Filoza for a romantic wedding celebration. View the details, story, gallery, and RSVP online."
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
