import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Danny & Tivwa | Wedding Celebration",
  description:
    "Join Danny and Tivwa for a romantic wedding celebration. View the details, story, gallery, and RSVP online."
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
