export const getCategoryColor = (slug: string) => {
  const colors: Record<
    string,
    {
      bg: string;
      text: string;
      darkBg: string;
      darkText: string;
      solid: string;
    }
  > = {
    development: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      darkBg: "dark:bg-blue-900/20",
      darkText: "dark:text-blue-400",
      solid: "bg-blue-600",
    },
    design: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      darkBg: "dark:bg-purple-900/20",
      darkText: "dark:text-purple-400",
      solid: "bg-purple-600",
    },
    technology: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      darkBg: "dark:bg-emerald-900/20",
      darkText: "dark:text-emerald-400",
      solid: "bg-emerald-600",
    },
    tutorial: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      darkBg: "dark:bg-amber-900/20",
      darkText: "dark:text-amber-400",
      solid: "bg-amber-600",
    },
    news: {
      bg: "bg-red-50",
      text: "text-red-700",
      darkBg: "dark:bg-red-900/20",
      darkText: "dark:text-red-400",
      solid: "bg-red-600",
    },
  };

  return (
    colors[slug] || {
      bg: "bg-gray-100",
      text: "text-gray-700",
      darkBg: "dark:bg-gray-800",
      darkText: "dark:text-gray-300",
      solid: "bg-gray-700",
    }
  );
};
