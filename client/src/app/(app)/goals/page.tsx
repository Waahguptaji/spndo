import { Car, Film, ShoppingCart, Utensils } from "lucide-react";
import React from "react";
import ListItem from "@/components/ui/ListItem";
import WidgetCard from "@/components/dashboard/WidgetCard";
import AddGoalButton from "@/components/goal/AddGoalButton";

type Goal = {
  title: string;
  amount: number;
  current: number;
  date: string;
  description: string;
};

const goalsData: Goal[] = [
  {
    title: "Emergency Fund",
    amount: 5000,
    current: 2750,
    date: "2025-12-31",
    description: "Build a safety net for unexpected expenses.",
  },
  {
    title: "Vacation",
    amount: 2500,
    current: 1200,
    date: "2025-07-15",
    description: "Summer trip to Japan.",
  },
  {
    title: "New Laptop",
    amount: 1500,
    current: 900,
    date: "2025-03-01",
    description: "Upgrade to a reliable work laptop.",
  },
  {
    title: "Shopping",
    amount: 400,
    current: 180,
    date: "2025-10-01",
    description: "Budget for seasonal wardrobe updates.",
  },
  {
    title: "Dining Out",
    amount: 200,
    current: 60,
    date: "2025-05-01",
    description: "Monthly budget for restaurants and cafes.",
  },
];

const iconMap: { [key: string]: React.ReactNode } = {
  "Emergency Fund": (
    <ShoppingCart className="text-green-600 dark:text-green-400" size={28} />
  ),
  "New Laptop": (
    <Film className="text-purple-600 dark:text-purple-400" size={28} />
  ),
  Vacation: <Car className="text-blue-600 dark:text-blue-400" size={28} />,
  Shopping: (
    <ShoppingCart className="text-pink-600 dark:text-pink-400" size={28} />
  ),
  "Dining Out": (
    <Utensils className="text-orange-600 dark:text-orange-400" size={28} />
  ),
};

const GoalsPage = () => {
  return (
    <WidgetCard title="All Goals" actionSlot={<AddGoalButton />}>
      {goalsData.map((goal) => (
        <ListItem
          key={goal.title}
          variant="goal"
          title={goal.title}
          icon={iconMap[goal.title]}
          progress={{ current: goal.current, total: goal.amount }}
        />
      ))}
    </WidgetCard>
  );
};

export default GoalsPage;
