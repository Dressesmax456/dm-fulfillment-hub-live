import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Topbar */}
      <header className="h-16 border-b border-[#242424] flex items-center justify-between px-6">
        <div>
          <h1 className="text-lg font-semibold">DM Fulfillment Hub</h1>
        </div>

        <div className="text-sm text-zinc-400">
          Amazon Dropshipping Automation
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 h-[calc(100vh-64px)] border-r border-[#242424] bg-[#111111]">
          <nav className="p-4 space-y-2">
            <div className="rounded-lg bg-[#171717] px-4 py-3">
              Dashboard
            </div>

            <Link
  href="/orders"
  className="block rounded-lg px-4 py-3 text-zinc-400 hover:bg-[#171717]"
>
  Orders
</Link>

            <div className="rounded-lg px-4 py-3 text-zinc-400 hover:bg-[#171717] cursor-pointer">
              SKU Review
            </div>

            <div className="rounded-lg px-4 py-3 text-zinc-400 hover:bg-[#171717] cursor-pointer">
              Inventory
            </div>

            <div className="rounded-lg px-4 py-3 text-zinc-400 hover:bg-[#171717] cursor-pointer">
              Analytics
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold mb-2">
            Executive Overview
          </h2>

          <p className="text-zinc-400 mb-8">
            Real-time fulfillment performance and profitability.
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#171717] border border-[#242424] rounded-2xl p-6">
              <p className="text-zinc-400 text-sm">
                Today's Orders
              </p>

              <h3 className="text-3xl font-bold mt-2">
                184
              </h3>

              <p className="text-green-500 text-sm mt-2">
                +14.2%
              </p>
            </div>

            <div className="bg-[#171717] border border-[#242424] rounded-2xl p-6">
              <p className="text-zinc-400 text-sm">
                Avg Net Margin
              </p>

              <h3 className="text-3xl font-bold mt-2">
                18.4%
              </h3>

              <p className="text-green-500 text-sm mt-2">
                +2.1%
              </p>
            </div>

            <div className="bg-[#171717] border border-[#242424] rounded-2xl p-6">
              <p className="text-zinc-400 text-sm">
                Expected Profit
              </p>

              <h3 className="text-3xl font-bold mt-2">
                $12,480
              </h3>

              <p className="text-green-500 text-sm mt-2">
                +$2,940
              </p>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="mt-8 bg-[#171717] border border-[#242424] rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">
              Revenue vs Profit
            </h3>

            <div className="h-80 rounded-xl bg-[#111111] border border-[#242424] flex items-center justify-center text-zinc-500">
              Chart Coming Next Step
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}