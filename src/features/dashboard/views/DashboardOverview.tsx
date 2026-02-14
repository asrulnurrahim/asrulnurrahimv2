import React from "react";
import { Users, ShoppingCart, TrendingUp, CreditCard } from "lucide-react";
import { getDashboardStats } from "../services";

export async function DashboardOverview() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back, Asrul Nur Rahim
          </p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            Add New
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.value}
          trend={stats.totalUsers.trend}
          icon={<Users className="h-6 w-6 text-blue-500" />}
          bg="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          title="Total Sales"
          value={stats.totalSales.value}
          trend={stats.totalSales.trend}
          icon={<ShoppingCart className="h-6 w-6 text-emerald-500" />}
          bg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          title="Revenue"
          value={stats.revenue.value}
          trend={stats.revenue.trend}
          isNegative
          icon={<TrendingUp className="h-6 w-6 text-orange-500" />}
          bg="bg-orange-50 dark:bg-orange-900/20"
        />
        <StatCard
          title="Expenses"
          value={stats.expenses.value}
          trend={stats.expenses.trend}
          icon={<CreditCard className="h-6 w-6 text-purple-500" />}
          bg="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 text-lg font-bold">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase dark:bg-gray-700/50">
                <tr>
                  <th className="rounded-l-lg px-4 py-3">User</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="rounded-r-lg px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {stats.recentTransactions.map((tx, i) => (
                  <TransactionRow
                    key={i}
                    user={tx.user}
                    date={tx.date}
                    status={tx.status}
                    amount={tx.amount}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 text-lg font-bold">Storage Usage</h3>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-12 border-slate-100 dark:border-slate-700">
              <div className="absolute inset-0 -rotate-45 transform rounded-full border-12 border-blue-500 border-t-transparent border-r-transparent"></div>
              <div className="text-center">
                <span className="block text-3xl font-bold">75%</span>
                <span className="text-xs text-gray-400">Used</span>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-gray-500">
              Your storage is running low. Please upgrade your plan to continue
              using all features.
            </p>
            <button className="mt-6 w-full rounded-lg bg-slate-100 py-2 text-sm font-medium transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600">
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  trend,
  icon,
  bg,
  isNegative = false,
}: {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  bg: string;
  isNegative?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </div>
        </div>
        <div className={`rounded-lg p-3 ${bg}`}>{icon}</div>
      </div>
      <div
        className={`flex items-center text-xs font-medium ${isNegative ? "text-red-500" : "text-emerald-500"}`}
      >
        {trend}
        <span className="ml-1 text-gray-400">vs last month</span>
      </div>
    </div>
  );
}

function TransactionRow({
  user,
  date,
  status,
  amount,
}: {
  user: string;
  date: string;
  status: string;
  amount: string;
}) {
  const statusColor =
    {
      Completed: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
      Pending: "text-orange-500 bg-orange-50 dark:bg-orange-900/20",
      Failed: "text-red-500 bg-red-50 dark:bg-red-900/20",
    }[status] || "text-gray-500";

  return (
    <tr>
      <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
        {user}
      </td>
      <td className="px-4 py-4 text-gray-500">{date}</td>
      <td className="px-4 py-4">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
        >
          {status}
        </span>
      </td>
      <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
        {amount}
      </td>
    </tr>
  );
}
