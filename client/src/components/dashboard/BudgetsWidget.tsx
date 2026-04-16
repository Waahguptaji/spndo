"use client";

import React from "react";
import WidgetCard from "./WidgetCard";
import ListItem from "../ui/ListItem";
import { ShoppingCart, Film, Car, Utensils ,SquareMenu} from "lucide-react";
import {getgoal,GoalResponse} from "@/lib/api/goals";
import { useState, useEffect } from "react";

const iconMap: { [key: string]: React.ReactNode } = {
  "Emergency Funds": (
    <ShoppingCart className="text-green-600 dark:text-green-400" size={28} />
  ),
  "Macbook": (
    <Film className="text-purple-600 dark:text-purple-400" size={28} />
  ),
"Marriage": (
    <SquareMenu className="text-purple-600 dark:text-purple-400" size={28} />
  ),
  
  "Parents-Future": <Car className="text-blue-600 dark:text-blue-400" size={28} />,
  "CARRIER": (
    <ShoppingCart className="text-pink-600 dark:text-pink-400" size={28} />
  ),
  "Education Loan": (
    <Utensils className="text-orange-600 dark:text-orange-400" size={28} />
  ),"Bossie-Bee Marriage": (
    <SquareMenu className="text-purple-600 dark:text-purple-400" size={28} />
  ),
  
};

// const budgetGoalsData = [
//   {
//     title: "Groceries",
//     progress: { current: 450, total: 600 },
//   },
//   {
//     title: "Entertainment",
//     progress: { current: 320, total: 300 }, // Over budget
//   },
//   {
//     title: "Transportation",
//     progress: { current: 280, total: 400 },
//   },
//   {
//     title: "Shopping",
//     progress: { current: 150, total: 250 },
//   },
//   {
//     title: "Dining Out",
//     progress: { current: 180, total: 200 },
//   },
// ];



const BudgetsWidget = () => {

  const [budgetGoalsData,setBudgetGoalsData] = useState<GoalResponse[]>([]);
  useEffect(()=>{
    const fetchGoals = async()=>{
      try{
      const data = await getgoal();
      setBudgetGoalsData(data);
      }catch(error){
        console.log("error")
      }
    }
    fetchGoals();
  },[])
  return (
    <WidgetCard title="Budgets">
      <div className="space-y-2">
        {budgetGoalsData.map((goal) => (
          <ListItem
            key={goal.title}
            variant="goal"
            title={goal.title}
            icon={iconMap[goal.title]}
            progress={{current:goal.progress_amount,total:goal.target_amount}}
            status={goal.status}
            icon1=""
            icon2=""
          />
        ))}
      </div>
    </WidgetCard>
  );
};

export default BudgetsWidget;
