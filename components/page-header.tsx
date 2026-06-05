import Link from "next/link";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
        {subtitle ? <p className="text-sm text-stone-600 mt-1">{subtitle}</p> : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="inline-flex items-center rounded-md bg-wizard-600 px-4 py-2 text-sm font-medium text-white hover:bg-wizard-700"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
