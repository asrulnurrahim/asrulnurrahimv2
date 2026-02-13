import React from "react";
import { Users, ShoppingCart, TrendingUp, CreditCard } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Welcome back, Asrul Nur Rahim
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            Add New
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="4,250"
          trend="+12%"
          icon={<Users className="w-6 h-6 text-blue-500" />}
          bg="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          title="Total Sales"
          value="$45,250"
          trend="+24%"
          icon={<ShoppingCart className="w-6 h-6 text-emerald-500" />}
          bg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          title="Revenue"
          value="$12,450"
          trend="-5%"
          isNegative
          icon={<TrendingUp className="w-6 h-6 text-orange-500" />}
          bg="bg-orange-50 dark:bg-orange-900/20"
        />
        <StatCard
          title="Expenses"
          value="$4,250"
          trend="+2%"
          icon={<CreditCard className="w-6 h-6 text-purple-500" />}
          bg="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">User</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-lg">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                <TransactionRow
                  user="John Doe"
                  date="2023-11-04"
                  status="Completed"
                  amount="$450.00"
                />
                <TransactionRow
                  user="Jane Smith"
                  date="2023-11-03"
                  status="Pending"
                  amount="$120.50"
                />
                <TransactionRow
                  user="Robert Brown"
                  date="2023-11-02"
                  status="Failed"
                  amount="$65.00"
                />
                <TransactionRow
                  user="Emily Davis"
                  date="2023-11-01"
                  status="Completed"
                  amount="$1,200.00"
                />
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold mb-4">Storage Usage</h3>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-40 h-40 rounded-full border-12 border-slate-100 dark:border-slate-700 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-12 border-blue-500 border-t-transparent border-r-transparent transform -rotate-45"></div>
              <div className="text-center">
                <span className="block text-3xl font-bold">75%</span>
                <span className="text-xs text-gray-400">Used</span>
              </div>
            </div>
            <p className="mt-6 text-center text-gray-500 text-sm">
              Your storage is running low. Please upgrade your plan to continue
              using all features.
            </p>
            <button className="mt-6 w-full py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
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
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
            {title}
          </h3>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${bg}`}>{icon}</div>
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
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
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
