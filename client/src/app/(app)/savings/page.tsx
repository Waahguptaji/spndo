"use client";

import { useEffect,useState } from "react";
import GoalsWidget from "@/components/dashboard/GoalsWidget";
import CircularPulseStat from "@/components/ui/CircularPulseStat";
import { getgoal } from "@/lib/api/goals";

export default function SavingsPage() {
  return (
    <div className="p-4 space-y-8">
      <SavingCircle />
      <div></div>
      <GoalsWidget />
    </div>
  );
}

function SavingCircle() {
  const [amount, setAmount] = useState(0);
  const [percentage, setPercentage] = useState(0);

 useEffect(() => {
    const fetchData = async () => {
      try {
        const goals = await getgoal();

        const totalTarget = goals.reduce(
          (sum, goal) => sum + Number(goal.target_amount),
          0,
        );

        const totalProgress = goals.reduce(
          (sum, goal) => sum + Number(goal.progress_amount),
          0,
        );

        setAmount(totalProgress);

        if (totalTarget > 0) {
          setPercentage((totalProgress / totalTarget) * 100);
        }
      } catch (err) {
        console.error("Error fetching goals data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <CircularPulseStat
      amount={amount}
      percentage={percentage}
      label="Savings towards goals"
      variant="savings"
      size="md"
    />
  );
}
