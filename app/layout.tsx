import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Potter CRM",
  description: "A CRM for witches and wizards — manage clients, offerings, contracts, and payments.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
