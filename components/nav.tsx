"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/offerings", label: "Offerings" },
  { href: "/contracts", label: "Contracts" },
  { href: "/payments", label: "Payments" },
];

export function SideNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-wizard-100 text-wizard-900"
                : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
