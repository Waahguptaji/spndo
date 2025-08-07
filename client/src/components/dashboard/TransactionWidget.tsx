import { Car, Film, ShoppingCart, Utensils } from "lucide-react";
import React from "react";
import WidgetCard from "./WidgetCard";
import ListItem from "../ui/ListItem";

const iconMap: { [key: string]: React.ReactNode } = {
  Groceries: (
    <ShoppingCart className="text-green-600 dark:text-green-400" size={28} />
  ),
  Entertainment: (
    <Film className="text-purple-600 dark:text-purple-400" size={28} />
  ),
  Transportation: (
    <Car className="text-blue-600 dark:text-blue-400" size={28} />
  ),
  Shopping: (
    <ShoppingCart className="text-pink-600 dark:text-pink-400" size={28} />
  ),
  "Dining Out": (
    <Utensils className="text-orange-600 dark:text-orange-400" size={28} />
  ),
};

const transactionData = [
  {
    title: "Groceries",
    amount: -45.67,
    date: "Today",
    description: "Whole Foods Market",
  },
  {
    title: "Entertainment",
    amount: -12.99,
    date: "Yesterday",
    description: "Netflix Subscription",
  },
  {
    title: "Transportation",
    amount: -28.5,
    date: "2 days ago",
    description: "Uber ride",
  },
  {
    title: "Shopping",
    amount: -89.99,
    date: "3 days ago",
    description: "Amazon Purchase",
  },
  {
    title: "Dining Out",
    amount: -32.45,
    date: "4 days ago",
    description: "Italian Restaurant",
  },
];

const TransactionWidget = () => {
  return (
    <WidgetCard title="Transaction">
      <div className="space-y-2">
        {transactionData.map((transaction) => (
          <ListItem
            key={transaction.title}
            variant="transaction"
            title={transaction.title}
            icon={iconMap[transaction.title]}
            amount={transaction.amount.toString()}
            date={transaction.date}
            description={transaction.description}
          />
        ))}
      </div>
    </WidgetCard>
  );
};

export default TransactionWidget;
