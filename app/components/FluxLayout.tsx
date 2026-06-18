"use client";

import Link from "next/link";

export default function FluxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6">
        <div className="mb-8">
  <h1 className="text-2xl font-bold">
    DM Hub
  </h1>

  <p className="text-sm text-slate-400 mt-1">
    Fulfillment Portal
  </p>
</div>

        <nav className="space-y-2">
          <Link
            href="/"
            className="block rounded-xl px-4 py-3 hover:bg-slate-800"
          >
            Dashboard
          </Link>

          <Link
            href="/orders"
            className="block rounded-xl px-4 py-3 bg-slate-800 text-white"
          >
            Orders
          </Link>

          <Link
            href="/failed"
            className="block rounded-xl px-4 py-3 hover:bg-slate-800"
          >
            Failed Orders
          </Link>

          <Link
            href="/logs"
            className="block rounded-xl px-4 py-3 hover:bg-slate-800"
          >
            S&S Logs
          </Link>

          <Link
            href="/settings"
            className="block rounded-xl px-4 py-3 hover:bg-slate-800"
          >
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}