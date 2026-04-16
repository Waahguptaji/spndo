"use client"
import { Car, Film, ShoppingCart, Utensils,SquareMenu } from "lucide-react";

import React from "react";
import WidgetCard from "./WidgetCard";
import ListItem from "../ui/ListItem";
import {getgoal,GoalResponse} from "@/lib/api/goals";
import { useState, useEffect } from "react";
type Goal = {
  title: string;
  amount: number; // target amount
  current: number; // amount saved so far
  date: string;
  description: string;
};

// const goalsData: Goal[] = [
//   {
//     title: "Emergency Fund",
//     amount: 5000,
//     current: 2750,
//     date: "2025-12-31",
//     description: "Build a safety net for unexpected expenses.",
//   },
//   {
//     title: "Vacation",
//     amount: 2500,
//     current: 1200,
//     date: "2025-07-15",
//     description: "Summer trip to Japan.",
//   },
//   {
//     title: "New Laptop",
//     amount: 1500,
//     current: 900,
//     date: "2025-03-01",
//     description: "Upgrade to a reliable work laptop.",
//   },
//   {
//     title: "Shopping",
//     amount: 400,
//     current: 180,
//     date: "2025-10-01",
//     description: "Budget for seasonal wardrobe updates.",
//   },
//   {
//     title: "Dining Out",
//     amount: 200,
//     current: 60,
//     date: "2025-05-01",
//     description: "Monthly budget for restaurants and cafes.",
//   },
// ];

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

const GoalsWidget = () => {
  const [goalsData,setGoalsData] = useState<GoalResponse[]>([]);

  useEffect(()=>{
    const fetchGoals= async() =>{
      try{
      const data = await getgoal();
      setGoalsData(data);

      }catch(error){
       console.log("error while fetching the goal data === " + error);
      }


    }
    fetchGoals();
  },[])
  return (
    <WidgetCard title="Goals" href="/goals">
      <div className="space-y-2">
        {goalsData.map((goal) => (
          <ListItem
            key={goal.title}
            variant="goal"
            title={goal.title}
            icon={iconMap[goal.title]}
            progress={{ current: goal.progress_amount, total: goal.target_amount }}
            status={goal.status}
            icon1=""
            icon2=""
          />
        ))}
      </div>
    </WidgetCard>
  );
};

export default GoalsWidget;
