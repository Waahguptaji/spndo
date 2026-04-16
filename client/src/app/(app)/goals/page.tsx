"use client";
import { Car, Film, ShoppingCart, Utensils,SquareMenu,Pen,Trash } from "lucide-react";
import React from "react";
import ListItem from "@/components/ui/ListItem";
import WidgetCard from "@/components/dashboard/WidgetCard";
import AddGoalButton from "@/components/goal/AddGoalButton";
import {getgoal,GoalResponse,delGoal,updateGoal} from "@/lib/api/goals";
import { useState, useEffect } from "react";
import AddGoalForm from "@/components/goal/AddGoalForm"
import Modal from "@/components/ui/Modal";
type Goal = {
  title: string;
  amount: number;
  current: number;
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

// const iconMap: { [key: string]: React.ReactNode } = {
//   "Emergency Fund": (
//     <ShoppingCart className="text-green-600 dark:text-green-400" size={28} />
//   ),
//   "New Laptop": (
//     <Film className="text-purple-600 dark:text-purple-400" size={28} />
//   ),
//   Vacation: <Car className="text-blue-600 dark:text-blue-400" size={28} />,
//   Shopping: (
//     <ShoppingCart className="text-pink-600 dark:text-pink-400" size={28} />
//   ),
//   "Dining Out": (
//     <Utensils className="text-orange-600 dark:text-orange-400" size={28} />
//   ),
// };



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

const GoalsPage = () => {
  const [goalsData,setGoalsData] = useState<GoalResponse[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<GoalResponse | null>(null);
const [isEditOpen, setIsEditOpen] = useState(false);


  const handleDelete = async(id:string)=>{
    try {
      await delGoal(id);
      console.log("deleted id === " + id)
      setGoalsData((prev)=>prev.filter((g)=>g.id!==id));
    }catch(error){
      console.error("cannot delete : " + error);
    }
  
  }
  const handleEdit = (goal: GoalResponse) => {
  setSelectedGoal(goal);
  setIsEditOpen(true);
};
  useEffect(()=>{
    const fetchGoals = async()=>{
      try{
        const data = await getgoal();
        setGoalsData(data);

      }
      catch(error){
        console.error("Error fetching goals: ",error);
      }
    }
    fetchGoals();
  },[])
console.log(goalsData+ "this is goals data");
  return (
    <WidgetCard title="All Goals" actionSlot={<AddGoalButton />}>
      {goalsData.map((goal) => (
        <ListItem
          key={goal.id}
          variant="goal"
          title={goal.title}
           icon={iconMap[goal.title]}
          progress={{ current: goal.progress_amount, total: goal.target_amount }}
          status={goal.status}
          icon1={<Pen className="w-[15px]" onClick={()=>handleEdit(goal)}/>}
            icon2={<Trash className="w-[15px]" onClick={()=>handleDelete(goal.id)}/>}
        />
      ))}{isEditOpen && selectedGoal && (
  <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title="Update Goal" className="p-8">
    <AddGoalForm
      goal={selectedGoal}
      onSuccess={() => {
        setIsEditOpen(false);
        setGoalsData((prev) =>
          prev.map((g) =>
            g.id === selectedGoal.id ? selectedGoal : g
          )
        );
      }}
    />
  </Modal>
)}
    </WidgetCard>
  );
};

export default GoalsPage;
