import "server-only";

export const getDashboardStats = async () => {
  // TODO: Replace with real data from database
  return {
    totalUsers: { value: "4,250", trend: "+12%" },
    totalSales: { value: "$45,250", trend: "+24%" },
    revenue: { value: "$12,450", trend: "-5%" },
    expenses: { value: "$4,250", trend: "+2%" },
    recentTransactions: [
      {
        user: "John Doe",
        date: "2023-11-04",
        status: "Completed",
        amount: "$450.00",
      },
      {
        user: "Jane Smith",
        date: "2023-11-03",
        status: "Pending",
        amount: "$120.50",
      },
      {
        user: "Robert Brown",
        date: "2023-11-02",
        status: "Failed",
        amount: "$65.00",
      },
      {
        user: "Emily Davis",
        date: "2023-11-01",
        status: "Completed",
        amount: "$1,200.00",
      },
    ],
  };
};
