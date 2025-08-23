"use client";

import React from "react";
import ListItem from "@/components/ui/ListItem";
import { DollarSign } from "lucide-react";

const NotificationsPage: React.FC = () => {
  const notifications = [
    {
      id: 1,
      title: "Payment Successful",
      description: "Your electricity bill has been paid",
      rightLabel: "2h ago",
      icon: <DollarSign />
    },
    {
      id: 2,
      title: "New Goal Created",
      description: "You started a savings goal: Vacation Fund",
      rightLabel: "Yesterday",
      icon: <DollarSign />
    },
    {
      id: 3,
      title: "Reminder Alert",
      description: "Rent due tomorrow",
      rightLabel: "1d ago",
      icon: <DollarSign />
    },
  ];

  return (
    <div className="p-4 space-y-4 bg-neutral-lightGrey dark:bg-neutral-dark min-h-screen">
      <h2 className="text-xl font-semibold text-neutral-dark1 dark:text-neutral-white">
        Your Latest Updates 📬
      </h2>
      {notifications.map((item) => (
        <ListItem
          key={item.id}
          variant="notification"
          title={item.title}
          description={item.description}
          rightLabel={item.rightLabel}
          icon={item.icon}
        />
      ))}
    </div>
  );
};

export default NotificationsPage;
