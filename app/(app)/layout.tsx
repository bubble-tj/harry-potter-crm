import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { SideNav } from "@/components/nav";
import { logoutAction } from "@/lib/actions/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 border-r border-stone-200 bg-white p-4 flex flex-col">
        <Link href="/dashboard" className="text-xl font-bold text-wizard-900 px-2 py-1 mb-4">
          Potter CRM
        </Link>
        <SideNav />
        <div className="mt-auto pt-4 border-t border-stone-200">
          <p className="px-3 text-xs text-stone-500 mb-1">Signed in as</p>
          <p className="px-3 text-sm font-medium text-stone-800 truncate">{user.name || user.email}</p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-2 w-full text-left rounded-md px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8 max-w-6xl">{children}</main>
    </div>
  );
}
