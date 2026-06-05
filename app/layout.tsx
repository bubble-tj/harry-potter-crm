import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Potter CRM",
  description: "A CRM for witches and wizards — manage clients, offerings, contracts, and payments.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://reverse-bubble.up.railway.app/overlay/v1/rb-overlay.js" defer data-rb-project="c5d1fff9-cc27-40d6-a9a4-800c860f78a8" data-rb-token="rbo_TNZYXzmK0RmDb1fvl1_pekPc864crRwZ" />
      </head>
      <body>{children}</body>
    </html>
  );
}
